import { createHighlightBox, updateHighlight, createConfirmOverlay, isPromptOpen, isInternalUiElement, preventPageScroll, restorePageScroll } from "../../ui/overlay.js";
import { cropElementCapture } from "../../utils/image.js";
import { removeNode, sleep } from "../../utils/dom.js";

export function createElementCaptureMode({
	captureClient,
	promptService,
	doc,
	win,
	session,
}) {
	async function run({ highRes }) {
		if (!session.acquire()) {
			return;
		}

		const selection = createElementSelectionSession({
			captureClient,
			promptService,
			doc,
			win,
			highRes,
		});

		try {
			await selection.start();
		} finally {
			selection.cleanup();
			session.release();
		}
	}

	return { run };
}

function createElementSelectionSession({
	captureClient,
	promptService,
	doc,
	win,
	highRes,
}) {
	let currentTarget = null;
	let selectedTarget = null;
	let highlight = null;
	let confirmOverlay = null;
	let isHoverTrackingEnabled = false;

	const cleanupStack = [];

	async function start() {
		highlight = createHighlightBox(doc);
		doc.body.appendChild(highlight);

		addListener(doc, "keydown", onKeyDown, true);
		enterHoverMode();

		return new Promise((resolve) => {
			cleanupStack.push(resolve);
		});
	}

	function cleanup() {
		exitHoverMode();
		restorePageScroll(doc);
		removeNode(confirmOverlay);
		removeNode(highlight);
		confirmOverlay = null;
		highlight = null;
		selectedTarget = null;
		currentTarget = null;

		while (cleanupStack.length > 0) {
			const item = cleanupStack.pop();
			if (typeof item === "function") {
				try {
					item();
				} catch {
					// Best-effort cleanup only.
				}
			}
		}
	}

	function enterHoverMode() {
		if (isHoverTrackingEnabled) {
			return;
		}

		isHoverTrackingEnabled = true;
		addListener(doc, "mousemove", onMouseMove, true);
		addListener(doc, "mousedown", onMouseDown, true);
	}

	function exitHoverMode() {
		if (!isHoverTrackingEnabled) {
			return;
		}

		isHoverTrackingEnabled = false;
		removeTrackedListener(doc, "mousemove", onMouseMove, true);
		removeTrackedListener(doc, "mousedown", onMouseDown, true);
	}

	function finish() {
		const resolver = cleanupStack.findLast((entry) => typeof entry === "function");

		cleanup();

		if (resolver) {
			resolver();
		}
	}

	function onMouseMove(event) {
		const target = getSelectableTarget(event.target);
		currentTarget = target;
		updateHighlight(highlight, target);
	}

	function onMouseDown(event) {
		if (!currentTarget) {
			return;
		}

		if (isPromptOpen(doc)) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		selectedTarget = currentTarget;
		exitHoverMode();
		updateHighlight(highlight, selectedTarget);
		showConfirmOverlay();
	}

	function onKeyDown(event) {
		if (isPromptOpen(doc)) {
			return;
		}

		if (event.key !== "Escape") {
			return;
		}

		event.preventDefault();
		finish();
	}

	function showConfirmOverlay() {
		removeNode(confirmOverlay);

		const rect = selectedTarget.getBoundingClientRect();
		confirmOverlay = createConfirmOverlay({
			doc,
			rect,
			onRetake: handleRetake,
			onSave: handleSave,
		});

		doc.body.appendChild(confirmOverlay);
		preventPageScroll(doc);
	}

	function handleRetake(event) {
		event.stopPropagation();

		selectedTarget = null;
		restorePageScroll(doc);
		removeNode(confirmOverlay);
		confirmOverlay = null;
		updateHighlight(highlight, null);
		enterHoverMode();
	}

	async function handleSave(event) {
		event.stopPropagation();

		const filename = await promptService.promptFilename();
		if (!filename) {
			return;
		}

		const target = selectedTarget;
		if (!target) {
			finish();
			return;
		}

		restorePageScroll(doc);
		removeNode(confirmOverlay);
		removeNode(highlight);
		confirmOverlay = null;
		highlight = null;

		await sleep(50);

		const dataUrl = await cropElementCapture({
			captureClient,
			element: target,
			highRes,
			win,
		});

		await captureClient.download(dataUrl, filename);
		finish();
	}

	function addListener(target, eventName, handler, options) {
		target.addEventListener(eventName, handler, options);
		cleanupStack.push(() => {
			target.removeEventListener(eventName, handler, options);
		});
	}

	function removeTrackedListener(target, eventName, handler, options) {
		target.removeEventListener(eventName, handler, options);
	}

	return {
		start,
		cleanup,
	};
}

function getSelectableTarget(target) {
	if (!(target instanceof Element)) {
		return null;
	}

	if (isInternalUiElement(target)) {
		return null;
	}

	return target;
}

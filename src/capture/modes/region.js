import {
	createRegionOverlay,
	createRegionSelectionBox,
	updateRegionSelectionBox,
	hideRegionSelectionBox,
	createRegionActionBar,
	isPromptOpen,
	isInternalUiElement,
	preventPageScroll,
	restorePageScroll,
} from "../../ui/overlay.js";
import { cropRegionCapture, writeImageToClipboard } from "../../utils/image.js";
import { generateAutoFilename, removeNode, sleep, getClientPoint, createViewportRect, isUsableSelection } from "../../utils/index.js";

export function createRegionCaptureMode({
	captureClient,
	promptService,
	doc,
	win,
	session,
}) {
	async function run({
		highRes,
		format = "png",
		quality = 85,
		delay = 0,
		clipboard = false,
		autoSave = false,
	}) {
		if (!session.acquire()) {
			return;
		}

		const selection = createRegionSelectionSession({
			captureClient,
			promptService,
			doc,
			win,
			highRes,
			format,
			quality,
			delay,
			clipboard,
			autoSave,
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

function createRegionSelectionSession({
	captureClient,
	promptService,
	doc,
	win,
	highRes,
	format = "png",
	quality = 85,
	delay = 0,
	clipboard = false,
	autoSave = false,
}) {
	let overlay = null;
	let selectionBox = null;
	let actionBar = null;
	let dragStartPoint = null;
	let selectedRect = null;
	let phase = "idle";
	let resolveStart = null;
	let finished = false;

	async function start() {
		overlay = createRegionOverlay(doc);
		selectionBox = createRegionSelectionBox(doc);

		overlay.appendChild(selectionBox);
		doc.body.appendChild(overlay);

		overlay.addEventListener("mousedown", onMouseDown, true);
		overlay.addEventListener("mousemove", onMouseMove, true);
		overlay.addEventListener("mouseup", onMouseUp, true);
		doc.addEventListener("keydown", onKeyDown, true);

		return new Promise((resolve) => {
			resolveStart = resolve;
		});
	}

	function cleanup() {
		if (overlay) {
			overlay.removeEventListener("mousedown", onMouseDown, true);
			overlay.removeEventListener("mousemove", onMouseMove, true);
			overlay.removeEventListener("mouseup", onMouseUp, true);
		}

		doc.removeEventListener("keydown", onKeyDown, true);

		restorePageScroll(doc);
		removeNode(actionBar);
		removeNode(overlay);

		actionBar = null;
		overlay = null;
		selectionBox = null;
		dragStartPoint = null;
		selectedRect = null;
		phase = "idle";
	}

	function finish() {
		if (finished) {
			return;
		}

		finished = true;
		cleanup();
		resolveStart?.();
	}

	function onMouseDown(event) {
		if (phase === "confirming") {
			return;
		}

		if (event.button !== 0) {
			return;
		}

		if (isPromptOpen(doc)) {
			return;
		}

		if (isInternalUiElement(event.target)) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		phase = "dragging";
		dragStartPoint = getClientPoint(event);
		selectedRect = createViewportRect(dragStartPoint, dragStartPoint, win);

		removeNode(actionBar);
		actionBar = null;
		updateRegionSelectionBox(selectionBox, selectedRect);
	}

	function onMouseMove(event) {
		if (phase !== "dragging" || !dragStartPoint) {
			return;
		}

		event.preventDefault();

		selectedRect = createViewportRect(dragStartPoint, getClientPoint(event), win);

		updateRegionSelectionBox(selectionBox, selectedRect);
	}

	function onMouseUp(event) {
		if (phase !== "dragging" || !dragStartPoint) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		selectedRect = createViewportRect(dragStartPoint, getClientPoint(event), win);

		dragStartPoint = null;

		if (!isUsableSelection(selectedRect)) {
			selectedRect = null;
			phase = "idle";
			hideRegionSelectionBox(selectionBox);
			return;
		}

		phase = "confirming";
		showActionBar();
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

	function showActionBar() {
		preventPageScroll(doc);
		removeNode(actionBar);

		actionBar = createRegionActionBar({
			doc,
			rect: selectedRect,
			win,
			onRetake: handleRetake,
			onSave: handleSave,
		});

		overlay.appendChild(actionBar);
	}

	function handleRetake(event) {
		event.stopPropagation();

		phase = "idle";
		selectedRect = null;

		restorePageScroll(doc);
		removeNode(actionBar);
		actionBar = null;
		hideRegionSelectionBox(selectionBox);
	}

	async function handleSave(event) {
		event.stopPropagation();

		let filename;
		if (autoSave) {
			filename = generateAutoFilename(format);
		} else {
			filename = await promptService.promptFilename("screenshot", format);
			if (!filename) {
				return;
			}
		}

		const rect = selectedRect;
		if (!rect) {
			finish();
			return;
		}

		restorePageScroll(doc);
		removeNode(actionBar);
		removeNode(overlay);

		actionBar = null;
		overlay = null;
		selectionBox = null;

		doc.removeEventListener("keydown", onKeyDown, true);

		await sleep(50 + delay * 1000);

		const dataUrl = await cropRegionCapture({ captureClient, rect, highRes, format, quality, win });
		await captureClient.download(dataUrl, filename);

		if (clipboard) {
			await writeImageToClipboard(dataUrl);
		}

		finish();
	}

	return {
		start,
		cleanup,
	};
}

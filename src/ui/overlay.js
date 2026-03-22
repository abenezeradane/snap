import { UI_IDS, UI_Z_INDEX } from "../core/constants.js";
import { createElement, applyStyles, clamp, removeNode } from "../utils/dom.js";

export function createHighlightBox(doc) {
	return createElement(doc, "div", {
		id: UI_IDS.HIGHLIGHT,
		styles: {
			position: "fixed",
			pointerEvents: "none",
			zIndex: UI_Z_INDEX.OVERLAY,
			display: "none",
			background: "rgba(255, 105, 180, 0.25)",
			border: "2px solid rgba(255, 105, 180, 0.7)",
			transition: "top 0.05s, left 0.05s, width 0.05s, height 0.05s",
		},
	});
}

export function updateHighlight(highlight, element) {
	if (!highlight) {
		return;
	}

	if (!element) {
		highlight.style.display = "none";
		return;
	}

	const rect = element.getBoundingClientRect();

	highlight.style.display = "block";
	highlight.style.left = `${rect.left}px`;
	highlight.style.top = `${rect.top}px`;
	highlight.style.width = `${rect.width}px`;
	highlight.style.height = `${rect.height}px`;
}

export function createConfirmOverlay({
	doc,
	rect,
	onRetake,
	onSave,
}) {
	const overlay = createElement(doc, "div", {
		id: UI_IDS.CONFIRM,
		styles: {
			position: "fixed",
			inset: "0",
			zIndex: UI_Z_INDEX.OVERLAY,
		},
	});

	const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("width", "100%");
	svg.setAttribute("height", "100%");
	applyStyles(svg, {
		position: "absolute",
		inset: "0",
		width: "100%",
		height: "100%",
	});

	const defs = doc.createElementNS("http://www.w3.org/2000/svg", "defs");
	const mask = doc.createElementNS("http://www.w3.org/2000/svg", "mask");
	const maskId = `element-mask-${Date.now()}`;

	mask.setAttribute("id", maskId);

	const maskBackground = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
	maskBackground.setAttribute("width", "100%");
	maskBackground.setAttribute("height", "100%");
	maskBackground.setAttribute("fill", "white");

	const maskCutout = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
	maskCutout.setAttribute("x", `${rect.left}`);
	maskCutout.setAttribute("y", `${rect.top}`);
	maskCutout.setAttribute("width", `${rect.width}`);
	maskCutout.setAttribute("height", `${rect.height}`);
	maskCutout.setAttribute("fill", "black");

	mask.append(maskBackground, maskCutout);
	defs.appendChild(mask);
	svg.appendChild(defs);

	const dimmer = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
	dimmer.setAttribute("width", "100%");
	dimmer.setAttribute("height", "100%");
	dimmer.setAttribute("fill", "rgba(0, 0, 0, 0.5)");
	dimmer.setAttribute("mask", `url(#${maskId})`);
	svg.appendChild(dimmer);

	const actionBar = createActionBar({
		doc,
		rect,
		win: window,
		onRetake,
		onSave,
	});

	overlay.append(svg, actionBar);

	return overlay;
}

export function createRegionOverlay(doc) {
	return createElement(doc, "div", {
		id: UI_IDS.REGION_OVERLAY,
		styles: {
			position: "fixed",
			inset: "0",
			zIndex: UI_Z_INDEX.OVERLAY,
			cursor: "crosshair",
			background: "rgba(0, 0, 0, 0.18)",
			userSelect: "none",
		},
	});
}

export function createRegionSelectionBox(doc) {
	return createElement(doc, "div", {
		id: UI_IDS.REGION_SELECTION,
		styles: {
			position: "fixed",
			display: "none",
			border: "2px solid rgba(74, 144, 217, 0.95)",
			background: "rgba(74, 144, 217, 0.18)",
			boxSizing: "border-box",
			pointerEvents: "none",
		},
	});
}

export function updateRegionSelectionBox(selectionBox, rect) {
	if (!selectionBox || !rect) {
		return;
	}

	selectionBox.style.display = "block";
	selectionBox.style.left = `${rect.left}px`;
	selectionBox.style.top = `${rect.top}px`;
	selectionBox.style.width = `${rect.width}px`;
	selectionBox.style.height = `${rect.height}px`;
}

export function hideRegionSelectionBox(selectionBox) {
	if (!selectionBox) {
		return;
	}

	selectionBox.style.display = "none";
}

export function createRegionActionBar({
	doc,
	rect,
	win,
	onRetake,
	onSave,
}) {
	const actionBar = createElement(doc, "div", {
		id: UI_IDS.REGION_ACTIONS,
		styles: getActionBarStyles(rect, win),
	});

	const retakeButton = createButton(doc, {
		label: "Retake",
		background: "#666",
		color: "#fff",
	});

	const saveButton = createButton(doc, {
		label: "Save",
		background: "#4a90d9",
		color: "#fff",
	});

	actionBar.addEventListener("mousedown", (event) => {
		event.stopPropagation();
	});

	retakeButton.addEventListener("click", onRetake);
	saveButton.addEventListener("click", onSave);

	actionBar.append(retakeButton, saveButton);
	return actionBar;
}

export function isInternalUiElement(element) {
	if (!element) {
		return false;
	}

	return Boolean(
		element.closest(
			[
				`#${UI_IDS.HIGHLIGHT}`,
				`#${UI_IDS.CONFIRM}`,
				`#${UI_IDS.FILENAME_PROMPT}`,
			].join(", "),
		),
	);
}

export function isPromptOpen(doc) {
	return Boolean(doc.getElementById(UI_IDS.FILENAME_PROMPT));
}

function createButton(doc, {
	label,
	background,
	color
}) {
	return createElement(doc, "button", {
		textContent: label,
		styles: {
			padding: "6px 16px",
			border: "none",
			borderRadius: "4px",
			background,
			color,
			cursor: "pointer",
			fontSize: "13px",
			fontFamily: "system-ui, sans-serif",
		},
	});
}

function createActionBar({
	doc,
	rect,
	win,
	onRetake,
	onSave,
}) {
	const actionBar = createElement(doc, "div", {
		styles: getActionBarStyles(rect, win),
	});

	const retakeButton = createButton(doc, {
		label: "Retake",
		background: "#666",
		color: "#fff",
	});

	const saveButton = createButton(doc, {
		label: "Save",
		background: "#4a90d9",
		color: "#fff",
	});

	retakeButton.addEventListener("click", onRetake);
	saveButton.addEventListener("click", onSave);

	actionBar.append(retakeButton, saveButton);
	return actionBar;
}

export function preventPageScroll(doc) {
	doc.body.style.overflow = "hidden";
}

export function restorePageScroll(doc) {
	doc.body.style.overflow = "";
}

function getActionBarStyles(rect, win) {
	const width = 160;
	const left = Math.min(Math.max(rect.right - width, 8), win.innerWidth - width - 8);
	const top = Math.min(Math.max(rect.bottom + 8, 8), win.innerHeight - 44);

	return {
		position: "fixed",
		zIndex: UI_Z_INDEX.DIALOG,
		display: "flex",
		gap: "8px",
		padding: "4px",
		left: `${left}px`,
		top: `${top}px`,
	};
}

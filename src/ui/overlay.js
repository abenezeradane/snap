import { UI_IDS, UI_Z_INDEX } from "../core/constants.js";
import { createElement, applyStyles, clamp, removeNode } from "../utils/dom.js";
import anime from "animejs";

const OVERLAY_TOKENS = {
	dark: {
		panelBg: "linear-gradient(180deg, #272729, #1d1d1f)",
		border: "rgba(255, 255, 255, 0.10)",
		shadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
		secondaryBg: "rgba(255, 255, 255, 0.08)",
		secondaryBgHover: "rgba(255, 255, 255, 0.14)",
		secondaryBorder: "rgba(255, 255, 255, 0.12)",
		color: "#ffffff",
	},
	light: {
		panelBg: "linear-gradient(180deg, #ffffff, #f5f5f7)",
		border: "rgba(0, 0, 0, 0.10)",
		shadow: "0 8px 32px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
		secondaryBg: "rgba(0, 0, 0, 0.04)",
		secondaryBgHover: "rgba(0, 0, 0, 0.08)",
		secondaryBorder: "rgba(0, 0, 0, 0.10)",
		color: "#1d1d1f",
	},
};

function getTheme(win) {
	return win.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function createHighlightBox(doc) {
	return createElement(doc, "div", {
		id: UI_IDS.HIGHLIGHT,
		styles: {
			position: "fixed",
			pointerEvents: "none",
			zIndex: UI_Z_INDEX.OVERLAY,
			display: "none",
			background: "rgba(0, 113, 227, 0.12)",
			border: "2px solid rgba(0, 113, 227, 0.75)",
			borderRadius: "3px",
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
	const isFirstShow = highlight.style.display === "none";

	highlight.style.display = "block";
	highlight.style.left = `${rect.left}px`;
	highlight.style.top = `${rect.top}px`;
	highlight.style.width = `${rect.width}px`;
	highlight.style.height = `${rect.height}px`;

	if (isFirstShow) {
		anime({
			targets: highlight,
			opacity: [0, 1],
			scale: [0.94, 1],
			duration: 200,
			easing: "easeOutCubic",
		});
	}
}

export function createConfirmOverlay({
	doc,
	rect,
	win = window,
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

	const tokens = OVERLAY_TOKENS[getTheme(win)];
	const actionBar = createActionBar({
		doc,
		rect,
		win,
		tokens,
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
			border: "2px solid rgba(0, 113, 227, 0.9)",
			background: "rgba(0, 113, 227, 0.12)",
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
	const tokens = OVERLAY_TOKENS[getTheme(win)];
	const actionBar = createElement(doc, "div", {
		id: UI_IDS.REGION_ACTIONS,
		styles: getActionBarStyles(rect, win, tokens),
	});

	const retakeButton = createButton(doc, { label: "Retake", variant: "secondary", tokens });
	const saveButton = createButton(doc, { label: "Save", variant: "primary", tokens });

	actionBar.addEventListener("mousedown", (event) => {
		event.stopPropagation();
	});

	retakeButton.addEventListener("click", onRetake);
	saveButton.addEventListener("click", onSave);

	actionBar.append(retakeButton, saveButton);

	win.requestAnimationFrame(() => {
		anime({
			targets: actionBar,
			opacity: [0, 1],
			translateY: [10, 0],
			easing: "spring(1, 80, 10, 0)",
		});
	});

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

function createButton(doc, { label, variant = "secondary", tokens }) {
	const isPrimary = variant === "primary";
	const defaultBg = isPrimary ? "#0071e3" : tokens.secondaryBg;
	const hoverBg   = isPrimary ? "#0077ed" : tokens.secondaryBgHover;

	const btn = createElement(doc, "button", {
		textContent: label,
		styles: {
			padding: "7px 14px",
			border: "1px solid",
			borderColor: isPrimary ? "transparent" : tokens.secondaryBorder,
			borderRadius: "8px",
			background: defaultBg,
			color: isPrimary ? "#ffffff" : tokens.color,
			cursor: "pointer",
			fontSize: "13px",
			fontWeight: "500",
			fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
			letterSpacing: "-0.08px",
			lineHeight: "1",
			whiteSpace: "nowrap",
			boxShadow: isPrimary ? "inset 0 1px 0 rgba(255, 255, 255, 0.12)" : "none",
		},
	});

	btn.addEventListener("mouseenter", () => { btn.style.background = hoverBg; });
	btn.addEventListener("mouseleave", () => { btn.style.background = defaultBg; });

	return btn;
}

function createActionBar({
	doc,
	rect,
	win,
	tokens,
	onRetake,
	onSave,
}) {
	const actionBar = createElement(doc, "div", {
		styles: getActionBarStyles(rect, win, tokens),
	});

	const retakeButton = createButton(doc, { label: "Retake", variant: "secondary", tokens });
	const saveButton = createButton(doc, { label: "Save", variant: "primary", tokens });

	retakeButton.addEventListener("click", onRetake);
	saveButton.addEventListener("click", onSave);

	actionBar.append(retakeButton, saveButton);

	win.requestAnimationFrame(() => {
		anime({
			targets: actionBar,
			opacity: [0, 1],
			translateY: [10, 0],
			easing: "spring(1, 80, 10, 0)",
		});
	});

	return actionBar;
}

export function preventPageScroll(doc) {
	doc.body.style.overflow = "hidden";
}

export function restorePageScroll(doc) {
	doc.body.style.overflow = "";
}

function getActionBarStyles(rect, win, tokens) {
	const width = 184;
	const left = Math.min(Math.max(rect.right - width, 8), win.innerWidth - width - 8);
	const top = Math.min(Math.max(rect.bottom + 8, 8), win.innerHeight - 56);

	return {
		position: "fixed",
		zIndex: UI_Z_INDEX.DIALOG,
		display: "flex",
		gap: "6px",
		padding: "6px",
		left: `${left}px`,
		top: `${top}px`,
		opacity: "0",
		borderRadius: "12px",
		background: tokens.panelBg,
		border: `1px solid ${tokens.border}`,
		boxShadow: tokens.shadow,
		backdropFilter: "blur(20px) saturate(1.4)",
		WebkitBackdropFilter: "blur(20px) saturate(1.4)",
	};
}

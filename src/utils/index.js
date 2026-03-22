export * from "./dom.js";
export * from "./image.js";

export function normalizeFilename(value) {
	const baseName = (value || "").trim() || "screenshot";
	const sanitized = baseName
		.replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
		.replace(/\.+$/g, "")
		.slice(0, 200);

	return sanitized.endsWith(".png") ? sanitized : `${sanitized}.png`;
}

export function getClientPoint(event) {
	return {
		x: event.clientX,
		y: event.clientY,
	};
}

export function createViewportRect(startPoint, endPoint, win) {
	const left = Math.min(Math.max(Math.min(startPoint.x, endPoint.x), 0), win.innerWidth);
	const top = Math.min(Math.max(Math.min(startPoint.y, endPoint.y), 0), win.innerHeight);
	const right = Math.min(Math.max(Math.max(startPoint.x, endPoint.x), 0), win.innerWidth);
	const bottom = Math.min(Math.max(Math.max(startPoint.y, endPoint.y), 0), win.innerHeight);

	return {
		left,
		top,
		right,
		bottom,
		width: Math.max(0, right - left),
		height: Math.max(0, bottom - top),
	};
}

export function isUsableSelection(rect, minimumSize = 8) {
	return rect && rect.width >= minimumSize && rect.height >= minimumSize;
}

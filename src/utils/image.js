import { CanvasError, ImageLoadError } from "../core/errors.js";

export function loadImage(dataUrl) {
	return new Promise((resolve, reject) => {
		const image = new Image();

		image.onload = () => resolve(image);
		image.onerror = () => reject(new ImageLoadError());
		image.src = dataUrl;
	});
}

export function getCanvasContext(canvas) {
	const context = canvas.getContext("2d");
	if (!context) {
		throw new CanvasError();
	}

	return context;
}

function canvasToDataUrl(canvas, format = "png", quality = 85) {
	if (format === "jpeg") return canvas.toDataURL("image/jpeg", quality / 100);
	if (format === "webp") return canvas.toDataURL("image/webp", quality / 100);
	return canvas.toDataURL("image/png");
}

export async function writeImageToClipboard(dataUrl) {
	try {
		const blob = await fetch(dataUrl).then((r) => r.blob());
		await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
	} catch {
		// Best-effort; clipboard access may not be available in all contexts.
	}
}

export function scaleCapturedImage({ dataUrl, highRes, format = "png", quality = 85 }) {
	return loadImage(dataUrl).then((image) => {
		const scale = highRes ? 1 : 1 / (window.devicePixelRatio || 1);
		const canvas = document.createElement("canvas");
		const context = getCanvasContext(canvas);

		canvas.width = Math.max(1, Math.round(image.width * scale));
		canvas.height = Math.max(1, Math.round(image.height * scale));

		context.drawImage(image, 0, 0, canvas.width, canvas.height);
		return canvasToDataUrl(canvas, format, quality);
	});
}

export function cropRegionCapture({ captureClient, rect, highRes, format = "png", quality = 85, win }) {
	return captureClient.requestTabCapture()
		.then(loadImage)
		.then((image) => {
			const sourceScaleX = image.width / win.innerWidth;
			const sourceScaleY = image.height / win.innerHeight;
			const outputScale = highRes ? sourceScaleX : 1;

			const canvas = document.createElement("canvas");
			const context = getCanvasContext(canvas);

			canvas.width = Math.max(1, Math.round(rect.width * outputScale));
			canvas.height = Math.max(1, Math.round(rect.height * outputScale));

			context.drawImage(
				image,
				rect.left * sourceScaleX,
				rect.top * sourceScaleY,
				rect.width * sourceScaleX,
				rect.height * sourceScaleY,
				0,
				0,
				canvas.width,
				canvas.height,
			);

			return canvasToDataUrl(canvas, format, quality);
		});
}

export function cropElementCapture({ captureClient, element, highRes, format = "png", quality = 85, win }) {
	const rect = element.getBoundingClientRect();
	return captureClient.requestTabCapture()
		.then(loadImage)
		.then((image) => {
			const sourceScaleX = image.width / win.innerWidth;
			const sourceScaleY = image.height / win.innerHeight;
			const outputScale = highRes ? sourceScaleX : 1;

			const canvas = document.createElement("canvas");
			const context = getCanvasContext(canvas);

			canvas.width = Math.max(1, Math.round(rect.width * outputScale));
			canvas.height = Math.max(1, Math.round(rect.height * outputScale));

			context.drawImage(
				image,
				rect.left * sourceScaleX,
				rect.top * sourceScaleY,
				rect.width * sourceScaleX,
				rect.height * sourceScaleY,
				0,
				0,
				canvas.width,
				canvas.height,
			);

			return canvasToDataUrl(canvas, format, quality);
		});
}

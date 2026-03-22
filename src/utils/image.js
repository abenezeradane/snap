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

export function scaleCapturedImage({
	dataUrl,
	highRes
}) {
	return loadImage(dataUrl).then((image) => {
		const scale = highRes ? 1 : 1 / (window.devicePixelRatio || 1);
		const canvas = document.createElement("canvas");
		const context = getCanvasContext(canvas);

		canvas.width = Math.max(1, Math.round(image.width * scale));
		canvas.height = Math.max(1, Math.round(image.height * scale));

		context.drawImage(image, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/png");
	});
}

export function cropRegionCapture({
	captureClient,
	rect,
	highRes,
	win,
}) {
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

			return canvas.toDataURL("image/png");
		});
}

export function cropElementCapture({
	captureClient,
	element,
	highRes,
	win,
}) {
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

			return canvas.toDataURL("image/png");
		});
}

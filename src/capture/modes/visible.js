import { scaleCapturedImage, writeImageToClipboard } from "../../utils/image.js";
import { generateAutoFilename } from "../../utils/index.js";
import { sleep } from "../../utils/dom.js";

export function createVisibleCaptureMode({
	captureClient,
	promptService,
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

		try {
			// User-configured delay — lets them set up the screen state before capture.
			if (delay > 0) {
				await sleep(delay * 1000);
			}

			const rawDataUrl = await captureClient.requestTabCapture();
			const finalDataUrl = await scaleCapturedImage({ dataUrl: rawDataUrl, highRes, format, quality });

			let filename;
			if (autoSave) {
				filename = generateAutoFilename(format);
			} else {
				filename = await promptService.promptFilename("screenshot", format);
				if (!filename) {
					return;
				}
			}

			await captureClient.download(finalDataUrl, filename);

			if (clipboard) {
				await writeImageToClipboard(finalDataUrl);
			}
		} finally {
			session.release();
		}
	}

	return { run };
}

import { scaleCapturedImage } from "../../utils/image.js";

export function createVisibleCaptureMode({
	captureClient,
	promptService,
	session,
}) {
	async function run({ highRes }) {
		if (!session.acquire()) {
			return;
		}

		try {
			const rawDataUrl = await captureClient.requestTabCapture();
			const finalDataUrl = await scaleCapturedImage({
				dataUrl: rawDataUrl,
				highRes,
			});

			const filename = await promptService.promptFilename();
			if (!filename) {
				return;
			}

			await captureClient.download(finalDataUrl, filename);
		} finally {
			session.release();
		}
	}

	return { run };
}

import { CaptureActions } from "../core/constants.js";
import { RuntimeError } from "../core/errors.js";

export function createCaptureClient({
	runtime,
	win
}) {
	async function requestTabCapture() {
		const response = await sendRuntimeMessage(runtime, {
			action: CaptureActions.CAPTURE_TAB,
		});

		if (!response?.ok) {
			throw new RuntimeError(CaptureActions.CAPTURE_TAB, response?.error || "capture tab failed");
		}

		if (!response.dataUrl) {
			throw new RuntimeError(CaptureActions.CAPTURE_TAB, "missing data URL");
		}

		return response.dataUrl;
	}

	async function download(dataUrl, filename) {
		const response = await sendRuntimeMessage(runtime, {
			action: CaptureActions.DOWNLOAD,
			dataUrl,
			filename,
		});

		if (!response?.ok) {
			throw new RuntimeError(CaptureActions.DOWNLOAD, response?.error || "download failed");
		}

		return response.downloadId;
	}

	function sendRuntimeMessage(runtime, payload) {
		return new Promise((resolve, reject) => {
			runtime.sendMessage(payload, (response) => {
				const runtimeError = chrome.runtime.lastError;
				if (runtimeError) {
					reject(new RuntimeError(payload.action, runtimeError.message));
					return;
				}

				resolve(response);
			});
		});
	}

	return {
		requestTabCapture,
		download,
		devicePixelRatio: () => win.devicePixelRatio || 1,
	};
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "startCapture") {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const tabId = tabs[0].id;

			chrome.scripting.executeScript({
				target: { tabId },
				files: ["dist/content-script.js"]
			}, () => {
				chrome.tabs.sendMessage(tabId, {
					action: "capture",
					mode: message.mode,
					hiRes: message.hiRes,
				});
			});
		});

		sendResponse({ ok: true });
		return false;
	}

	if (message.action === "captureTab") {
		chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
			if (chrome.runtime.lastError) {
				sendResponse({
					ok: false,
					error: chrome.runtime.lastError.message,
				});
				return;
			}

			sendResponse({
				ok: true,
				dataUrl,
			});
		});

		return true;
	}

	if (message.action === "download") {
		chrome.downloads.download(
			{
				url: message.dataUrl,
				filename: message.filename,
				saveAs: false,
			},
			(downloadId) => {
				if (chrome.runtime.lastError) {
					sendResponse({
						ok: false,
						error: chrome.runtime.lastError.message,
					});
					return;
				}

				sendResponse({
					ok: true,
					downloadId,
				});
			},
		);

		return true;
	}

	sendResponse({
		ok: false,
		error: `Unknown action: ${message?.action ?? "undefined"}`,
	});

	return false;
});
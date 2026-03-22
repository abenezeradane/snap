import { jest } from "@jest/globals";
import { createCaptureClient } from "../../../src/capture/client.js";
import { CaptureActions } from "../../../src/core/constants.js";
import { RuntimeError } from "../../../src/core/errors.js";

function createMockRuntime() {
	return {
		sendMessage: jest.fn((payload, callback) => {
			if (mockRuntime._reject) {
				const err = mockRuntime._lastError;
				mockRuntime._reject = false;
				callback();
				throw new Error("lastError check must be done before callback");
			}
			const response = mockRuntime._response;
			mockRuntime._response = null;
			callback(response);
		}),
	};
}

let mockRuntime;
let captureClient;

beforeEach(() => {
	mockRuntime = {
		sendMessage: jest.fn(),
		_response: null,
		_reject: false,
		_lastError: null,
	};

	mockRuntime.sendMessage.mockImplementation((payload, callback) => {
		if (mockRuntime._reject) {
			Object.defineProperty(chrome.runtime, "lastError", {
				value: { message: mockRuntime._lastError },
				configurable: true,
			});
			callback();
			return;
		}
		callback(mockRuntime._response);
	});

	captureClient = createCaptureClient({
		runtime: mockRuntime,
		win: { devicePixelRatio: 1 },
	});
});

afterEach(() => {
	Object.defineProperty(chrome.runtime, "lastError", {
		value: undefined,
		configurable: true,
	});
});

describe("createCaptureClient", () => {
	test("returns object with requestTabCapture method", () => {
		expect(typeof captureClient.requestTabCapture).toBe("function");
	});

	test("returns object with download method", () => {
		expect(typeof captureClient.download).toBe("function");
	});

	test("returns object with devicePixelRatio method", () => {
		expect(typeof captureClient.devicePixelRatio).toBe("function");
	});

	test("devicePixelRatio returns configured value", () => {
		const client = createCaptureClient({
			runtime: mockRuntime,
			win: { devicePixelRatio: 2.5 },
		});
		expect(client.devicePixelRatio()).toBe(2.5);
	});

	test("devicePixelRatio defaults to 1 when not set", () => {
		const client = createCaptureClient({
			runtime: mockRuntime,
			win: {},
		});
		expect(client.devicePixelRatio()).toBe(1);
	});
});

describe("requestTabCapture", () => {
	test("sends CAPTURE_TAB action", async () => {
		mockRuntime._response = { ok: true, dataUrl: "data:image/png;base64,abc" };
		await captureClient.requestTabCapture();
		expect(mockRuntime.sendMessage).toHaveBeenCalledWith(
			{ action: CaptureActions.CAPTURE_TAB },
			expect.any(Function),
		);
	});

	test("resolves with dataUrl when response is ok", async () => {
		mockRuntime._response = { ok: true, dataUrl: "data:image/png;base64,xyz" };
		const result = await captureClient.requestTabCapture();
		expect(result).toBe("data:image/png;base64,xyz");
	});

	test("throws RuntimeError when response ok is false", async () => {
		mockRuntime._response = { ok: false, error: "capture denied" };
		await expect(captureClient.requestTabCapture()).rejects.toThrow("captureTab: capture denied");
	});

	test("throws RuntimeError with generic message when response ok is false and no error", async () => {
		mockRuntime._response = { ok: false };
		await expect(captureClient.requestTabCapture()).rejects.toThrow("captureTab: capture tab failed");
	});

	test("throws RuntimeError when dataUrl is missing despite ok", async () => {
		mockRuntime._response = { ok: true };
		await expect(captureClient.requestTabCapture()).rejects.toThrow("captureTab: missing data URL");
	});

	test("throws RuntimeError when chrome.runtime.lastError is set", async () => {
		mockRuntime._reject = true;
		mockRuntime._lastError = "Extension context invalidated";
		await expect(captureClient.requestTabCapture()).rejects.toThrow("Extension context invalidated");
	});
});

describe("download", () => {
	test("sends DOWNLOAD action with dataUrl and filename", async () => {
		mockRuntime._response = { ok: true, downloadId: "id-123" };
		await captureClient.download("data:image/png;base64,abc", "my-screenshot");
		expect(mockRuntime.sendMessage).toHaveBeenCalledWith(
			{ action: CaptureActions.DOWNLOAD, dataUrl: "data:image/png;base64,abc", filename: "my-screenshot" },
			expect.any(Function),
		);
	});

	test("resolves with downloadId when response is ok", async () => {
		mockRuntime._response = { ok: true, downloadId: "dl-456" };
		const result = await captureClient.download("data:image/png;base64,abc", "screenshot");
		expect(result).toBe("dl-456");
	});

	test("throws RuntimeError when response ok is false", async () => {
		mockRuntime._response = { ok: false, error: "download failed" };
		await expect(captureClient.download("data:image/png;base64,abc", "file")).rejects.toThrow("download: download failed");
	});

	test("throws RuntimeError with generic message when response ok is false", async () => {
		mockRuntime._response = { ok: false };
		await expect(captureClient.download("data:image/png;base64,abc", "file")).rejects.toThrow("download: download failed");
	});

	test("throws RuntimeError when chrome.runtime.lastError is set", async () => {
		mockRuntime._reject = true;
		mockRuntime._lastError = "Service worker unavailable";
		await expect(captureClient.download("data:image/png;base64,abc", "file")).rejects.toThrow("Service worker unavailable");
	});
});

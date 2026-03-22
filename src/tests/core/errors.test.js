import { jest } from "@jest/globals";
import {
	CaptureError,
	ImageLoadError,
	CanvasError,
	RuntimeError,
	UnsupportedModeError,
	SessionConflictError,
} from "../../../src/core/errors.js";

describe("CaptureError", () => {
	test("has name CaptureError", () => {
		const error = new CaptureError("test message");
		expect(error.name).toBe("CaptureError");
	});

	test("has correct message", () => {
		const error = new CaptureError("test message");
		expect(error.message).toBe("test message");
	});

	test("is an instance of Error", () => {
		const error = new CaptureError("test");
		expect(error instanceof Error).toBe(true);
	});

	test("is an instance of CaptureError", () => {
		const error = new CaptureError("test");
		expect(error instanceof CaptureError).toBe(true);
	});
});

describe("ImageLoadError", () => {
	test("has name ImageLoadError", () => {
		const error = new ImageLoadError();
		expect(error.name).toBe("ImageLoadError");
	});

	test("has default message", () => {
		const error = new ImageLoadError();
		expect(error.message).toBe("image load failed");
	});

	test("accepts a cause", () => {
		const cause = new Error("network failure");
		const error = new ImageLoadError(cause);
		expect(error.cause).toBe(cause);
	});

	test("is an instance of CaptureError", () => {
		const error = new ImageLoadError();
		expect(error instanceof CaptureError).toBe(true);
	});

	test("is an instance of Error", () => {
		const error = new ImageLoadError();
		expect(error instanceof Error).toBe(true);
	});
});

describe("CanvasError", () => {
	test("has name CanvasError", () => {
		const error = new CanvasError();
		expect(error.name).toBe("CanvasError");
	});

	test("has default message when no argument given", () => {
		const error = new CanvasError();
		expect(error.message).toBe("2D canvas context is unavailable");
	});

	test("accepts custom message", () => {
		const error = new CanvasError("custom message");
		expect(error.message).toBe("custom message");
	});

	test("is an instance of CaptureError", () => {
		const error = new CanvasError();
		expect(error instanceof CaptureError).toBe(true);
	});
});

describe("RuntimeError", () => {
	test("has name RuntimeError", () => {
		const error = new RuntimeError("download", "failed");
		expect(error.name).toBe("RuntimeError");
	});

	test("formats message as action: message", () => {
		const error = new RuntimeError("download", "failed");
		expect(error.message).toBe("download: failed");
	});

	test("stores action property", () => {
		const error = new RuntimeError("download", "failed");
		expect(error.action).toBe("download");
	});

	test("is an instance of CaptureError", () => {
		const error = new RuntimeError("capture", "timeout");
		expect(error instanceof CaptureError).toBe(true);
	});
});

describe("UnsupportedModeError", () => {
	test("has name UnsupportedModeError", () => {
		const error = new UnsupportedModeError("unknown");
		expect(error.name).toBe("UnsupportedModeError");
	});

	test("formats message with mode name", () => {
		const error = new UnsupportedModeError("custom");
		expect(error.message).toBe("unsupported capture mode: custom");
	});

	test("stores mode property", () => {
		const error = new UnsupportedModeError("custom");
		expect(error.mode).toBe("custom");
	});

	test("is an instance of CaptureError", () => {
		const error = new UnsupportedModeError("unknown");
		expect(error instanceof CaptureError).toBe(true);
	});
});

describe("SessionConflictError", () => {
	test("has name SessionConflictError", () => {
		const error = new SessionConflictError();
		expect(error.name).toBe("SessionConflictError");
	});

	test("has fixed message", () => {
		const error = new SessionConflictError();
		expect(error.message).toBe("capture session already active");
	});

	test("is an instance of CaptureError", () => {
		const error = new SessionConflictError();
		expect(error instanceof CaptureError).toBe(true);
	});
});

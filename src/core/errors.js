export class CaptureError extends Error {
	constructor(message) {
		super(message);
		this.name = "CaptureError";
	}
}

export class ImageLoadError extends CaptureError {
	constructor(cause) {
		super("image load failed");
		this.name = "ImageLoadError";
		this.cause = cause;
	}
}

export class CanvasError extends CaptureError {
	constructor(message = "2D canvas context is unavailable") {
		super(message);
		this.name = "CanvasError";
	}
}

export class RuntimeError extends CaptureError {
	constructor(action, message) {
		super(`${action}: ${message}`);
		this.name = "RuntimeError";
		this.action = action;
	}
}

export class UnsupportedModeError extends CaptureError {
	constructor(mode) {
		super(`unsupported capture mode: ${mode}`);
		this.name = "UnsupportedModeError";
		this.mode = mode;
	}
}

export class SessionConflictError extends CaptureError {
	constructor() {
		super("capture session already active");
		this.name = "SessionConflictError";
	}
}

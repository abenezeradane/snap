export { createCaptureClient } from "./client.js";
export * from "./modes/index.js";

export function createCaptureModeRegistry() {
	const modes = new Map();

	function register(name, mode) {
		modes.set(name, mode);
	}

	function unregister(name) {
		modes.delete(name);
	}

	function get(name) {
		return modes.get(name);
	}

	return {
		register,
		unregister,
		get,
	};
}

export function createCaptureSession() {
	let active = false;

	function acquire() {
		if (active) {
			return false;
		}

		active = true;
		return true;
	}

	function release() {
		active = false;
	}

	return {
		acquire,
		release,
		isActive: () => active,
	};
}

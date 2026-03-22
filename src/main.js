import { CaptureActions, CaptureModes } from "./core/constants.js";
import { createLogger } from "./core/logger.js";
import { createCaptureClient, createCaptureModeRegistry, createCaptureSession } from "./capture/index.js";
import { createVisibleCaptureMode, createElementCaptureMode, createRegionCaptureMode } from "./capture/modes/index.js";
import { createPromptService } from "./ui/prompt.js";

export function createScreenshotApp({
	runtime,
	doc,
	win,
	logger = createLogger(),
} = {}) {
	const registry = createCaptureModeRegistry();
	const session = createCaptureSession();
	const captureClient = createCaptureClient({ runtime, win });
	const promptService = createPromptService({ doc });

	function init() {
		runtime.onMessage.addListener(onMessage);
	}

	function registerMode(name, mode) {
		registry.register(name, mode);
	}

	function unregisterMode(name) {
		registry.unregister(name);
	}

	function isCaptureRequest(message) {
		return (
			message &&
			typeof message === "object" &&
			message.action === CaptureActions.CAPTURE &&
			typeof message.mode === "string"
		);
	}

	function onMessage(message) {
		if (!isCaptureRequest(message)) {
			return;
		}

		const mode = registry.get(message.mode);
		if (!mode) {
			logger.warn(`[snap] unsupported capture mode: ${String(message.mode)}`);
			return;
		}

		void runMode(mode, { highRes: Boolean(message.hiRes) });
	}

	async function runMode(mode, options) {
		try {
			await mode.run(options);
		} catch (error) {
			logger.error("[snap] capture failed", error);
		}
	}

	return {
		init,
		registerMode,
		unregisterMode,
		captureClient,
		promptService,
		session,
	};
}

export function registerDefaultModes(app) {
	app.registerMode(
		CaptureModes.VISIBLE,
		createVisibleCaptureMode({
			captureClient: app.captureClient,
			promptService: app.promptService,
			session: app.session,
		}),
	);

	app.registerMode(
		CaptureModes.ELEMENT,
		createElementCaptureMode({
			captureClient: app.captureClient,
			promptService: app.promptService,
			doc: document,
			win: window,
			session: app.session,
		}),
	);

	app.registerMode(
		CaptureModes.REGION,
		createRegionCaptureMode({
			captureClient: app.captureClient,
			promptService: app.promptService,
			doc: document,
			win: window,
			session: app.session,
		}),
	);
}

export function bootstrap({
	runtime = chrome.runtime,
	doc = document,
	win = window,
	logger = createLogger(),
} = {}) {
	if (win.__snapInjected) {
		logger.debug("[snap] already injected; skipping");
		return null;
	}

	win.__snapInjected = true;

	const app = createScreenshotApp({ runtime, doc, win, logger });
	registerDefaultModes(app);
	app.init();

	return app;
}

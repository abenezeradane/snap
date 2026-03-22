import { jest } from "@jest/globals";
import { createPromptService } from "../../../src/ui/prompt.js";
import { UI_IDS } from "../../../src/core/constants.js";

const mockShadowRoot = {
	innerHTML: "",
	activeElement: null,
	_listeners: {},
	querySelector: (selector) => {
		if (selector === ".snap-input") return { value: "test", focus: () => {}, select: () => {}, dispatchEvent: (e) => {
			const handler = mockShadowRoot._listeners?.keydown?.[0];
			if (handler) handler(e);
		}};
		if (selector === ".snap-backdrop") return { addEventListener: () => {} };
		if (selector === ".snap-dialog") return { addEventListener: () => {} };
		if (selector === '[data-action="cancel"]') return { addEventListener: () => {} };
		if (selector === ".snap-root") return { classList: { add: () => {} } };
		return null;
	},
	querySelectorAll: () => [],
	addEventListener: (event, handler) => {
		mockShadowRoot._listeners = mockShadowRoot._listeners || {};
		mockShadowRoot._listeners[event] = mockShadowRoot._listeners[event] || [];
		mockShadowRoot._listeners[event].push(handler);
	},
	removeEventListener: () => {},
};

let createdHost = null;

const origCreateElement = globalThis.document.createElement;
globalThis.document.createElement = function(tag) {
	const el = origCreateElement.call(this, tag);
	el.attachShadow = () => mockShadowRoot;
	if (tag === "div") {
		createdHost = el;
	}
	return el;
};

globalThis.document.getElementById = function(id) {
	if (id === UI_IDS.FILENAME_PROMPT) return createdHost;
	return null;
};

function makeService() {
	return createPromptService({
		doc: globalThis.document,
		win: globalThis.window,
		storage: globalThis.chrome.storage.sync,
	});
}

function closePrompt() {
	return new Promise((resolve) => {
		globalThis.setTimeout(() => {
			const keydownHandler = mockShadowRoot._listeners?.keydown?.[0];
			if (keydownHandler) {
				keydownHandler({ key: "Escape", bubbles: true, stopPropagation: () => {}, preventDefault: () => {} });
			}
			resolve();
		}, 10);
	});
}

beforeEach(() => {
	createdHost = null;
	mockShadowRoot._listeners = {};
});

describe("createPromptService", () => {
	test("returns an object with promptFilename method", () => {
		const service = makeService();
		expect(typeof service.promptFilename).toBe("function");
	});

	test("promptFilename returns a Promise", async () => {
		globalThis.chrome.storage.sync.get.mockResolvedValue({});
		const service = makeService();
		const result = service.promptFilename("test");
		expect(result).toBeInstanceOf(Promise);
		await closePrompt();
		await result;
	});
});

describe("promptFilename theme resolution", () => {
	test("handles dark theme storage", async () => {
		globalThis.chrome.storage.sync.get.mockResolvedValue({ theme: true });
		const service = makeService();
		const result = service.promptFilename("test");
		await closePrompt();
		const value = await result;
		expect(value).toBeNull();
	});

	test("handles light theme storage", async () => {
		globalThis.chrome.storage.sync.get.mockResolvedValue({ theme: false });
		const service = makeService();
		const result = service.promptFilename("test");
		await closePrompt();
		const value = await result;
		expect(value).toBeNull();
	});

	test("handles null storage response", async () => {
		globalThis.chrome.storage.sync.get.mockResolvedValue({});
		const service = makeService();
		const result = service.promptFilename("test");
		await closePrompt();
		const value = await result;
		expect(value).toBeNull();
	});

	test("handles storage without get method", async () => {
		const service = createPromptService({
			doc: globalThis.document,
			win: globalThis.window,
			storage: null,
		});
		const result = service.promptFilename("test");
		await closePrompt();
		const value = await result;
		expect(value).toBeNull();
	});

	test("handles undefined storage (chrome.storage missing)", async () => {
		const service = createPromptService({
			doc: globalThis.document,
			win: globalThis.window,
		});
		const result = service.promptFilename("test");
		await closePrompt();
		const value = await result;
		expect(value).toBeNull();
	});
});

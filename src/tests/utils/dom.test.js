import { jest } from "@jest/globals";
import {
	createElement,
	applyStyles,
	removeNode,
	clamp,
	sleep,
} from "../../../src/utils/dom.js";

describe("createElement", () => {
	let mockDoc;

	beforeEach(() => {
		mockDoc = {
			createElement: jest.fn((tag) => {
				const el = {
					tagName: tag.toUpperCase(),
					id: "",
					textContent: "",
					style: {},
					_setAttribute: {},
					setAttribute: jest.fn((name, value) => {
						el._setAttribute[name] = value;
					}),
				};
				return el;
			}),
		};
	});

	test("creates element with correct tag name", () => {
		const el = createElement(mockDoc, "div");
		expect(mockDoc.createElement).toHaveBeenCalledWith("div");
		expect(el.tagName).toBe("DIV");
	});

	test("sets id when provided", () => {
		const el = createElement(mockDoc, "div", { id: "my-id" });
		expect(el.id).toBe("my-id");
	});

	test("does not set id when not provided", () => {
		const el = createElement(mockDoc, "div");
		expect(el.id).toBe("");
	});

	test("sets textContent when provided as string", () => {
		const el = createElement(mockDoc, "span", { textContent: "hello" });
		expect(el.textContent).toBe("hello");
	});

	test("does not set textContent when not provided", () => {
		const el = createElement(mockDoc, "span");
		expect(el.textContent).toBe("");
	});

	test("sets attributes from attrs object", () => {
		const el = createElement(mockDoc, "input", {
			attrs: { type: "text", "data-testid": "field" },
		});
		expect(el.setAttribute).toHaveBeenCalledWith("type", "text");
		expect(el.setAttribute).toHaveBeenCalledWith("data-testid", "field");
	});

	test("applies styles from styles object", () => {
		const el = createElement(mockDoc, "div", {
			styles: { color: "red", fontSize: "14px" },
		});
		expect(el.style.color).toBe("red");
		expect(el.style.fontSize).toBe("14px");
	});

	test("handles options being undefined", () => {
		const el = createElement(mockDoc, "div", undefined);
		expect(mockDoc.createElement).toHaveBeenCalled();
	});

	test("handles empty options object", () => {
		const el = createElement(mockDoc, "div", {});
		expect(mockDoc.createElement).toHaveBeenCalled();
	});

	test("prefers styles object over individual style properties", () => {
		const el = createElement(mockDoc, "div", {
			styles: { display: "flex" },
		});
		expect(el.style.display).toBe("flex");
	});
});

describe("applyStyles", () => {
	test("assigns multiple style properties", () => {
		const el = { style: {} };
		applyStyles(el, { width: "100px", height: "50px", zIndex: "10" });
		expect(el.style.width).toBe("100px");
		expect(el.style.height).toBe("50px");
		expect(el.style.zIndex).toBe("10");
	});

	test("overwrites existing style properties", () => {
		const el = { style: { color: "blue", fontSize: "12px" } };
		applyStyles(el, { color: "red" });
		expect(el.style.color).toBe("red");
		expect(el.style.fontSize).toBe("12px");
	});

	test("handles empty styles object", () => {
		const el = { style: { color: "blue" } };
		applyStyles(el, {});
		expect(el.style.color).toBe("blue");
	});

	test("returns undefined", () => {
		const el = { style: {} };
		expect(applyStyles(el, { color: "red" })).toBeUndefined();
	});
});

describe("removeNode", () => {
	test("removes node from parent", () => {
		const parent = { removeChild: jest.fn() };
		const node = { parentNode: parent };
		removeNode(node);
		expect(parent.removeChild).toHaveBeenCalledWith(node);
	});

	test("does nothing when node has no parentNode", () => {
		const node = { parentNode: null };
		expect(() => removeNode(node)).not.toThrow();
	});

	test("does nothing when parentNode is undefined", () => {
		const node = {};
		expect(() => removeNode(node)).not.toThrow();
	});

	test("does nothing when node is null", () => {
		expect(() => removeNode(null)).not.toThrow();
	});

	test("does nothing when node is undefined", () => {
		expect(() => removeNode(undefined)).not.toThrow();
	});
});

describe("clamp", () => {
	test("returns value when within range", () => {
		expect(clamp(5, 0, 10)).toBe(5);
	});

	test("returns min when value is below range", () => {
		expect(clamp(-5, 0, 10)).toBe(0);
	});

	test("returns max when value is above range", () => {
		expect(clamp(15, 0, 10)).toBe(10);
	});

	test("returns min when value equals min", () => {
		expect(clamp(0, 0, 10)).toBe(0);
	});

	test("returns max when value equals max", () => {
		expect(clamp(10, 0, 10)).toBe(10);
	});

	test("handles floating point values", () => {
		expect(clamp(1.5, 0, 2)).toBe(1.5);
		expect(clamp(1.4, 0, 2)).toBe(1.4);
		expect(clamp(2.5, 0, 2)).toBe(2);
	});

	test("handles negative ranges", () => {
		expect(clamp(0, -10, -5)).toBe(-5);
		expect(clamp(-7, -10, -5)).toBe(-7);
	});
});

describe("sleep", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		globalThis.window = { setTimeout: globalThis.setTimeout };
	});

	afterEach(() => {
		jest.useRealTimers();
		delete globalThis.window;
	});

	test("resolves after specified milliseconds", async () => {
		const promise = sleep(100);
		jest.runAllTimers();
		await expect(promise).resolves.toBeUndefined();
	});

	test("resolves after 0 milliseconds", async () => {
		const promise = sleep(0);
		jest.runAllTimers();
		await expect(promise).resolves.toBeUndefined();
	});

	test("resolves after large delay", async () => {
		const promise = sleep(5000);
		jest.runAllTimers();
		await expect(promise).resolves.toBeUndefined();
	}, 10000);
});

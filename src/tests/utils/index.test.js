import { jest } from "@jest/globals";
import {
	normalizeFilename,
	getClientPoint,
	createViewportRect,
	isUsableSelection,
} from "../../../src/utils/index.js";

describe("normalizeFilename", () => {
	test("appends .png extension when not present", () => {
		expect(normalizeFilename("my-screenshot")).toBe("my-screenshot.png");
	});

	test("does not duplicate .png extension", () => {
		expect(normalizeFilename("my-screenshot.png")).toBe("my-screenshot.png");
	});

	test("strips illegal characters and replaces with hyphen", () => {
		expect(normalizeFilename("my<file>name")).toBe("my-file-name.png");
	});

	test("strips all illegal characters: < > : \" / \\ | ? *", () => {
		expect(normalizeFilename("a<b:c>d/e|f?g*")).toBe("a-b-c-d-e-f-g-.png");
	});

	test("strips control characters (0x00-0x1F)", () => {
		expect(normalizeFilename("file\x00name")).toBe("file-name.png");
	});

	test("removes trailing dots", () => {
		expect(normalizeFilename("file...")).toBe("file.png");
	});

	test("removes leading and trailing whitespace", () => {
		expect(normalizeFilename("  screenshot  ")).toBe("screenshot.png");
	});

	test("truncates to maximum 200 characters", () => {
		const longName = "a".repeat(250);
		const result = normalizeFilename(longName);
		expect(result.length).toBe(204);
		expect(result.endsWith(".png")).toBe(true);
	});

	test("truncates before .png if needed", () => {
		const name = "a".repeat(197) + ".png";
		const result = normalizeFilename(name);
		expect(result.length).toBe(204);
		expect(result.endsWith(".png")).toBe(true);
	});

	test("handles empty string", () => {
		expect(normalizeFilename("")).toBe("screenshot.png");
	});

	test("handles whitespace-only string", () => {
		expect(normalizeFilename("   ")).toBe("screenshot.png");
	});

	test("handles null/undefined as value", () => {
		expect(normalizeFilename(null)).toBe("screenshot.png");
		expect(normalizeFilename(undefined)).toBe("screenshot.png");
	});

	test("allows alphanumeric, underscore, hyphen", () => {
		expect(normalizeFilename("my_screenshot-v2")).toBe("my_screenshot-v2.png");
	});

	test("handles name with extension containing extra dots", () => {
		expect(normalizeFilename("file.tar.gz")).toBe("file.tar.gz.png");
	});

	test("preserves unicode characters (only ASCII control chars are stripped)", () => {
		expect(normalizeFilename("f\u00e9lice")).toBe("f\u00e9lice.png");
	});
});

describe("getClientPoint", () => {
	test("returns clientX and clientY from event", () => {
		const event = { clientX: 100, clientY: 200 };
		const point = getClientPoint(event);
		expect(point.x).toBe(100);
		expect(point.y).toBe(200);
	});

	test("returns object with x and y keys", () => {
		const event = { clientX: 0, clientY: 0 };
		const point = getClientPoint(event);
		expect(Object.keys(point)).toEqual(["x", "y"]);
	});

	test("handles negative coordinates", () => {
		const event = { clientX: -50, clientY: -100 };
		const point = getClientPoint(event);
		expect(point.x).toBe(-50);
		expect(point.y).toBe(-100);
	});
});

describe("createViewportRect", () => {
	test("returns zero-sized rect for same start and end point", () => {
		const win = { innerWidth: 1920, innerHeight: 1080 };
		const point = { x: 100, y: 100 };
		const rect = createViewportRect(point, point, win);
		expect(rect.left).toBe(100);
		expect(rect.top).toBe(100);
		expect(rect.right).toBe(100);
		expect(rect.bottom).toBe(100);
		expect(rect.width).toBe(0);
		expect(rect.height).toBe(0);
	});

	test("computes correct rect from top-left to bottom-right drag", () => {
		const win = { innerWidth: 1920, innerHeight: 1080 };
		const start = { x: 10, y: 20 };
		const end = { x: 110, y: 70 };
		const rect = createViewportRect(start, end, win);
		expect(rect.left).toBe(10);
		expect(rect.top).toBe(20);
		expect(rect.right).toBe(110);
		expect(rect.bottom).toBe(70);
		expect(rect.width).toBe(100);
		expect(rect.height).toBe(50);
	});

	test("computes correct rect from bottom-right to top-left drag", () => {
		const win = { innerWidth: 1920, innerHeight: 1080 };
		const start = { x: 110, y: 70 };
		const end = { x: 10, y: 20 };
		const rect = createViewportRect(start, end, win);
		expect(rect.left).toBe(10);
		expect(rect.top).toBe(20);
		expect(rect.right).toBe(110);
		expect(rect.bottom).toBe(70);
		expect(rect.width).toBe(100);
		expect(rect.height).toBe(50);
	});

	test("clamps left to 0 when out of bounds", () => {
		const win = { innerWidth: 1920, innerHeight: 1080 };
		const start = { x: -50, y: 0 };
		const end = { x: 100, y: 100 };
		const rect = createViewportRect(start, end, win);
		expect(rect.left).toBe(0);
	});

	test("clamps top to 0 when out of bounds", () => {
		const win = { innerWidth: 1920, innerHeight: 1080 };
		const start = { x: 0, y: -50 };
		const end = { x: 100, y: 100 };
		const rect = createViewportRect(start, end, win);
		expect(rect.top).toBe(0);
	});

	test("clamps right to innerWidth when out of bounds", () => {
		const win = { innerWidth: 1920, innerHeight: 1080 };
		const start = { x: 100, y: 0 };
		const end = { x: 2000, y: 100 };
		const rect = createViewportRect(start, end, win);
		expect(rect.right).toBe(1920);
	});

	test("clamps bottom to innerHeight when out of bounds", () => {
		const win = { innerWidth: 1920, innerHeight: 1080 };
		const start = { x: 0, y: 100 };
		const end = { x: 100, y: 2000 };
		const rect = createViewportRect(start, end, win);
		expect(rect.bottom).toBe(1080);
	});

	test("width is always non-negative", () => {
		const win = { innerWidth: 1920, innerHeight: 1080 };
		const rect = createViewportRect({ x: 100, y: 0 }, { x: 50, y: 0 }, win);
		expect(rect.width).toBeGreaterThanOrEqual(0);
	});

	test("height is always non-negative", () => {
		const win = { innerWidth: 1920, innerHeight: 1080 };
		const rect = createViewportRect({ x: 0, y: 100 }, { x: 0, y: 50 }, win);
		expect(rect.height).toBeGreaterThanOrEqual(0);
	});

	test("has all required keys: left, top, right, bottom, width, height", () => {
		const win = { innerWidth: 1920, innerHeight: 1080 };
		const rect = createViewportRect({ x: 0, y: 0 }, { x: 100, y: 100 }, win);
		expect(rect).toHaveProperty("left");
		expect(rect).toHaveProperty("top");
		expect(rect).toHaveProperty("right");
		expect(rect).toHaveProperty("bottom");
		expect(rect).toHaveProperty("width");
		expect(rect).toHaveProperty("height");
	});
});

describe("isUsableSelection", () => {
	const defaultMin = 8;

	test("returns true when both dimensions meet minimum", () => {
		const rect = { width: 10, height: 10 };
		expect(isUsableSelection(rect, defaultMin)).toBe(true);
	});

	test("returns true when width and height equal minimum", () => {
		const rect = { width: 8, height: 8 };
		expect(isUsableSelection(rect, defaultMin)).toBe(true);
	});

	test("returns false when width is below minimum", () => {
		const rect = { width: 5, height: 10 };
		expect(isUsableSelection(rect, defaultMin)).toBe(false);
	});

	test("returns false when height is below minimum", () => {
		const rect = { width: 10, height: 5 };
		expect(isUsableSelection(rect, defaultMin)).toBe(false);
	});

	test("returns false when width is 0", () => {
		const rect = { width: 0, height: 10 };
		expect(isUsableSelection(rect, defaultMin)).toBe(false);
	});

	test("returns false when height is 0", () => {
		const rect = { width: 10, height: 0 };
		expect(isUsableSelection(rect, defaultMin)).toBe(false);
	});

	test("returns null when rect is null", () => {
		expect(isUsableSelection(null, defaultMin)).toBeNull();
	});

	test("returns undefined when rect is undefined", () => {
		expect(isUsableSelection(undefined, defaultMin)).toBeUndefined();
	});

	test("uses default minimum of 8 when not provided", () => {
		const rect = { width: 7, height: 10 };
		expect(isUsableSelection(rect)).toBe(false);
		expect(isUsableSelection({ width: 8, height: 8 })).toBe(true);
	});

	test("respects custom minimum size", () => {
		const rect = { width: 10, height: 10 };
		expect(isUsableSelection(rect, 5)).toBe(true);
		expect(isUsableSelection(rect, 15)).toBe(false);
	});

	test("handles floating point values", () => {
		const rect = { width: 7.9, height: 10 };
		expect(isUsableSelection(rect, 8)).toBe(false);

		const rect2 = { width: 8.1, height: 10 };
		expect(isUsableSelection(rect2, 8)).toBe(true);
	});
});

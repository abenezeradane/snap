import { jest } from "@jest/globals";
import { loadImage, getCanvasContext } from "../../../src/utils/image.js";

describe("loadImage", () => {
	let originalImage;

	beforeEach(() => {
		originalImage = globalThis.Image;
	});

	afterEach(() => {
		globalThis.Image = originalImage;
	});

	test("resolves with image on successful load", async () => {
		class TestImage {
			constructor() {
				setTimeout(() => this.onload(), 0);
			}
			get src() { return this._src; }
			set src(v) { this._src = v; }
			get onload() { return this._onload; }
			set onload(fn) { this._onload = fn; }
			get onerror() { return this._onerror; }
			set onerror(fn) { this._onerror = fn; }
		}
		globalThis.Image = TestImage;
		const image = await loadImage("data:image/png;base64,abc");
		expect(image).toBeDefined();
	});

	test("rejects with ImageLoadError on load failure", async () => {
		class TestImage {
			constructor() {
				setTimeout(() => this.onerror(), 0);
			}
		}
		globalThis.Image = TestImage;
		await expect(loadImage("data:image/png;base64,xyz")).rejects.toThrow("image load failed");
	});

	test("sets image src to provided dataUrl", async () => {
		let capturedSrc = null;
		class TestImage {
			constructor() {
				setTimeout(() => this.onload(), 0);
			}
			get src() { return this._src; }
			set src(v) { capturedSrc = v; }
			get onload() { return this._onload; }
			set onload(fn) { this._onload = fn; }
		}
		globalThis.Image = TestImage;
		await loadImage("data:image/png;base64,test123");
		expect(capturedSrc).toBe("data:image/png;base64,test123");
	});
});

describe("getCanvasContext", () => {
	test("returns 2d context when available", () => {
		const mockContext = {};
		const mockCanvas = { getContext: (type) => type === "2d" ? mockContext : null };
		const result = getCanvasContext(mockCanvas);
		expect(result).toBe(mockContext);
	});

	test("throws CanvasError when context is null", () => {
		const mockCanvas = { getContext: () => null };
		expect(() => getCanvasContext(mockCanvas)).toThrow("2D canvas context is unavailable");
	});
});

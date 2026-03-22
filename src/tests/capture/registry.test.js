import { jest } from "@jest/globals";
import {
	createCaptureModeRegistry,
	createCaptureSession,
} from "../../../src/capture/index.js";

describe("createCaptureModeRegistry", () => {
	test("returns an object with register, unregister, and get methods", () => {
		const registry = createCaptureModeRegistry();
		expect(typeof registry.register).toBe("function");
		expect(typeof registry.unregister).toBe("function");
		expect(typeof registry.get).toBe("function");
	});

	test("register adds a mode", () => {
		const registry = createCaptureModeRegistry();
		const mode = { run: jest.fn() };
		registry.register("test", mode);
		expect(registry.get("test")).toBe(mode);
	});

	test("register overwrites existing mode with same name", () => {
		const registry = createCaptureModeRegistry();
		const mode1 = { run: jest.fn() };
		const mode2 = { run: jest.fn() };
		registry.register("test", mode1);
		registry.register("test", mode2);
		expect(registry.get("test")).toBe(mode2);
	});

	test("unregister removes a mode", () => {
		const registry = createCaptureModeRegistry();
		const mode = { run: jest.fn() };
		registry.register("test", mode);
		registry.unregister("test");
		expect(registry.get("test")).toBeUndefined();
	});

	test("unregister does nothing for unknown mode", () => {
		const registry = createCaptureModeRegistry();
		expect(() => registry.unregister("unknown")).not.toThrow();
	});

	test("get returns undefined for unknown mode", () => {
		const registry = createCaptureModeRegistry();
		expect(registry.get("unknown")).toBeUndefined();
	});

	test("register and get work with multiple modes", () => {
		const registry = createCaptureModeRegistry();
		const mode1 = { run: jest.fn() };
		const mode2 = { run: jest.fn() };
		const mode3 = { run: jest.fn() };
		registry.register("mode1", mode1);
		registry.register("mode2", mode2);
		registry.register("mode3", mode3);
		expect(registry.get("mode1")).toBe(mode1);
		expect(registry.get("mode2")).toBe(mode2);
		expect(registry.get("mode3")).toBe(mode3);
	});
});

describe("createCaptureSession", () => {
	test("returns acquire and release methods", () => {
		const session = createCaptureSession();
		expect(typeof session.acquire).toBe("function");
		expect(typeof session.release).toBe("function");
		expect(typeof session.isActive).toBe("function");
	});

	test("acquire returns true on first call", () => {
		const session = createCaptureSession();
		expect(session.acquire()).toBe(true);
	});

	test("acquire returns false when session is already active", () => {
		const session = createCaptureSession();
		session.acquire();
		expect(session.acquire()).toBe(false);
	});

	test("acquire returns true again after release", () => {
		const session = createCaptureSession();
		session.acquire();
		session.release();
		expect(session.acquire()).toBe(true);
	});

	test("release marks session as inactive", () => {
		const session = createCaptureSession();
		session.acquire();
		session.release();
		expect(session.isActive()).toBe(false);
	});

	test("isActive returns false initially", () => {
		const session = createCaptureSession();
		expect(session.isActive()).toBe(false);
	});

	test("isActive returns true after acquire", () => {
		const session = createCaptureSession();
		session.acquire();
		expect(session.isActive()).toBe(true);
	});

	test("release does nothing when session is not active", () => {
		const session = createCaptureSession();
		expect(() => session.release()).not.toThrow();
	});

	test("multiple releases do not cause issues", () => {
		const session = createCaptureSession();
		session.acquire();
		session.release();
		session.release();
		expect(session.isActive()).toBe(false);
	});

	test("multiple acquires after single release work correctly", () => {
		const session = createCaptureSession();
		session.acquire();
		session.release();
		expect(session.acquire()).toBe(true);
		expect(session.acquire()).toBe(false);
	});
});

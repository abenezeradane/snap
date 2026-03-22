import { jest } from "@jest/globals";
import { createLogger, noopLogger } from "../../../src/core/logger.js";

describe("createLogger", () => {
	let originalConsole;

	beforeEach(() => {
		originalConsole = globalThis.console;
	});

	afterEach(() => {
		globalThis.console = originalConsole;
	});

	function mockConsole() {
		const mock = {
			debug: jest.fn(),
			info: jest.fn(),
			warn: jest.fn(),
			error: jest.fn(),
		};
		globalThis.console = mock;
		return mock;
	}

	test("returns an object with debug, info, warn, error methods", () => {
		const logger = createLogger();
		expect(typeof logger.debug).toBe("function");
		expect(typeof logger.info).toBe("function");
		expect(typeof logger.warn).toBe("function");
		expect(typeof logger.error).toBe("function");
	});

	test("uses default prefix [snap]", () => {
		const console = mockConsole();
		const logger = createLogger();
		logger.debug("hello");
		expect(console.debug).toHaveBeenCalledWith("[snap]", "hello");
	});

	test("uses custom prefix when provided", () => {
		const console = mockConsole();
		const logger = createLogger("[myapp]");
		logger.info("message");
		expect(console.info).toHaveBeenCalledWith("[myapp]", "message");
	});

	test("debug calls console.debug with prefix and args", () => {
		const console = mockConsole();
		const logger = createLogger("[test]");
		logger.debug("arg1", "arg2");
		expect(console.debug).toHaveBeenCalledWith("[test]", "arg1", "arg2");
	});

	test("info calls console.info with prefix and args", () => {
		const console = mockConsole();
		const logger = createLogger("[test]");
		logger.info("arg1", "arg2");
		expect(console.info).toHaveBeenCalledWith("[test]", "arg1", "arg2");
	});

	test("warn calls console.warn with prefix and args", () => {
		const console = mockConsole();
		const logger = createLogger("[test]");
		logger.warn("arg1", "arg2");
		expect(console.warn).toHaveBeenCalledWith("[test]", "arg1", "arg2");
	});

	test("error calls console.error with prefix and args", () => {
		const console = mockConsole();
		const logger = createLogger("[test]");
		logger.error("arg1", "arg2");
		expect(console.error).toHaveBeenCalledWith("[test]", "arg1", "arg2");
	});

	test("handles multiple arguments", () => {
		const console = mockConsole();
		const logger = createLogger("[x]");
		logger.info("a", 1, { key: "value" }, null);
		expect(console.info).toHaveBeenCalledWith("[x]", "a", 1, { key: "value" }, null);
	});

	test("each call creates independent logger with same prefix", () => {
		const console = mockConsole();
		const logger1 = createLogger("[app1]");
		const logger2 = createLogger("[app2]");
		logger1.warn("w1");
		logger2.warn("w2");
		expect(console.warn).toHaveBeenNthCalledWith(1, "[app1]", "w1");
		expect(console.warn).toHaveBeenNthCalledWith(2, "[app2]", "w2");
	});
});

describe("noopLogger", () => {
	test("has debug method", () => {
		expect(typeof noopLogger.debug).toBe("function");
	});

	test("has info method", () => {
		expect(typeof noopLogger.info).toBe("function");
	});

	test("has warn method", () => {
		expect(typeof noopLogger.warn).toBe("function");
	});

	test("has error method", () => {
		expect(typeof noopLogger.error).toBe("function");
	});

	test("debug does nothing", () => {
		expect(() => noopLogger.debug("test")).not.toThrow();
	});

	test("info does nothing", () => {
		expect(() => noopLogger.info("test")).not.toThrow();
	});

	test("warn does nothing", () => {
		expect(() => noopLogger.warn("test")).not.toThrow();
	});

	test("error does nothing", () => {
		expect(() => noopLogger.error("test")).not.toThrow();
	});

	test("all methods return undefined", () => {
		expect(noopLogger.debug()).toBeUndefined();
		expect(noopLogger.info()).toBeUndefined();
		expect(noopLogger.warn()).toBeUndefined();
		expect(noopLogger.error()).toBeUndefined();
	});

	test("handles any arguments without throwing", () => {
		expect(() => noopLogger.debug("a", 1, {}, [])).not.toThrow();
	});
});

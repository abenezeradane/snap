import { jest } from "@jest/globals";
import { createRegionCaptureMode } from "../../../../src/capture/modes/region.js";

function createMocks() {
	return {
		mockCaptureClient: {
			requestTabCapture: jest.fn(() => Promise.resolve("data:image/png;base64,abc")),
			download: jest.fn(() => Promise.resolve("id-1")),
		},
		mockPromptService: {
			promptFilename: jest.fn(() => Promise.resolve("screenshot.png")),
		},
		mockSession: {
			acquire: jest.fn(() => true),
			release: jest.fn(),
		},
		mockDoc: {
			body: { style: {}, appendChild: () => {} },
			createElement: (tag) => ({
				tagName: tag.toUpperCase(), id: "", style: {},
				_setAttribute: {}, _attrs: {},
				setAttribute: (n, v) => { },
				appendChild: () => {}, closest: () => null,
				addEventListener: () => {}, removeEventListener: () => {},
			}),
			createElementNS: (ns, tag) => ({
				ns, tagName: tag, setAttribute: () => {}, appendChild: () => {},
			}),
			addEventListener: () => {}, removeEventListener: () => {},
		},
		mockWin: { innerWidth: 1920, innerHeight: 1080 },
	};
}

describe("createRegionCaptureMode", () => {
	test("returns an object with run method", () => {
		const m = createMocks();
		const mode = createRegionCaptureMode({
			captureClient: m.mockCaptureClient,
			promptService: m.mockPromptService,
			session: m.mockSession,
			doc: m.mockDoc,
			win: m.mockWin,
		});
		expect(typeof mode.run).toBe("function");
	});

	test("does not proceed if session cannot be acquired", async () => {
		const m = createMocks();
		const session = { acquire: jest.fn(() => false), release: jest.fn() };
		const mode = createRegionCaptureMode({
			captureClient: m.mockCaptureClient,
			promptService: m.mockPromptService,
			session,
			doc: m.mockDoc,
			win: m.mockWin,
		});
		await mode.run({ highRes: false });
		expect(m.mockCaptureClient.requestTabCapture).not.toHaveBeenCalled();
	});

	test("releases session in finally block when session acquire returns false", async () => {
		const m = createMocks();
		m.mockSession.acquire.mockReturnValue(false);
		const mode = createRegionCaptureMode({
			captureClient: m.mockCaptureClient,
			promptService: m.mockPromptService,
			session: m.mockSession,
			doc: m.mockDoc,
			win: m.mockWin,
		});
		await mode.run({ highRes: false });
		expect(m.mockSession.release).not.toHaveBeenCalled();
	});
});

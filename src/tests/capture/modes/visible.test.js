import { jest } from "@jest/globals";
import { createVisibleCaptureMode } from "../../../../src/capture/modes/visible.js";

function createMocks() {
	return {
		mockCaptureClient: {
			requestTabCapture: jest.fn(() => Promise.resolve("data:image/png;base64,abc")),
			download: jest.fn(() => Promise.resolve("id-1")),
			devicePixelRatio: () => 1,
		},
		mockPromptService: {
			promptFilename: jest.fn(() => Promise.resolve("screenshot.png")),
		},
		mockSession: {
			acquire: jest.fn(() => true),
			release: jest.fn(),
		},
	};
}

describe("createVisibleCaptureMode", () => {
	test("returns an object with run method", () => {
		const { mockCaptureClient, mockPromptService, mockSession } = createMocks();
		const mode = createVisibleCaptureMode({
			captureClient: mockCaptureClient,
			promptService: mockPromptService,
			session: mockSession,
		});
		expect(typeof mode.run).toBe("function");
	});

	test("does not proceed if session cannot be acquired", async () => {
		const { mockCaptureClient, mockPromptService } = createMocks();
		const session = { acquire: jest.fn(() => false), release: jest.fn() };
		const mode = createVisibleCaptureMode({
			captureClient: mockCaptureClient,
			promptService: mockPromptService,
			session,
		});
		await mode.run({ highRes: false });
		expect(mockCaptureClient.requestTabCapture).not.toHaveBeenCalled();
		expect(session.release).not.toHaveBeenCalled();
	});

	test("calls requestTabCapture when session is acquired", async () => {
		const { mockCaptureClient, mockPromptService, mockSession } = createMocks();
		const mode = createVisibleCaptureMode({
			captureClient: mockCaptureClient,
			promptService: mockPromptService,
			session: mockSession,
		});
		await mode.run({ highRes: false });
		expect(mockCaptureClient.requestTabCapture).toHaveBeenCalled();
	});

	test("prompts for filename", async () => {
		const { mockCaptureClient, mockPromptService, mockSession } = createMocks();
		const mode = createVisibleCaptureMode({
			captureClient: mockCaptureClient,
			promptService: mockPromptService,
			session: mockSession,
		});
		await mode.run({ highRes: false });
		expect(mockPromptService.promptFilename).toHaveBeenCalled();
	});

	test("downloads with filename from prompt", async () => {
		const { mockCaptureClient, mockPromptService, mockSession } = createMocks();
		const mode = createVisibleCaptureMode({
			captureClient: mockCaptureClient,
			promptService: mockPromptService,
			session: mockSession,
		});
		await mode.run({ highRes: false });
		expect(mockCaptureClient.download).toHaveBeenCalledWith(
			"data:image/png;base64,abc",
			"screenshot.png",
		);
	});

	test("releases session on success", async () => {
		const { mockCaptureClient, mockPromptService, mockSession } = createMocks();
		const mode = createVisibleCaptureMode({
			captureClient: mockCaptureClient,
			promptService: mockPromptService,
			session: mockSession,
		});
		await mode.run({ highRes: false });
		expect(mockSession.release).toHaveBeenCalled();
	});

	test("releases session when user cancels prompt", async () => {
		const { mockCaptureClient, mockPromptService, mockSession } = createMocks();
		mockPromptService.promptFilename.mockResolvedValue(null);
		const mode = createVisibleCaptureMode({
			captureClient: mockCaptureClient,
			promptService: mockPromptService,
			session: mockSession,
		});
		await mode.run({ highRes: false });
		expect(mockSession.release).toHaveBeenCalled();
		expect(mockCaptureClient.download).not.toHaveBeenCalled();
	});

	test("releases session when capture fails", async () => {
		const { mockPromptService, mockSession } = createMocks();
		const mockCaptureClient = {
			requestTabCapture: jest.fn(() => Promise.reject(new Error("capture failed"))),
			download: jest.fn(),
			devicePixelRatio: () => 1,
		};
		const mode = createVisibleCaptureMode({
			captureClient: mockCaptureClient,
			promptService: mockPromptService,
			session: mockSession,
		});
		try {
			await mode.run({ highRes: false });
		} catch {
			// expected
		}
		expect(mockSession.release).toHaveBeenCalled();
	});
});

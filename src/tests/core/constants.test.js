import { jest } from "@jest/globals";
import {
	CaptureActions,
	CaptureModes,
	UI_IDS,
	UI_Z_INDEX,
	MIN_SELECTION_SIZE,
} from "../../../src/core/constants.js";

describe("CaptureActions", () => {
	test("has correct capture action", () => {
		expect(CaptureActions.CAPTURE).toBe("capture");
	});

	test("has correct captureTab action", () => {
		expect(CaptureActions.CAPTURE_TAB).toBe("captureTab");
	});

	test("has correct download action", () => {
		expect(CaptureActions.DOWNLOAD).toBe("download");
	});

	test("is frozen", () => {
		expect(Object.isFrozen(CaptureActions)).toBe(true);
	});

	test("has exactly 3 keys", () => {
		expect(Object.keys(CaptureActions)).toHaveLength(3);
	});
});

describe("CaptureModes", () => {
	test("has correct visible mode", () => {
		expect(CaptureModes.VISIBLE).toBe("visible");
	});

	test("has correct element mode", () => {
		expect(CaptureModes.ELEMENT).toBe("element");
	});

	test("has correct region mode", () => {
		expect(CaptureModes.REGION).toBe("region");
	});

	test("is frozen", () => {
		expect(Object.isFrozen(CaptureModes)).toBe(true);
	});

	test("has exactly 3 keys", () => {
		expect(Object.keys(CaptureModes)).toHaveLength(3);
	});
});

describe("UI_IDS", () => {
	test("has highlight ID", () => {
		expect(UI_IDS.HIGHLIGHT).toBe("screenshot-element-highlight");
	});

	test("has confirm ID", () => {
		expect(UI_IDS.CONFIRM).toBe("screenshot-element-confirm");
	});

	test("has filename prompt ID", () => {
		expect(UI_IDS.FILENAME_PROMPT).toBe("screenshot-filename-prompt");
	});

	test("has region overlay ID", () => {
		expect(UI_IDS.REGION_OVERLAY).toBe("screenshot-region-overlay");
	});

	test("has region selection ID", () => {
		expect(UI_IDS.REGION_SELECTION).toBe("screenshot-region-selection");
	});

	test("has region actions ID", () => {
		expect(UI_IDS.REGION_ACTIONS).toBe("screenshot-region-actions");
	});

	test("is frozen", () => {
		expect(Object.isFrozen(UI_IDS)).toBe(true);
	});

	test("has exactly 6 keys", () => {
		expect(Object.keys(UI_IDS)).toHaveLength(6);
	});
});

describe("UI_Z_INDEX", () => {
	test("overlay has a high z-index value", () => {
		expect(Number(UI_Z_INDEX.OVERLAY)).toBeGreaterThan(0);
	});

	test("dialog has a high z-index value", () => {
		expect(Number(UI_Z_INDEX.DIALOG)).toBeGreaterThan(0);
	});

	test("dialog z-index is greater than overlay z-index", () => {
		expect(Number(UI_Z_INDEX.DIALOG)).toBeGreaterThan(Number(UI_Z_INDEX.OVERLAY));
	});

	test("is frozen", () => {
		expect(Object.isFrozen(UI_Z_INDEX)).toBe(true);
	});
});

describe("MIN_SELECTION_SIZE", () => {
	test("is 8", () => {
		expect(MIN_SELECTION_SIZE).toBe(8);
	});

	test("is a number", () => {
		expect(typeof MIN_SELECTION_SIZE).toBe("number");
	});
});

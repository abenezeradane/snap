import { jest } from "@jest/globals";
import {
	createHighlightBox,
	updateHighlight,
	createConfirmOverlay,
	createRegionOverlay,
	createRegionSelectionBox,
	updateRegionSelectionBox,
	hideRegionSelectionBox,
	createRegionActionBar,
	isInternalUiElement,
	isPromptOpen,
	preventPageScroll,
	restorePageScroll,
} from "../../../src/ui/overlay.js";
import { UI_IDS, UI_Z_INDEX } from "../../../src/core/constants.js";

function makeDoc() {
	return {
		body: { style: {}, appendChild: () => {} },
		createElement: (tag) => {
			const el = {
				tagName: tag.toUpperCase(),
				id: "",
				style: {},
				_setAttribute: {},
				_attrs: {},
				setAttribute: (n, v) => { el._attrs[n] = v; },
				appendChild: () => {},
				append: () => {},
				closest: () => null,
				addEventListener: () => {},
				removeEventListener: () => {},
				querySelectorAll: () => [],
			};
			return el;
		},
		createElementNS: (ns, tag) => ({
			ns,
			tagName: tag,
			setAttribute: () => {},
			append: () => {},
			appendChild: () => {},
			style: {},
		}),
		createDocumentFragment: () => ({ appendChild: () => {} }),
		getElementById: () => null,
		querySelector: () => null,
		querySelectorAll: () => [],
	};
}

function makeWin(width = 1920, height = 1080) {
	return { innerWidth: width, innerHeight: height, requestAnimationFrame: (cb) => cb() };
}

describe("createHighlightBox", () => {
	test("creates a div element", () => {
		const doc = makeDoc();
		doc.createElement = jest.fn(doc.createElement);
		createHighlightBox(doc);
		expect(doc.createElement).toHaveBeenCalledWith("div");
	});

	test("element has correct ID", () => {
		const doc = makeDoc();
		const highlight = createHighlightBox(doc);
		expect(highlight.id).toBe(UI_IDS.HIGHLIGHT);
	});

	test("element has fixed position and pointerEvents none", () => {
		const doc = makeDoc();
		const highlight = createHighlightBox(doc);
		expect(highlight.style.position).toBe("fixed");
		expect(highlight.style.pointerEvents).toBe("none");
	});
});

describe("updateHighlight", () => {
	test("sets element display to block when element is provided", () => {
		const el = { style: { display: "none" } };
		const mockElement = { getBoundingClientRect: () => ({ left: 10, top: 20, width: 100, height: 50 }) };
		updateHighlight(el, mockElement);
		expect(el.style.display).toBe("block");
	});

	test("sets element display to none when element is null", () => {
		const el = { style: { display: "block" } };
		updateHighlight(el, null);
		expect(el.style.display).toBe("none");
	});

	test("sets element display to none when element is undefined", () => {
		const el = { style: { display: "block" } };
		updateHighlight(el, undefined);
		expect(el.style.display).toBe("none");
	});

	test("early returns when highlight is null", () => {
		expect(() => updateHighlight(null, {})).not.toThrow();
	});

	test("positions highlight over element rect", () => {
		const el = { style: {} };
		const mockElement = { getBoundingClientRect: () => ({ left: 50, top: 100, width: 200, height: 150 }) };
		updateHighlight(el, mockElement);
		expect(el.style.left).toBe("50px");
		expect(el.style.top).toBe("100px");
		expect(el.style.width).toBe("200px");
		expect(el.style.height).toBe("150px");
	});
});

describe("createConfirmOverlay", () => {
	test("creates overlay with correct z-index", () => {
		const doc = makeDoc();
		const overlay = createConfirmOverlay({
			doc,
			rect: { left: 0, top: 0, width: 100, height: 100 },
			onRetake: () => {},
			onSave: () => {},
		});
		expect(overlay.style.zIndex).toBe(UI_Z_INDEX.OVERLAY);
	});
});

describe("createRegionOverlay", () => {
	test("creates div with crosshair cursor", () => {
		const doc = makeDoc();
		const overlay = createRegionOverlay(doc);
		expect(overlay.style.cursor).toBe("crosshair");
	});

	test("overlay has userSelect none", () => {
		const doc = makeDoc();
		const overlay = createRegionOverlay(doc);
		expect(overlay.style.userSelect).toBe("none");
	});

	test("overlay has fixed position", () => {
		const doc = makeDoc();
		const overlay = createRegionOverlay(doc);
		expect(overlay.style.position).toBe("fixed");
	});
});

describe("createRegionSelectionBox", () => {
	test("creates div with correct ID", () => {
		const doc = makeDoc();
		const box = createRegionSelectionBox(doc);
		expect(box.id).toBe(UI_IDS.REGION_SELECTION);
	});

	test("selection box has pointerEvents none", () => {
		const doc = makeDoc();
		const box = createRegionSelectionBox(doc);
		expect(box.style.pointerEvents).toBe("none");
	});
});

describe("updateRegionSelectionBox", () => {
	test("sets display to block and positions box", () => {
		const box = { style: {} };
		const rect = { left: 10, top: 20, width: 100, height: 50 };
		updateRegionSelectionBox(box, rect);
		expect(box.style.display).toBe("block");
		expect(box.style.left).toBe("10px");
		expect(box.style.top).toBe("20px");
		expect(box.style.width).toBe("100px");
		expect(box.style.height).toBe("50px");
	});

	test("early returns when box is null", () => {
		expect(() => updateRegionSelectionBox(null, { left: 0, top: 0, width: 10, height: 10 })).not.toThrow();
	});

	test("early returns when rect is null", () => {
		expect(() => updateRegionSelectionBox({}, null)).not.toThrow();
	});
});

describe("hideRegionSelectionBox", () => {
	test("sets display to none", () => {
		const box = { style: { display: "block" } };
		hideRegionSelectionBox(box);
		expect(box.style.display).toBe("none");
	});

	test("early returns when box is null", () => {
		expect(() => hideRegionSelectionBox(null)).not.toThrow();
	});
});

describe("createRegionActionBar", () => {
	test("creates div with correct ID", () => {
		const doc = makeDoc();
		const bar = createRegionActionBar({
			doc,
			rect: { left: 100, top: 100, right: 200, bottom: 200 },
			win: makeWin(),
			onRetake: () => {},
			onSave: () => {},
		});
		expect(bar.id).toBe(UI_IDS.REGION_ACTIONS);
	});

	test("positions action bar near selection rect", () => {
		const doc = makeDoc();
		const bar = createRegionActionBar({
			doc,
			rect: { left: 100, top: 100, right: 300, bottom: 200 },
			win: makeWin(1920, 1080),
			onRetake: () => {},
			onSave: () => {},
		});
		expect(bar.style.position).toBe("fixed");
		expect(bar.style.zIndex).toBe(String(UI_Z_INDEX.DIALOG));
	});

	test("has display flex", () => {
		const doc = makeDoc();
		const bar = createRegionActionBar({
			doc,
			rect: { left: 100, top: 100, right: 200, bottom: 200 },
			win: makeWin(),
			onRetake: () => {},
			onSave: () => {},
		});
		expect(bar.style.display).toBe("flex");
	});
});

describe("isInternalUiElement", () => {
	test("returns true for element inside highlight", () => {
		const target = { closest: () => ({ id: UI_IDS.HIGHLIGHT }) };
		expect(isInternalUiElement(target)).toBe(true);
	});

	test("returns true for element inside confirm overlay", () => {
		const target = { closest: () => ({ id: UI_IDS.CONFIRM }) };
		expect(isInternalUiElement(target)).toBe(true);
	});

	test("returns true for element inside filename prompt", () => {
		const target = { closest: () => ({ id: UI_IDS.FILENAME_PROMPT }) };
		expect(isInternalUiElement(target)).toBe(true);
	});

	test("returns false for element outside internal UIs", () => {
		const target = { closest: () => null };
		expect(isInternalUiElement(target)).toBe(false);
	});

	test("returns false when closest returns null", () => {
		const target = { closest: () => null };
		expect(isInternalUiElement(target)).toBe(false);
	});

	test("returns false for null", () => {
		expect(isInternalUiElement(null)).toBe(false);
	});
});

describe("isPromptOpen", () => {
	test("returns true when prompt element exists", () => {
		const doc = { getElementById: () => ({ id: UI_IDS.FILENAME_PROMPT }) };
		expect(isPromptOpen(doc)).toBe(true);
	});

	test("returns false when prompt element does not exist", () => {
		const doc = { getElementById: () => null };
		expect(isPromptOpen(doc)).toBe(false);
	});
});

describe("preventPageScroll", () => {
	test("sets body overflow to hidden", () => {
		const doc = { body: { style: {} } };
		preventPageScroll(doc);
		expect(doc.body.style.overflow).toBe("hidden");
	});
});

describe("restorePageScroll", () => {
	test("clears body overflow", () => {
		const doc = { body: { style: { overflow: "hidden" } } };
		restorePageScroll(doc);
		expect(doc.body.style.overflow).toBe("");
	});
});

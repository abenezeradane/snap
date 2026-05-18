import anime from "animejs";

document.addEventListener("DOMContentLoaded", () => {
	// Set invisible before first paint so there's no flash
	anime.set(".nav-glass", { opacity: 0 });
	anime.set([".hero-title", ".hero-subtitle"], { opacity: 0, translateY: 10 });
	anime.set(".capture-btn", { opacity: 0, translateY: 20 });
	anime.set(".settings-section", { opacity: 0, translateY: 14 });

	// ===== Settings state (single source of truth) =====
	const settings = {
		hiRes: true,
		format: "png",
		quality: 85,
		delay: 0,
		clipboard: false,
		autoSave: false,
		advancedOpen: false,
	};

	let qualityRowVisible = false;

	// ===== Element refs =====
	const hiResEl          = document.getElementById("highResolution");
	const clipboardEl      = document.getElementById("copyToClipboard");
	const autoSaveEl       = document.getElementById("autoSave");
	const qualitySlider    = document.getElementById("jpegQuality");
	const qualityValueEl   = document.getElementById("qualityValue");
	const qualityRow       = document.getElementById("qualityRow");
	const formatControl    = document.getElementById("imageFormatControl");
	const delayControl     = document.getElementById("captureDelayControl");
	const advancedPanel    = document.getElementById("advancedPanel");
	const advancedToggle   = document.getElementById("advancedToggle");
	const themeBtn         = document.getElementById("themeToggle");

	// ===== Load all settings from storage =====
	chrome.storage.sync.get(
		["theme", "highResolution", "imageFormat", "jpegQuality", "captureDelay", "copyToClipboard", "autoSave", "advancedOpen"],
		(data) => {
			applyTheme(data.theme === true);

			settings.hiRes        = data.highResolution   !== false;
			settings.format       = data.imageFormat      || "png";
			settings.quality      = data.jpegQuality      ?? 85;
			settings.delay        = data.captureDelay     ?? 0;
			settings.clipboard    = data.copyToClipboard  === true;
			settings.autoSave     = data.autoSave         === true;
			settings.advancedOpen = data.advancedOpen     === true;

			hiResEl.checked     = settings.hiRes;
			clipboardEl.checked = settings.clipboard;
			autoSaveEl.checked  = settings.autoSave;
			qualitySlider.value = settings.quality;
			qualityValueEl.textContent = `${settings.quality}%`;
			updateSliderFill();

			// Position pills without animation (initial load)
			setActiveSegment(formatControl, settings.format, false);
			setActiveSegment(delayControl, String(settings.delay), false);
			updateQualityVisibility(settings.format, false);

			// Restore accordion state without animation
			if (settings.advancedOpen) {
				advancedPanel.style.height = "auto";
				advancedPanel.style.overflow = "visible";
				anime.set(".advanced-toggle-icon", { rotate: 180 });
				advancedToggle.setAttribute("aria-expanded", "true");
			}
		},
	);

	// ===== Theme =====
	function applyTheme(isDark) {
		document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
	}

	themeBtn.addEventListener("click", () => {
		const isDark = document.documentElement.getAttribute("data-theme") !== "dark";
		chrome.storage.sync.set({ theme: isDark });

		anime({ targets: themeBtn, scale: [1, 0.82, 1], duration: 400, easing: "spring(1, 80, 14, 0)" });

		anime({
			targets: "main",
			opacity: [1, 0.6],
			duration: 100,
			easing: "easeOutQuad",
			complete() {
				applyTheme(isDark);
				anime({ targets: "main", opacity: 1, duration: 220, easing: "easeOutQuad" });
			},
		});
	});

	// ===== High Resolution =====
	hiResEl.addEventListener("change", () => {
		settings.hiRes = hiResEl.checked;
		chrome.storage.sync.set({ highResolution: settings.hiRes });
	});

	// ===== Format =====
	formatControl.addEventListener("click", (e) => {
		const btn = e.target.closest(".seg-btn");
		if (!btn) return;
		settings.format = btn.dataset.value;
		setActiveSegment(formatControl, settings.format, true);
		chrome.storage.sync.set({ imageFormat: settings.format });
		// Only animate the quality row if the accordion is open — otherwise the change is invisible.
		updateQualityVisibility(settings.format, settings.advancedOpen);
	});

	// ===== Quality =====
	qualitySlider.addEventListener("input", () => {
		settings.quality = Number(qualitySlider.value);
		qualityValueEl.textContent = `${settings.quality}%`;
		updateSliderFill();
	});

	qualitySlider.addEventListener("change", () => {
		chrome.storage.sync.set({ jpegQuality: settings.quality });
	});

	// ===== Delay =====
	delayControl.addEventListener("click", (e) => {
		const btn = e.target.closest(".seg-btn");
		if (!btn) return;
		settings.delay = Number(btn.dataset.value);
		setActiveSegment(delayControl, btn.dataset.value, true);
		chrome.storage.sync.set({ captureDelay: settings.delay });
	});

	// ===== Copy to Clipboard =====
	clipboardEl.addEventListener("change", () => {
		settings.clipboard = clipboardEl.checked;
		chrome.storage.sync.set({ copyToClipboard: settings.clipboard });
	});

	// ===== Auto-save =====
	autoSaveEl.addEventListener("change", () => {
		settings.autoSave = autoSaveEl.checked;
		chrome.storage.sync.set({ autoSave: settings.autoSave });
	});

	// ===== Advanced accordion =====
	advancedToggle.addEventListener("click", () => {
		if (settings.advancedOpen) {
			closeAdvanced();
		} else {
			openAdvanced();
		}
	});

	function openAdvanced() {
		settings.advancedOpen = true;
		advancedPanel.style.height = "0px";
		advancedPanel.style.overflow = "hidden";
		advancedToggle.setAttribute("aria-expanded", "true");

		// Cancel any running close animation
		anime.remove(advancedPanel);
		anime.remove(".advanced-panel-inner .setting-row:not(.quality-row)");

		// Prepare rows for stagger (quality-row excluded — CSS opacity class handles it)
		anime.set(".advanced-panel-inner .setting-row:not(.quality-row)", {
			opacity: 0,
			translateY: 10,
		});

		// Expand the panel
		anime({
			targets: advancedPanel,
			height: advancedPanel.scrollHeight,
			duration: 340,
			easing: "cubicBezier(0.22, 1, 0.36, 1)",
			complete() {
				advancedPanel.style.height = "auto";
				advancedPanel.style.overflow = "visible";
			},
		});

		// Stagger rows in after the panel starts opening
		anime({
			targets: ".advanced-panel-inner .setting-row:not(.quality-row)",
			opacity: 1,
			translateY: 0,
			delay: anime.stagger(50, { start: 160 }),
			duration: 300,
			easing: "cubicBezier(0.22, 1, 0.36, 1)",
		});

		anime({
			targets: ".advanced-toggle-icon",
			rotate: 180,
			duration: 300,
			easing: "cubicBezier(0.22, 1, 0.36, 1)",
		});

		chrome.storage.sync.set({ advancedOpen: true });
	}

	function closeAdvanced() {
		settings.advancedOpen = false;
		advancedToggle.setAttribute("aria-expanded", "false");

		// Cancel any running open animation
		anime.remove(advancedPanel);
		anime.remove(".advanced-panel-inner .setting-row:not(.quality-row)");

		// Fade rows out, then collapse the panel
		anime({
			targets: ".advanced-panel-inner .setting-row:not(.quality-row)",
			opacity: 0,
			translateY: 6,
			duration: 110,
			easing: "easeInCubic",
			complete() {
				advancedPanel.style.height = `${advancedPanel.scrollHeight}px`;
				advancedPanel.style.overflow = "hidden";
				anime({
					targets: advancedPanel,
					height: 0,
					duration: 260,
					easing: "cubicBezier(0.22, 1, 0.36, 1)",
				});
			},
		});

		anime({
			targets: ".advanced-toggle-icon",
			rotate: 0,
			duration: 280,
			easing: "cubicBezier(0.22, 1, 0.36, 1)",
		});

		chrome.storage.sync.set({ advancedOpen: false });
	}

	// ===== Capture buttons =====
	document.querySelectorAll(".feature-button").forEach((btn) => {
		const release = () =>
			anime({ targets: btn, scale: 1, duration: 400, easing: "spring(1, 80, 10, 0)" });

		btn.addEventListener("mousedown", () =>
			anime({ targets: btn, scale: 0.97, duration: 80, easing: "easeOutQuad" }),
		);
		btn.addEventListener("mouseup", release);
		btn.addEventListener("mouseleave", release);

		btn.addEventListener("click", () => {
			chrome.runtime.sendMessage(
				{
					action: "startCapture",
					mode: btn.dataset.mode,
					hiRes: settings.hiRes,
					format: settings.format,
					quality: settings.quality,
					delay: settings.delay,
					clipboard: settings.clipboard,
					autoSave: settings.autoSave,
				},
				() => window.close(),
			);
		});
	});

	// ===== Segmented button press micro-interaction =====
	document.querySelectorAll(".seg-btn").forEach((btn) => {
		const release = () =>
			anime({ targets: btn, scale: 1, duration: 250, easing: "spring(1, 80, 10, 0)" });

		btn.addEventListener("mousedown", () =>
			anime({ targets: btn, scale: 0.88, duration: 60, easing: "easeOutQuad" }),
		);
		btn.addEventListener("mouseup", release);
		btn.addEventListener("mouseleave", release);
	});

	// ===== Helpers =====

	// Position the sliding pill indicator for a segmented control.
	function positionPill(pill, btn, animate) {
		if (animate) {
			anime({
				targets: pill,
				left: btn.offsetLeft,
				width: btn.offsetWidth,
				opacity: 1,
				duration: 220,
				easing: "cubicBezier(0.22, 1, 0.36, 1)",
			});
		} else {
			anime.set(pill, {
				left: btn.offsetLeft,
				width: btn.offsetWidth,
				opacity: 1,
			});
		}
	}

	function setActiveSegment(control, value, animate = true) {
		control.querySelectorAll(".seg-btn").forEach((btn) => {
			btn.classList.toggle("active", btn.dataset.value === String(value));
		});

		const pill    = control.querySelector(".seg-pill");
		const active  = control.querySelector(".seg-btn.active");
		if (pill && active) {
			positionPill(pill, active, animate);
		}
	}

	function updateSliderFill() {
		const pct = ((qualitySlider.value - qualitySlider.min) / (qualitySlider.max - qualitySlider.min)) * 100;
		qualitySlider.style.setProperty("--fill", `${pct}%`);
	}

	// Toggle quality row visibility.
	// When animate=true the row slides in/out by simultaneously animating height and
	// margin so the surrounding rows smoothly separate or close together.
	function updateQualityVisibility(format, animate = true) {
		const supported = format === "jpeg" || format === "webp";
		qualitySlider.disabled = !supported;
		if (supported) {
			showQualityRow(animate);
		} else {
			hideQualityRow(animate);
		}
	}

	// The flex gap is 16px. Cancelling it with negative margins while height is 0
	// prevents the phantom 32px gap that would otherwise appear between neighbours.
	const GAP = 16;

	function showQualityRow(animate) {
		if (qualityRowVisible) return;
		qualityRowVisible = true;

		anime.remove(qualityRow);
		qualityRow.style.display = "flex";

		if (!animate) {
			qualityRow.style.height = "auto";
			qualityRow.style.marginTop = "";
			qualityRow.style.marginBottom = "";
			qualityRow.style.opacity = "1";
			return;
		}

		// Measure natural height while display:flex, before collapsing.
		const targetHeight = qualityRow.scrollHeight;

		// Collapse immediately (same tick — browser batches, no flash).
		qualityRow.style.height       = "0px";
		qualityRow.style.overflow     = "hidden";
		qualityRow.style.opacity      = "0";
		qualityRow.style.marginTop    = `${-GAP}px`;
		qualityRow.style.marginBottom = `${-GAP}px`;

		anime({
			targets: qualityRow,
			height: targetHeight,
			marginTop: 0,
			marginBottom: 0,
			opacity: 1,
			duration: 280,
			easing: "cubicBezier(0.22, 1, 0.36, 1)",
			complete() {
				qualityRow.style.height       = "auto";
				qualityRow.style.overflow     = "";
				qualityRow.style.marginTop    = "";
				qualityRow.style.marginBottom = "";
			},
		});
	}

	function hideQualityRow(animate) {
		if (!qualityRowVisible) return;
		qualityRowVisible = false;

		anime.remove(qualityRow);

		if (!animate) {
			qualityRow.style.display = "none";
			return;
		}

		// Pin the current height so AnimeJS can animate from it.
		qualityRow.style.height   = `${qualityRow.scrollHeight}px`;
		qualityRow.style.overflow = "hidden";

		anime({
			targets: qualityRow,
			height: 0,
			marginTop: -GAP,
			marginBottom: -GAP,
			opacity: 0,
			duration: 210,
			easing: "easeInCubic",
			complete() {
				qualityRow.style.display      = "none";
				qualityRow.style.height       = "";
				qualityRow.style.marginTop    = "";
				qualityRow.style.marginBottom = "";
			},
		});
	}

	// ===== Entrance animations =====
	const ease = "cubicBezier(0.22, 1, 0.36, 1)";

	anime({ targets: ".nav-glass", opacity: 1, duration: 300, easing: ease });

	anime({
		targets: [".hero-title", ".hero-subtitle"],
		opacity: [0, 1],
		translateY: [10, 0],
		delay: anime.stagger(60, { start: 60 }),
		duration: 500,
		easing: ease,
	});

	anime({
		targets: ".capture-btn",
		opacity: [0, 1],
		translateY: [20, 0],
		scale: [0.96, 1],
		delay: anime.stagger(70, { start: 180 }),
		duration: 560,
		easing: ease,
	});

	anime({
		targets: ".settings-section",
		opacity: [0, 1],
		translateY: [14, 0],
		scale: [0.98, 1],
		delay: 400,
		duration: 560,
		easing: ease,
	});
});

import anime from "animejs";

document.addEventListener("DOMContentLoaded", () => {
	// Set invisible before first paint so there's no flash
	anime.set(".nav-glass", { opacity: 0 });
	anime.set([".hero-title", ".hero-subtitle"], { opacity: 0, translateY: 10 });
	anime.set(".capture-btn", { opacity: 0, translateY: 20 });
	anime.set(".settings-section", { opacity: 0, translateY: 14 });

	// === Theme ===
	const themeBtn = document.getElementById("themeToggle");

	function applyTheme(isDark) {
		document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
	}

	chrome.storage.sync.get("theme", (data) => {
		applyTheme(data.theme === true);
	});

	themeBtn.addEventListener("click", () => {
		const isDark = document.documentElement.getAttribute("data-theme") !== "dark";
		chrome.storage.sync.set({ theme: isDark });

		// Bounce the toggle icon
		anime({
			targets: themeBtn,
			scale: [1, 0.82, 1],
			duration: 400,
			easing: "spring(1, 80, 14, 0)",
		});

		// Dip opacity → swap theme → fade back up
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

	// === Settings toggles ===
	document.querySelectorAll('#settings input[type="checkbox"]').forEach((toggle) => {
		chrome.storage.sync.get(toggle.id, (data) => {
			toggle.checked = data[toggle.id] !== false;
		});

		toggle.addEventListener("change", () => {
			chrome.storage.sync.set({ [toggle.id]: toggle.checked });
		});
	});

	// === Capture buttons ===
	const hiResToggle = document.getElementById("highResolution");

	document.querySelectorAll(".feature-button").forEach((btn) => {
		// Press micro-interaction
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
					hiRes: hiResToggle.checked,
				},
				() => window.close(),
			);
		});
	});

	// === Entrance animations ===
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

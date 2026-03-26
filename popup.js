document.addEventListener("DOMContentLoaded", () => {
	const themeBtn = document.getElementById("themeToggle");

	// Apply theme
	function applyTheme(isDark) {
		const root = document.documentElement;

		if (isDark) {
			root.setAttribute("data-theme", "dark");
		} else {
			root.setAttribute("data-theme", "light");
		}
	}

	// Load saved preference
	chrome.storage.sync.get("theme", data => {
		const isDark = data.theme === true; // default = light
		applyTheme(isDark);
	});

	// Toggle + save on click
	themeBtn.addEventListener("click", () => {
		const isDark = document.documentElement.getAttribute("data-theme") !== "dark";
		applyTheme(isDark);
		chrome.storage.sync.set({ theme: isDark });
	});

	document.querySelectorAll('#settings input[type="checkbox"]').forEach(toggle => {
		// Load saved preferences
		chrome.storage.sync.get(toggle.id, data => {
			toggle.checked = data[toggle.id] !== false; // default true
		});

		// Save preference on change
		toggle.addEventListener("change", () => {
			chrome.storage.sync.set({ [toggle.id]: toggle.checked });
		});
	});

	// Mode button clicks
	const hiResToggle = document.getElementById("highResolution");
	document.querySelectorAll(".feature-button").forEach((btn) => {
		btn.addEventListener("click", () => {
			const mode = btn.dataset.mode;

			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					files: ["dist/content-script.js"]
				}, () => {
					chrome.tabs.sendMessage(tabs[0].id, {
						action: "capture",
						mode: mode,
						hiRes: hiResToggle.checked,
					});
				});
			});
		});
	});
});

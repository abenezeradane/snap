import { UI_IDS, UI_Z_INDEX } from "../core/constants.js";
import { normalizeFilename } from "../utils/index.js";
import anime from "animejs";

const THEME_TOKENS = {
	dark: {
		bg: "#000000",
		panel: "#1d1d1f",
		panelElevated: "#272729",
		text: "#f5f5f7",
		muted: "#86868b",
		border: "#3a3a3c",
		borderStrong: "#48484a",
		button: "#2c2c2e",
		buttonHover: "#3a3a3c",
		buttonActive: "#0071e3",
		buttonActiveText: "#ffffff",
		input: "#1d1d1f",
		ring: "rgba(0, 113, 227, 0.35)",
		shadow: "0 24px 80px rgba(0, 0, 0, 0.56)",
		backdrop: "rgba(0, 0, 0, 0.64)",
		accentSoft: "rgba(0, 113, 227, 0.08)",
		accentStrong: "rgba(0, 113, 227, 0.18)",
	},
	light: {
		bg: "#f5f5f7",
		panel: "#ffffff",
		panelElevated: "#ffffff",
		text: "#1d1d1f",
		muted: "#6e6e73",
		border: "#d2d2d7",
		borderStrong: "#c7c7cc",
		button: "#ffffff",
		buttonHover: "#f5f5f7",
		buttonActive: "#0071e3",
		buttonActiveText: "#ffffff",
		input: "#f5f5f7",
		ring: "rgba(0, 113, 227, 0.25)",
		shadow: "0 24px 80px rgba(0, 0, 0, 0.18)",
		backdrop: "rgba(0, 0, 0, 0.28)",
		accentSoft: "rgba(0, 113, 227, 0.06)",
		accentStrong: "rgba(0, 113, 227, 0.14)",
	},
};

export function createPromptService({
	doc,
	win = window,
	storage = chrome.storage?.sync,
}) {
	async function resolveTheme() {
		const storedTheme = await readStoredTheme(storage);

		if (storedTheme === true) {
			return "dark";
		}

		if (storedTheme === false) {
			return "light";
		}

		return win.matchMedia?.("(prefers-color-scheme: dark)").matches ?
			"dark" :
			"light";
	}

	function promptFilename(defaultName = "screenshot") {
		return resolveTheme().then((theme) => {
			return new Promise((resolve) => {
				const host = doc.createElement("div");
				host.id = UI_IDS.FILENAME_PROMPT;

				applyStyles(host, {
					position: "fixed",
					inset: "0",
					zIndex: UI_Z_INDEX.DIALOG,
				});

				const shadow = host.attachShadow({ mode: "open" });
				const tokens = THEME_TOKENS[theme];

				shadow.innerHTML = buildPromptTemplate(tokens);

				const root = shadow.querySelector(".snap-root");
				const backdrop = shadow.querySelector(".snap-backdrop");
				const dialog = shadow.querySelector(".snap-dialog");
				const input = shadow.querySelector(".snap-input");
				const shell = shadow.querySelector(".snap-shell");
				const cancelButton = shadow.querySelector('[data-action="cancel"]');

				input.value = defaultName;
				input.placeholder = defaultName;

				function close(result) {
					shadow.removeEventListener("keydown", onShadowKeyDown);
					shadow.removeEventListener("keypress", stopPropagation);
					shadow.removeEventListener("keyup", stopPropagation);
					root.classList.remove("is-open");
					anime({
						targets: shell,
						opacity: 0,
						translateY: 8,
						scale: 0.97,
						duration: 180,
						easing: "easeInCubic",
						complete() {
							removeNode(host);
							resolve(result);
						},
					});
				}

				function submit() {
					close(normalizeFilename(input.value));
				}

				function stopPropagation(event) {
					event.stopPropagation();
				}

				function onShadowKeyDown(event) {
					event.stopPropagation();

					if (event.key === "Escape") {
						event.preventDefault();
						close(null);
						return;
					}

					if (event.key === "Enter") {
						const activeElement = shadow.activeElement || doc.activeElement;
						if (activeElement === input) {
							event.preventDefault();
							submit();
						}
					}
				}

				backdrop.addEventListener("click", () => close(null));
				cancelButton.addEventListener("click", () => close(null));
				dialog.addEventListener("submit", (event) => {
					event.preventDefault();
					submit();
				});

				shadow.addEventListener("keydown", onShadowKeyDown);
				shadow.addEventListener("keypress", stopPropagation);
				shadow.addEventListener("keyup", stopPropagation);

				doc.body.appendChild(host);

				win.requestAnimationFrame(() => {
					root.classList.add("is-open");
					input.focus();
					input.select();
					anime({
						targets: shell,
						opacity: [0, 1],
						translateY: [12, 0],
						scale: [0.97, 1],
						easing: "spring(1, 100, 12, 0)",
					});
				});
			});
		});
	}

	return {
		promptFilename,
	};
}

function readStoredTheme(storage) {
	return new Promise((resolve) => {
		if (!storage?.get) {
			resolve(null);
			return;
		}

		try {
			storage.get("theme", (data) => {
				if (chrome.runtime?.lastError) {
					resolve(null);
					return;
				}

				resolve(typeof data?.theme === "boolean" ? data.theme : null);
			});
		} catch {
			resolve(null);
		}
	});
}

function applyStyles(element, styles) {
	Object.assign(element.style, styles);
}

function removeNode(node) {
	if (node?.parentNode) {
		node.parentNode.removeChild(node);
	}
}

function buildPromptTemplate(tokens) {
	return `
		<style>
			:host { all: initial; }

			.snap-root {
				--bg: ${tokens.bg};
				--panel: ${tokens.panel};
				--panel-elevated: ${tokens.panelElevated};
				--text: ${tokens.text};
				--muted: ${tokens.muted};
				--border: ${tokens.border};
				--border-strong: ${tokens.borderStrong};
				--button: ${tokens.button};
				--button-hover: ${tokens.buttonHover};
				--button-active: ${tokens.buttonActive};
				--button-active-text: ${tokens.buttonActiveText};
				--input: ${tokens.input};
				--ring: ${tokens.ring};
				--shadow: ${tokens.shadow};
				--backdrop: ${tokens.backdrop};
				--accent-soft: ${tokens.accentSoft};
				--accent-strong: ${tokens.accentStrong};

				position: fixed;
				inset: 0;
				display: grid;
				place-items: center;
				font-family: Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
				color: var(--text);
				z-index: ${UI_Z_INDEX.DIALOG};
			}

			*, *::before, *::after { box-sizing: border-box; }

			.snap-backdrop {
				position: absolute;
				inset: 0;
				background: radial-gradient(1200px 600px at 50% -10%, var(--accent-soft), transparent 55%), var(--backdrop);
				backdrop-filter: blur(10px) saturate(1.05);
				-webkit-backdrop-filter: blur(10px) saturate(1.05);
				opacity: 0;
				transition: opacity 180ms ease;
			}

			.snap-shell {
				position: relative;
				width: min(92vw, 420px);
				opacity: 0;
				transform: translateY(12px) scale(0.97);
			}

			.snap-root.is-open .snap-backdrop { opacity: 1; }

			.snap-dialog {
				position: relative;
				overflow: hidden;
				border-radius: 20px;
				border: 1px solid var(--border);
				background: linear-gradient(180deg, color-mix(in srgb, var(--panel-elevated) 88%, white 12%), var(--panel));
				box-shadow: var(--shadow);
			}

			.snap-dialog::before {
				content: "";
				position: absolute;
				inset: 0 0 auto 0;
				height: 1px;
				background: linear-gradient(90deg, transparent, var(--border-strong), transparent);
				opacity: 0.75;
			}

			.snap-header { padding: 18px 18px 10px; display: flex; align-items: center; gap: 14px; }

			.snap-heading { min-width: 0; }

			.snap-eyebrow {
				margin: 0 0 4px;
				font-size: 11px;
				font-weight: 600;
				letter-spacing: 0.06em;
				text-transform: uppercase;
				color: var(--muted);
			}

			.snap-title {
				margin: 0;
				font-size: 20px;
				line-height: 1.19;
				font-weight: 600;
				letter-spacing: -0.374px;
				color: var(--text);
			}

			.snap-subtitle {
				margin: 6px 0 0;
				font-size: 14px;
				line-height: 1.43;
				letter-spacing: -0.224px;
				color: var(--muted);
			}

			.snap-body { padding: 0 18px 18px; display: grid; gap: 14px; }

			.snap-field { display: grid; gap: 8px; }

			.snap-label { font-size: 12px; font-weight: 600; color: var(--muted); }

			.snap-input-wrap {
				display: grid;
				grid-template-columns: 1fr auto;
				align-items: center;
				gap: 8px;
				min-height: 48px;
				padding: 6px;
				border-radius: 16px;
				border: 1px solid var(--border);
				background: var(--input);
				transition: border-color 120ms ease, box-shadow 120ms ease, transform 80ms ease;
			}

			.snap-input-wrap:focus-within {
				border-color: var(--border-strong);
				box-shadow: 0 0 0 4px var(--ring);
			}

			.snap-input {
				width: 100%;
				min-width: 0;
				padding: 10px 12px;
				border: 0;
				outline: 0;
				background: transparent;
				color: var(--text);
				font: inherit;
				font-size: 14px;
				font-weight: 600;
			}

			.snap-input::placeholder { color: var(--muted); }

			.snap-suffix {
				padding: 8px 10px;
				border-radius: 12px;
				border: 1px solid var(--border);
				background: var(--button);
				color: var(--muted);
				font-size: 12px;
				font-weight: 700;
				letter-spacing: 0.02em;
				white-space: nowrap;
			}

			.snap-footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 4px; }

			.snap-button {
				appearance: none;
				border: 1px solid var(--border);
				background: var(--button);
				color: var(--text);
				font: inherit;
				font-size: 13px;
				font-weight: 600;
				min-height: 40px;
				padding: 10px 14px;
				border-radius: 12px;
				cursor: pointer;
				transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease, transform 80ms ease, box-shadow 120ms ease;
			}

			.snap-button:hover {
				border-color: var(--border-strong);
				background: var(--button-hover);
			}

			.snap-button:active { transform: translateY(1px); }

			.snap-button:focus-visible, .snap-input:focus-visible { outline: none; }

			.snap-button--primary {
				background: var(--button-active);
				border-color: var(--button-active);
				color: var(--button-active-text);
				box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 1px 2px rgba(0, 0, 0, 0.08);
			}

			.snap-button--primary:hover { filter: brightness(0.98); }

			@media (max-width: 420px) {
				.snap-header { padding: 16px 16px 10px; }
				.snap-body { padding: 0 16px 16px; }
				.snap-footer { flex-direction: column-reverse; }
				.snap-button { width: 100%; }
			}
		</style>

		<div class="snap-root">
			<div class="snap-backdrop"></div>
			<div class="snap-shell" role="dialog" aria-modal="true" aria-labelledby="snap-title">
				<form class="snap-dialog">
					<div class="snap-header">
						<div class="snap-heading">
							<p class="snap-eyebrow">Save</p>
							<h2 class="snap-title" id="snap-title">Name your screenshot</h2>
							<p class="snap-subtitle">Choose a filename for your PNG export.</p>
						</div>
					</div>
					<div class="snap-body">
						<label class="snap-field">
							<span class="snap-label">Filename</span>
							<div class="snap-input-wrap">
								<input class="snap-input" type="text" autocomplete="off" spellcheck="false"/>
								<div class="snap-suffix">.png</div>
							</div>
						</label>
						<div class="snap-footer">
							<button class="snap-button" type="button" data-action="cancel">Cancel</button>
							<button class="snap-button snap-button--primary" type="submit">Save PNG</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	`;
}

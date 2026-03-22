# snap

A chrome extension for taking screenshots directly in your browser. Capture what's visible, select a region, or pick a specific element.

## Features

- **Visible Capture** — Screenshot of the current viewport
- **Region Capture** — Draw a rectangle anywhere on the page to capture just that area
- **Element Capture** — Hover over any element and click to capture it specifically
- **High Resolution** — Option to capture at 2x resolution for retina displays
- **Theme Support** — Matches your browser's color scheme, or toggle between light and dark manually
- **Downloads Directly** — Captures save straight to your browser's download folder

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked** and select the project directory
5. Click the extension icon in your browser toolbar to open the popup

## Usage

1. Navigate to any webpage
2. Click the **snap** icon in your browser toolbar
3. Choose a capture mode:
   - **Visible** — Captures what's currently in your viewport
   - **Region** — Click and drag to select an area of the page
   - **Element** — Hover to highlight elements, click to capture one
4. Toggle **High Resolution** if you want a retina-quality image
5. Click the mode button to start capture
6. Enter a filename and press Enter (or click **Save PNG**)

## Tech Stack

- **Chrome Extensions (Manifest V3)** — Runs as a browser extension with content scripts
- **Vanilla JavaScript (ES modules)** — No framework dependencies; built with esbuild
- **Shadow DOM** — UI components are encapsulated within shadow roots
- **Chrome APIs** — `chrome.tabs.captureVisibleTab`, `chrome.downloads`, `chrome.storage.sync`

## Project Structure

```
src/
├── core/          # Shared utilities (errors, constants, logger)
├── capture/       # Capture orchestration and mode registry
│   └── modes/     # Visible, element, and region capture logic
├── ui/            # Popup, filename dialog, and overlay UI
└── utils/         # DOM and image processing helpers

popup.*            # Extension popup (HTML, CSS, JS)
manifest.json      # Extension configuration
```

## Commands

```bash
npm run build          # Production build → dist/content-script.js
npm run watch          # Development build with watch mode
npm test               # Run unit tests (Jest)
npm run test:coverage  # Run tests with coverage report
```

## Permissions

| Permission | Purpose |
|------------|---------|
| `tabs` | Access tab information for capture |
| `activeTab` | Inject content script into the active tab |
| `downloads` | Save captured images to disk |
| `scripting` | Execute content scripts for capture |
| `storage` | Persist user preferences (theme, high res) |

## License

[MIT](LICENSE)

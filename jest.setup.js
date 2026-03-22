import { jest } from "@jest/globals";

const makeCallTracker = () => {
	const calls = [];
	let implementation = null;
	const fn = (...args) => {
		if (implementation) {
			return implementation(...args);
		}
		calls.push(args);
	};
	fn.mock = { calls };
	fn.calls = calls;
	fn.mockImplementation = (fn) => { implementation = fn; };
	fn.mockResolvedValue = (val) => { implementation = (key, callback) => { callback(val); }; };
	return fn;
};

let _sendMessageCallback = null;

globalThis.chrome = {
	runtime: {
		lastError: null,
		get lastError() {
			return globalThis.chrome.runtime._lastError;
		},
		set lastError(v) {
			globalThis.chrome.runtime._lastError = v;
		},
		sendMessage: (payload, callback) => {
			if (_sendMessageCallback) {
				_sendMessageCallback(payload, callback);
			}
		},
		_setLastError: null,
	},
	storage: {
		sync: {
			get: makeCallTracker(),
		},
	},
};

globalThis.Image = class MockImage {
	constructor() {
		this._src = "";
		this.width = 0;
		this.height = 0;
		this._onload = null;
		this._onerror = null;
		this._loadSucceeds = true;
	}
	get src() {
		return this._src;
	}
	set src(val) {
		this._src = val;
		setTimeout(() => {
			if (this._loadSucceeds) {
				this._onload?.();
			} else {
				this._onerror?.();
			}
		}, 0);
	}
	get onload() {
		return this._onload;
	}
	set onload(fn) {
		this._onload = fn;
	}
	get onerror() {
		return this._onerror;
	}
	set onerror(fn) {
		this._onerror = fn;
	}
};

globalThis.document = {
	createElement: (tag) => {
		const el = {
			tagName: tag.toUpperCase(),
			id: "",
			textContent: "",
			style: {},
			_SetAttribute: {},
			_attrs: {},
			setAttribute: (name, value) => {
				el._attrs[name] = value;
			},
			appendChild: () => {},
			closest: () => null,
			addEventListener: () => {},
			removeEventListener: () => {},
			querySelector: () => null,
			querySelectorAll: () => [],
			classList: { add: () => {}, remove: () => {} },
			focus: () => {},
			select: () => {},
			getContext: (type) => {
				if (type === "2d") {
					return { drawImage: () => {} };
				}
				return null;
			},
			attachShadow: () => ({
				innerHTML: "",
				querySelector: () => null,
				querySelectorAll: () => [],
				addEventListener: () => {},
				removeEventListener: () => {},
				activeElement: null,
			}),
		};
		if (tag === "canvas") {
			el.toDataURL = () => "data:image/png;base64,abc";
			el.width = 0;
			el.height = 0;
		}
		return el;
	},
	createElementNS: (ns, tag) => {
		const el = { ns, tagName: tag, setAttribute: () => {}, append: () => {}, appendChild: () => {}, style: {} };
		return el;
	},
	createDocumentFragment: () => ({ appendChild: () => {} }),
	body: { style: {}, appendChild: () => {} },
	getElementById: () => null,
	querySelector: () => null,
	querySelectorAll: () => [],
	activeElement: null,
};

globalThis.window = {
	setTimeout,
	clearTimeout,
	requestAnimationFrame: (cb) => cb(),
	innerWidth: 1920,
	innerHeight: 1080,
	get devicePixelRatio() { return getDevicePixelRatio(); },
	set devicePixelRatio(v) { setDevicePixelRatio(v); },
};

globalThis.Image = class MockImage {
	constructor() {
		this._src = "";
		this.width = 0;
		this.height = 0;
		this._onload = null;
		this._onerror = null;
	}
	get src() {
		return this._src;
	}
	set src(val) {
		this._src = val;
		setTimeout(() => {
			if (this._loadSucceeds !== false) {
				this._onload?.();
			} else {
				this._onerror?.();
			}
		}, 0);
	}
	get onload() {
		return this._onload;
	}
	set onload(fn) {
		this._onload = fn;
	}
	get onerror() {
		return this._onerror;
	}
	set onerror(fn) {
		this._onerror = fn;
	}
	causeLoadFailure() {
		this._loadSucceeds = false;
	}
};

globalThis.document = {
	createElement: (tag) => {
		const el = {
			tagName: tag.toUpperCase(),
			id: "",
			textContent: "",
			style: {},
			_SetAttribute: {},
			_attrs: {},
			setAttribute: (name, value) => {
				el._attrs[name] = value;
			},
			appendChild: () => {},
			closest: () => null,
			addEventListener: () => {},
			removeEventListener: () => {},
			querySelector: () => null,
			querySelectorAll: () => [],
			classList: { add: () => {}, remove: () => {} },
			focus: () => {},
			select: () => {},
			getContext: (type) => {
				if (type === "2d") {
					return { drawImage: () => {} };
				}
				return null;
			},
			attachShadow: () => {
				const inputEl = { value: "screenshot", placeholder: "", focus: () => {}, select: () => {} };
				const backdropEl = { addEventListener: () => {} };
				const dialogEl = { addEventListener: () => {}, querySelector: () => null, style: {} };
				const cancelEl = { addEventListener: () => {} };
				const rootEl = { classList: { add: () => {} } };
				return {
					innerHTML: "",
					activeElement: null,
					querySelector: (selector) => {
						if (selector === ".snap-input") return inputEl;
						if (selector === ".snap-backdrop") return backdropEl;
						if (selector === ".snap-dialog") return dialogEl;
						if (selector === '[data-action="cancel"]') return cancelEl;
						if (selector === ".snap-root") return rootEl;
						return null;
					},
					querySelectorAll: () => [],
					addEventListener: () => {},
					removeEventListener: () => {},
				};
			},
		};
		if (tag === "canvas") {
			el.toDataURL = () => "data:image/png;base64,abc";
			el.width = 0;
			el.height = 0;
		}
		return el;
	},
	createElementNS: () => ({
		ns: "http://www.w3.org/2000/svg",
		tagName: "svg",
		setAttribute: () => {},
		appendChild: () => {},
	}),
	createDocumentFragment: () => ({
		appendChild: () => {},
	}),
	body: {
		style: {},
		appendChild: () => {},
	},
	getElementById: () => null,
	querySelector: () => null,
	querySelectorAll: () => [],
	activeElement: null,
};

let _devicePixelRatio = 1;

function getDevicePixelRatio() {
	return _devicePixelRatio;
}

function setDevicePixelRatio(v) {
	_devicePixelRatio = v;
}

globalThis.window = {
	setTimeout,
	clearTimeout,
	requestAnimationFrame: (cb) => cb(),
	innerWidth: 1920,
	innerHeight: 1080,
	get devicePixelRatio() {
		return getDevicePixelRatio();
	},
	set devicePixelRatio(v) {
		setDevicePixelRatio(v);
	},
};

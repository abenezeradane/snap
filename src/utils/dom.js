export function createElement(
	doc,
	tagName, {
		id,
		textContent,
		attrs,
		styles
	} = {},
) {
	const element = doc.createElement(tagName);

	if (id) {
		element.id = id;
	}

	if (typeof textContent === "string") {
		element.textContent = textContent;
	}

	if (attrs) {
		for (const [name, value] of Object.entries(attrs)) {
			element.setAttribute(name, value);
		}
	}

	if (styles) {
		applyStyles(element, styles);
	}

	return element;
}

export function applyStyles(element, styles) {
	Object.assign(element.style, styles);
}

export function removeNode(node) {
	if (node?.parentNode) {
		node.parentNode.removeChild(node);
	}
}

export function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

export function sleep(ms) {
	return new Promise((resolve) => {
		window.setTimeout(resolve, ms);
	});
}

export function createLogger(prefix = "[snap]") {
	const formatter = (level, ...args) => {
		console[level](prefix, ...args);
	};

	return {
		debug: (...args) => formatter("debug", ...args),
		info: (...args) => formatter("info", ...args),
		warn: (...args) => formatter("warn", ...args),
		error: (...args) => formatter("error", ...args),
	};
}

export const noopLogger = {
	debug: () => {},
	info: () => {},
	warn: () => {},
	error: () => {},
};

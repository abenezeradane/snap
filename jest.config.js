export default {
	testEnvironment: "node",
	moduleFileExtensions: ["js"],
	testRegex: "\\.test\\.js$",
	setupFilesAfterEnv: ["./jest.setup.js"],
	collectCoverageFrom: [
		"src/**/*.js",
		"!src/**/*.test.js",
		"!src/content-script.js",
	],
	coverageDirectory: "coverage",
	verbose: true,
};

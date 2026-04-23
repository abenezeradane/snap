import * as esbuild from "esbuild";
import inlineImported from "esbuild-plugin-inline-import";

const isWatch = process.argv.includes("--watch");

const buildOptions = {
	entryPoints: ["src/content-script.js", "src/popup.js"],
	bundle: true,
	outdir: "dist",
	format: "iife",
	platform: "browser",
	target: ["chrome90"],
	minify: !isWatch,
	sourcemap: isWatch,
	plugins: [inlineImported()],
};

async function build() {
	if (isWatch) {
		const ctx = await esbuild.context(buildOptions);
		await ctx.watch();
		console.log("Watching for changes...");
	} else {
		await esbuild.build(buildOptions);
		console.log("Build complete: dist/content-script.js");
	}
}

build().catch(() => process.exit(1));

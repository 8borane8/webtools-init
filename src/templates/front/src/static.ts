import type { Project } from "../../../interfaces/Project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";

export function _static(srcPath: string, project: Project) {
	const staticPath = path.join(srcPath, "static");
	utils.ensureDir(staticPath);

	const stylesPath = path.join(staticPath, "styles");
	utils.ensureDir(stylesPath);

	Deno.writeTextFileSync(
		path.join(stylesPath, "reset.css"),
		`@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");

*:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *)) {
	all: unset;
	display: revert;
}

*,
*::before,
*::after {
	font-family: "Open Sans", sans-serif;

	box-sizing: border-box;
	touch-action: manipulation;
}`,
	);

	Deno.writeTextFileSync(
		path.join(stylesPath, "app.css"),
		`#root {
	width: 100%;
	min-height: 100vh;

	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}`,
	);

	const appStylesPath = path.join(stylesPath, "app");
	utils.ensureDir(appStylesPath);

	Deno.writeTextFileSync(
		path.join(appStylesPath, "index.css"),
		`h1 {
	font-size: 18px;
	font-weight: 500;
}`,
	);

	const scriptsPath = path.join(staticPath, "scripts");
	utils.ensureDir(scriptsPath);

	if (project.api) {
		Deno.writeTextFileSync(
			path.join(scriptsPath, "env.d.ts"),
			`declare const API_URL: string | undefined;`,
		);
	}

	Deno.writeTextFileSync(
		path.join(scriptsPath, "app.ts"),
		`import { Slick, Cookies } from "@webtools/slick-client";

function onLoad() {
	console.log(Cookies.get("token"));
}

Slick.addOnloadListener(onLoad);
onLoad();`,
	);
}

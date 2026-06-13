import type { Project } from "../../../interfaces/project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";

import { templates } from "./templates.ts";
import { pages } from "./pages.ts";
import { islands } from "./islands.ts";
import { _static } from "./static.ts";

export function src(frontPath: string, project: Project) {
	const srcPath = path.join(frontPath, "src");
	utils.ensureDir(srcPath);

	const env = project.api ? `\n\tenv: { API_URL: Deno.env.get("API_URL")! },` : "";

	Deno.writeTextFileSync(
		path.join(srcPath, "index.ts"),
		`import { Slick } from "@webtools/slick-server";

const app = new Slick(import.meta.dirname!, {${env}
\tport: Number(Deno.env.get("APP_PORT")!),
\tclient: true,
});

await app.start();`,
	);

	templates(srcPath, project);
	pages(srcPath, project);
	islands(srcPath);
	_static(srcPath, project);
}

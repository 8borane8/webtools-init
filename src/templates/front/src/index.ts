import type { Project } from "../../../interfaces/Project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";
import { templates } from "./templates.ts";
import { pages } from "./pages.ts";
import { _static } from "./static.ts";

export function src(frontPath: string, project: Project) {
	const srcPath = path.join(frontPath, "src");
	utils.ensureDir(srcPath);

	const env = project.api ? `\n    env: { API_URL: Deno.env.get("API_URL") },` : "";

	Deno.writeTextFileSync(
		path.join(srcPath, "index.ts"),
		`import { Slick } from "@webtools/slick-server";

const slick = new Slick(import.meta.dirname!, {${env}
    port: Number(Deno.env.get("APP_PORT")!),
    client: true,
});

await slick.start();`,
	);

	templates(srcPath, project);
	pages(srcPath, project);

	_static(srcPath, project);
}

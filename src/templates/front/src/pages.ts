import type { Project } from "../../../interfaces/Project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";

export function pages(srcPath: string, project: Project) {
	const pagesPath = path.join(srcPath, "pages");
	utils.ensureDir(pagesPath);

	const f = project.api?.database ? `(req) => ` : "";
	const p = project.api?.database
		? `\n			{req.data.user && <p>Logged has {req.data.user.username}</p>}`
		: "";

	Deno.writeTextFileSync(
		path.join(pagesPath, "index.tsx"),
		`import * as Slick from "@webtools/slick-server";

export default {
	url: "/",
	template: "app",

	title: "Webtools App",

	styles: [
		"/styles/app/index.css",
	],
	scripts: [],

	head: <></>,
	body: ${f}(
		<>
			<h1>Welcome to your Webtools App</h1>${p}
		</>
	),

	onpost: null,
	onrequest: null,
} satisfies Slick.Page;`,
	);
}

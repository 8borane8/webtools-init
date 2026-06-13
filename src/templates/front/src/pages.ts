import type { Project } from "../../../interfaces/project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";

export function pages(srcPath: string, project: Project) {
	const pagesPath = path.join(srcPath, "pages");
	utils.ensureDir(pagesPath);

	const f = project.api?.database ? `(req) => ` : "";
	const p = project.api?.database ? `\n\t\t\t{req.data.user && <p>Logged in as {req.data.user.username}</p>}` : "";

	Deno.writeTextFileSync(
		path.join(pagesPath, "index.tsx"),
		`import type { Page } from "@webtools/slick-server";
import Counter from "../islands/Counter.tsx";

export default {
\turl: "/",
\ttemplate: "app",

\ttitle: "Webtools App",

\tstyles: [
\t\t"/styles/app/index.css",
\t],
\tscripts: [],

\thead: null,
\tbody: ${f}(
\t\t<>
\t\t\t<h1>Welcome to your Webtools App</h1>${p}
\t\t\t<section>
\t\t\t\t<h2>Interactive island</h2>
\t\t\t\t<Counter start={0} label="Clicks" />
\t\t\t</section>
\t\t</>
\t),

\tonpost: null,
\tonrequest: null,
} satisfies Page;`,
	);
}

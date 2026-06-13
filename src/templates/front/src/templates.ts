import type { Project } from "../../../interfaces/project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";

export function templates(srcPath: string, project: Project) {
	const templatesPath = path.join(srcPath, "templates");
	utils.ensureDir(templatesPath);

	const onrequest = project.api?.database
		? `async (req) => {
\t\treq.data.user = null;
\t\tif (!req.cookies.token) return;

\t\tconst response = await fetch(\`\${Deno.env.get("API_URL")}/user\`, {
\t\t\theaders: {
\t\t\t\t"Authorization": \`Bearer \${req.cookies.token}\`,
\t\t\t},
\t\t});

\t\tconst jsonResponse = await response.json();
\t\tif (jsonResponse.success) req.data.user = jsonResponse.data;
\t}`
		: "null";

	Deno.writeTextFileSync(
		path.join(templatesPath, "app.tsx"),
		`import type { Template } from "@webtools/slick-server";

export default {
\tname: "app",
\tfavicon: "/favicon.ico",

\tstyles: [
\t\t"/styles/reset.css",
\t\t"/styles/app.css",
\t],
\tscripts: [
\t\t"/scripts/app.ts",
\t],

\thead: null,
\tbody: (
\t\t<>
\t\t\t<main id="app"></main>
\t\t</>
\t),

\tonrequest: ${onrequest},
} satisfies Template;`,
	);
}

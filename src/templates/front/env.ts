import type { Project } from "../../interfaces/Project.ts";
import * as path from "@std/path";

export function env(frontPath: string, project: Project) {
	Deno.writeTextFileSync(
		path.join(frontPath, ".dev.env"),
		[
			`APP_PORT=${project.app.port}`,
			`APP_URL=http://localhost:${project.app.port}`,

			project.api && `\nAPI_URL=http://localhost:${project.api.port}`,
		].filter(Boolean).join("\n"),
	);

	Deno.writeTextFileSync(
		path.join(frontPath, ".env"),
		[
			`APP_PORT=${project.app.port}`,
			`APP_URL=${project.app.url}`,

			project.api && `\nAPI_URL=${project.api.url}`,
		].filter(Boolean).join("\n"),
	);
}

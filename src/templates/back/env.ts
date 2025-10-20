import type { Project } from "../../interfaces/Project.ts";
import * as path from "@std/path";

export function env(backPath: string, project: Project) {
	Deno.writeTextFileSync(
		path.join(backPath, ".dev.env"),
		[
			`API_SECRET=${crypto.randomUUID()}`,
			`API_PORT=${project.api!.port}`,
			`API_URL=http://localhost:${project.api!.port}`,

			`\nAPP_URL=http://localhost:${project.app.port}`,

			project.api!.database && "\nDATABASE_HOST=\nDATABASE_USER=\nDATABASE_PASS=\nDATABASE_NAME=",
			project.api!.mailer && "\nMAILER_HOST=\nMAILER_USER=\nMAILER_PASS=\nMAILER_NAME=",
		].filter(Boolean).join("\n"),
	);

	Deno.writeTextFileSync(
		path.join(backPath, ".env"),
		[
			`API_SECRET=${crypto.randomUUID()}`,
			`API_PORT=${project.api!.port}`,
			`API_URL=${project.api!.url}`,

			`\nAPP_URL=${project.app.url}`,

			project.api!.database && "\nDATABASE_HOST=\nDATABASE_USER=\nDATABASE_PASS=\nDATABASE_NAME=",
			project.api!.mailer && "\nMAILER_HOST=\nMAILER_USER=\nMAILER_PASS=\nMAILER_NAME=",
		].filter(Boolean).join("\n"),
	);
}

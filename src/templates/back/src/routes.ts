import type { Project } from "../../../interfaces/Project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";

export function routes(srcPath: string, project: Project) {
	const routesPath = path.join(srcPath, "routes");
	utils.ensureDir(routesPath);

	if (project.api!.database) {
		Deno.writeTextFileSync(
			path.join(routesPath, "user.ts"),
			`import * as expressapi from "@webtools/expressapi";
import * as middlewares from "../middlewares/index.ts";
import * as models from "../models/index.ts";

export const routes: expressapi.Route[] = [
	{
		url: "/user",
		method: expressapi.HttpMethods.GET,
		middlewares: [middlewares.user],
		requestListener: (req, res) => {
			const user = (req.data.user as models.User).toJSON();
			delete user.password;

			return res.json({
				success: true,
				data: user,
			});
		},
	},
];`,
		);
	}

	Deno.writeTextFileSync(
		path.join(routesPath, "base.ts"),
		`import * as expressapi from "@webtools/expressapi";

export const routes: expressapi.Route[] = [
	{
		url: "/",
		method: expressapi.HttpMethods.GET,
		middlewares: [],
		requestListener: (_req, res) => {
			return res.json({
				success: true,
				data: "Hello world!",
			});
		},
	},
];`,
	);
}

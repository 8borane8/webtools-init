import type { Project } from "../../../interfaces/project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";

export function routes(srcPath: string, project: Project) {
	const routesPath = path.join(srcPath, "routes");
	utils.ensureDir(routesPath);

	if (project.api!.database) {
		Deno.writeTextFileSync(
			path.join(routesPath, "user.ts"),
			`import { HttpMethods, Router } from "@webtools/expressapi";
import * as middlewares from "#/middlewares/index.ts";

export default new Router<middlewares.UserData>()
	.use(middlewares.user)
	.addRoute({
		url: "/user",
		method: HttpMethods.GET,
		middlewares: [],
		requestListener: (req, res) => {
			const user = req.data.user.toJSON();
			delete user.password;

			return res.json({
				success: true,
				data: user,
			});
		},
	});`,
		);
	}

	Deno.writeTextFileSync(
		path.join(routesPath, "base.ts"),
		`import { HttpMethods, Router } from "@webtools/expressapi";

export default new Router().addRoute({
	url: "/",
	method: HttpMethods.GET,
	middlewares: [],
	requestListener: (_req, res) => {
		return res.json({
			success: true,
			data: "Hello world!",
		});
	},
});`,
	);
}

import type { Project } from "../../../interfaces/Project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";

export function middlewares(srcPath: string, project: Project) {
	const middlewaresPath = path.join(srcPath, "middlewares");
	utils.ensureDir(middlewaresPath);

	Deno.writeTextFileSync(
		path.join(middlewaresPath, "cors.ts"),
		`import * as expressapi from "@webtools/expressapi";

export const cors: expressapi.RequestListener = (_req, res) => {
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Fingerprint");

	res.setHeader("Access-Control-Allow-Origin", Deno.env.get("APP_URL")!);
};`,
	);

	if (project.api!.database) {
		Deno.writeTextFileSync(
			path.join(middlewaresPath, "user.ts"),
			`import * as expressapi from "@webtools/expressapi";
import * as services from "../services/index.ts";
import * as models from "../models/index.ts";

export const user: expressapi.RequestListener = async (req, res) => {
	const token = req.headers.get("authorization")?.split(" ")[1] || "";
	const payload = await services.jsonToken.verify(token);

	if (payload == null || payload.type != "user" || payload.expireAt < Date.now()) {
		return res.status(401).json({
			success: false,
			error: "401 Unauthorized.",
		});
	}

	const user = await models.User.findByPk(payload.id);
	if (user == null || user.resetId != payload.resetId) {
		return res.status(401).json({
			success: false,
			error: "401 Unauthorized.",
		});
	}

	req.data.user = user;
};`,
		);
	}

	Deno.writeTextFileSync(
		path.join(middlewaresPath, "index.ts"),
		[
			`export * from "./cors.ts";`,
			project.api!.database && `export * from "./user.ts";`,
		].filter(Boolean).join("\n"),
	);
}

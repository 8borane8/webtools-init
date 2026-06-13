import type { Project } from "../../../interfaces/project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";

export function middlewares(srcPath: string, project: Project) {
	if (!project.api!.database) return;

	const middlewaresPath = path.join(srcPath, "middlewares");
	utils.ensureDir(middlewaresPath);
	Deno.writeTextFileSync(
		path.join(middlewaresPath, "user.ts"),
		`import type { RequestListener } from "@webtools/expressapi";
import * as services from "#/services/index.ts";
import * as models from "#/models/index.ts";

export interface UserData {
	user: models.User;
}

export const user: RequestListener<Partial<UserData>> = async (req, res) => {
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

	Deno.writeTextFileSync(
		path.join(middlewaresPath, "index.ts"),
		`export * from "./user.ts";`,
	);
}

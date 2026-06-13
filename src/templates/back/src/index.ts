import type { Project } from "../../../interfaces/project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";
import { middlewares } from "./middlewares.ts";
import { models } from "./models.ts";
import { routes } from "./routes.ts";
import { services } from "./services.ts";

export function src(backPath: string, project: Project) {
	const srcPath = path.join(backPath, "src");
	utils.ensureDir(srcPath);

	const database = project.api!.database
		? `import { isModelStatic, Sequelize } from "@sequelize/core";
import { MariaDbDialect } from "@sequelize/mariadb";
import * as models from "#/models/index.ts";

export const database = new Sequelize<MariaDbDialect>({
	dialect: MariaDbDialect,
	host: Deno.env.get("DATABASE_HOST")!,
	user: Deno.env.get("DATABASE_USER")!,
	password: Deno.env.get("DATABASE_PASS")!,
	database: Deno.env.get("DATABASE_NAME")!,

	define: { collate: "utf8mb4_bin" },
	models: Object.values(models).filter((model) => isModelStatic(model)),

	connectTimeout: 10000,
	pool: { acquire: 30000 },
});

await database.authenticate();
await database.sync({ alter: true });

`
		: "";

	Deno.writeTextFileSync(
		path.join(srcPath, "index.ts"),
		`${database}import * as expressapi from "@webtools/expressapi";
import * as path from "@std/path";
import * as fs from "@std/fs";

export const httpServer = new expressapi.HttpServer();
httpServer.cors({ allowOrigin: Deno.env.get("APP_URL")! });

for (const walkEntry of fs.walkSync(\`\${Deno.cwd()}/src/routes\`, { includeDirs: false })) {
	const dynamicImport = await import(path.toFileUrl(walkEntry.path).toString());

	const router: expressapi.Router | undefined = dynamicImport.default;
	if (router) httpServer.use(router);
}

httpServer.listen(Number(Deno.env.get("API_PORT")!));`,
	);

	middlewares(srcPath, project);
	services(srcPath, project);
	routes(srcPath, project);
	models(srcPath, project);
}

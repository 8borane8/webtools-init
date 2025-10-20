import type { Project } from "../../../interfaces/Project.ts";
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
		? `import { MariaDbDialect } from "@sequelize/mariadb";
import * as sequelize from "@sequelize/core";
import * as models from "./models/index.ts";

export const database = new sequelize.Sequelize({
	dialect: MariaDbDialect,
	host: Deno.env.get("DATABASE_HOST")!,
	user: Deno.env.get("DATABASE_USER")!,
	password: Deno.env.get("DATABASE_PASS")!,
	database: Deno.env.get("DATABASE_NAME")!,

	define: { collate: "utf8mb4_bin" },
	models: Object.values(models),

	connectTimeout: 10000,
	pool: { acquire: 30000 },
	// deno-lint-ignore no-explicit-any
} as any);

await database.authenticate();
await database.sync({ alter: true });\n\n`
		: "";

	Deno.writeTextFileSync(
		path.join(srcPath, "index.ts"),
		`${database}import * as middlewares from "./middlewares/index.ts";

import * as expressapi from "@webtools/expressapi";
import * as path from "@std/path";
import * as fs from "@std/fs";

const httpServer = new expressapi.HttpServer(Number(Deno.env.get("API_PORT")));
httpServer.use(middlewares.cors);

for (const walkEntry of fs.walkSync(\`\${Deno.cwd()}/src/routes\`, { includeDirs: false })) {
	const dynamicImport = await import(path.toFileUrl(walkEntry.path).toString());
	const typedDefaultImport: expressapi.Route[] = dynamicImport.routes;

	for (const route of typedDefaultImport) {
		httpServer.registerRoute(
			route.url,
			route.method,
			route.middlewares,
			route.requestListener,
		);
	}
}`,
	);

	middlewares(srcPath, project);
	services(srcPath, project);
	routes(srcPath, project);
	models(srcPath, project);
}

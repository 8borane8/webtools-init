import type { Project } from "../../interfaces/Project.ts";
import * as path from "@std/path";

export function deno(backPath: string, project: Project) {
	const config = {
		lock: false,
		tasks: {
			build: "deno run --allow-all --env-file=.env ./src/index.ts",
			dev: "deno run --watch --allow-all --env-file=.dev.env ./src/index.ts",
		},

		imports: {
			"@webtools/expressapi": "jsr:@webtools/expressapi@^0.4.7",
			"@std/path": "jsr:@std/path@^1.0.4",
			"@std/fs": "jsr:@std/fs@^1.0.3",
		} as Record<string, string>,

		fmt: {
			indentWidth: 4,
			lineWidth: 120,
			useTabs: true,
		},

		compilerOptions: {
			experimentalDecorators: true,
			emitDecoratorMetadata: true,
		},
	};

	if (project.api!.database) {
		config.imports["@sequelize/mariadb"] = "npm:@sequelize/mariadb@^7.0.0-alpha.44";
		config.imports["@sequelize/core"] = "npm:@sequelize/core@^7.0.0-alpha.44";
	}

	if (project.api!.mailer) {
		config.imports["@types/nodemailer"] = "npm:@types/nodemailer@^7.0.1";
		config.imports["nodemailer"] = "npm:nodemailer@^7.0.5";
	}

	Deno.writeTextFileSync(
		path.join(backPath, "deno.jsonc"),
		JSON.stringify(config, null, 4),
	);
}

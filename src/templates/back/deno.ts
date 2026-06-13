import type { Project } from "../../interfaces/project.ts";
import * as path from "@std/path";

export function deno(backPath: string, project: Project, monorepo = false) {
	const config = {
		...(!monorepo && {
			lock: false,
			fmt: {
				indentWidth: 4,
				lineWidth: 120,
				useTabs: true,
			},
		}),

		tasks: {
			build: "deno run -A --env-file=.env ./src/index.ts",
			dev: "deno run -A --watch --env-file=.dev.env ./src/index.ts",
		},

		imports: {
			"#/": "./src/",

			"@webtools/expressapi": "jsr:@webtools/expressapi@^0.8.1",
			"@std/path": "jsr:@std/path@^1.0.8",
			"@std/fs": "jsr:@std/fs@^1.0.14",
		} as Record<string, string>,

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
		path.join(backPath, "deno.json"),
		JSON.stringify(config, null, "\t"),
	);
}

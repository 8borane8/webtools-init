import { sharedImports } from "../shared.ts";
import * as path from "@std/path";

export function deno(frontPath: string, monorepo = false) {
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
			...(!monorepo && sharedImports),

			"@webtools/slick-server": "jsr:@webtools/slick-server@^0.6.16",
			"@webtools/expressapi": "jsr:@webtools/expressapi@^0.8.1",
		},

		compilerOptions: {
			jsxImportSource: "preact",
			jsx: "react-jsx",
		},
	};

	Deno.writeTextFileSync(
		path.join(frontPath, "deno.json"),
		JSON.stringify(config, null, "\t"),
	);
}

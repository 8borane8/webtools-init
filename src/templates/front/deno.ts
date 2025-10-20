import * as path from "@std/path";

export function deno(frontPath: string) {
	const config = {
		lock: false,
		tasks: {
			build: "deno run --allow-all --env-file=.env ./src/index.ts",
			dev: "deno run --watch --allow-all --env-file=.dev.env ./src/index.ts",
		},

		imports: {
			"@webtools/slick-server": "jsr:@webtools/slick-server@^0.3.9",
			"@webtools/slick-client": "jsr:@webtools/slick-client@^0.1.9",
			"@webtools/expressapi": "jsr:@webtools/expressapi@^0.4.7",

			preact: "npm:preact@^10.23.2",
		},

		fmt: {
			indentWidth: 4,
			lineWidth: 120,
			useTabs: true,
		},

		compilerOptions: {
			jsxImportSource: "preact",
			jsx: "react-jsx",
		},
	};

	Deno.writeTextFileSync(
		path.join(frontPath, "deno.jsonc"),
		JSON.stringify(config, null, 4),
	);
}

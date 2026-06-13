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
			"@webtools/slick-server": "jsr:@webtools/slick-server@^0.6.0",
			"@webtools/slick-client": "jsr:@webtools/slick-client@^0.3.0",
			"@webtools/expressapi": "jsr:@webtools/expressapi@^0.8.1",

			"preact": "npm:preact@^10.29.2",
			"preact/hooks": "npm:preact@^10.29.2/hooks",
			"preact/jsx-runtime": "npm:preact@^10.29.2/jsx-runtime",
			"preact-root-fragment": "npm:preact-root-fragment@^0.3.1",
			"@preact/signals": "npm:@preact/signals@^2.9.1",
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

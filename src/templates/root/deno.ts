import * as path from "@std/path";

export function deno(projectPath: string) {
	const config = {
		lock: false,
		workspace: ["./front", "./back"],

		fmt: {
			indentWidth: 4,
			lineWidth: 120,
			useTabs: true,
		},
	};

	Deno.writeTextFileSync(
		path.join(projectPath, "deno.json"),
		JSON.stringify(config, null, "\t"),
	);
}

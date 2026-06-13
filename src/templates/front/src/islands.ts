import * as utils from "../../../utils.ts";
import * as path from "@std/path";

export function islands(srcPath: string) {
	const islandsPath = path.join(srcPath, "islands");
	utils.ensureDir(islandsPath);

	Deno.writeTextFileSync(
		path.join(islandsPath, "Counter.tsx"),
		`import { useSignal } from "@preact/signals";

interface Props {
	start: number;
	label?: string;
}

export default function Counter({ start, label = "Counter" }: Props) {
	const count = useSignal(start);

	return (
		<div style="display:flex;align-items:center;gap:12px">
			<strong>{label}</strong>
			<button type="button" onClick={() => count.value--}>−</button>
			<span>{count}</span>
			<button type="button" onClick={() => count.value++}>+</button>
		</div>
	);
}`,
	);
}

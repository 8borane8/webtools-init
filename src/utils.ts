import * as fs from "@std/fs";

export function promptString(msg: string, def: string): string {
	return prompt(`${msg} (${def}):`)?.trim() || def;
}

export function promptNumber(msg: string, def: number): number {
	return Number(prompt(`${msg} (${def}):`)?.trim()) || def;
}

export function confirmPrompt(msg: string): boolean {
	return prompt(`${msg} [Y/n]:`)?.toLowerCase() != "n";
}

export function ensureDir(p: string) {
	if (!fs.existsSync(p)) Deno.mkdirSync(p, { recursive: true });
}

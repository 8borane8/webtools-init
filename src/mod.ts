import type { Project } from "./interfaces/Project.ts";
import * as front from "./templates/front/index.ts";
import * as back from "./templates/back/index.ts";
import * as utils from "./utils.ts";
import * as path from "@std/path";
import * as fs from "@std/fs";

const project: Project = {
	name: "webtools-app",
	vscode: true,

	app: {
		port: 5000,
		url: "",
	},

	api: {
		port: 5050,
		url: "",

		database: true,
		mailer: true,
	},
};

console.log("\nWelcome to Webtools Init");
console.log("Let's set up your new application.");

project.name = utils.promptString("\n[PROJECT] Name", project.name);

if (!/^[a-z0-9-_]+$/i.test(project.name)) {
	console.error("Invalid project name!");
	Deno.exit(1);
}

if (fs.existsSync(project.name)) {
	console.error("This project already exist!");
	Deno.exit(1);
}

project.vscode = utils.confirmPrompt("[PROJECT] Use VS Code");

project.app.port = utils.promptNumber("\n[APP] Port", project.app.port);
project.app.url = utils.promptString("[APP] URL (Ex: https://webtools.app)", project.app.url);

if (utils.confirmPrompt("\n[PROJECT] Use API") && project.api) {
	project.api.port = utils.promptNumber("\n[API] Port", project.api.port);
	project.api.url = utils.promptString("[API] URL (Ex: https://api.webtools.app)", project.api.url);
	project.api.database = utils.confirmPrompt("[API] Use database");
	project.api.mailer = utils.confirmPrompt("[API] Use mailer");
} else {
	delete project.api;
}

utils.ensureDir(project.name);

if (project.vscode) {
	const vscodeDir = path.join(project.name, ".vscode");
	utils.ensureDir(vscodeDir);
	Deno.writeTextFileSync(
		path.join(vscodeDir, "settings.json"),
		JSON.stringify({ "deno.enable": true }, null, 4),
	);
}

const frontPath = project.api ? path.join(project.name, "front") : project.name;
if (project.api) utils.ensureDir(frontPath);

front.deno(frontPath);
front.env(frontPath, project);

front.src(frontPath, project);

if (project.api) {
	const backPath = path.join(project.name, "back");
	utils.ensureDir(backPath);

	back.deno(backPath, project);
	back.env(backPath, project);

	back.src(backPath, project);
}

console.log("\nProject initialized successfully!");

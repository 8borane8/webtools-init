import type { Project } from "../../../interfaces/Project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";

export function services(srcPath: string, project: Project) {
	if (!project.api!.database && !project.api!.mailer) return;

	const servicesPath = path.join(srcPath, "services");
	utils.ensureDir(servicesPath);

	if (project.api!.database) {
		Deno.writeTextFileSync(
			path.join(servicesPath, "jsonToken.ts"),
			`import * as expressapi from "@webtools/expressapi";

export const jsonToken = new expressapi.JsonToken(Deno.env.get("API_SECRET")!);`,
		);
	}

	if (project.api!.mailer) {
		Deno.writeTextFileSync(
			path.join(servicesPath, "mailer.ts"),
			`// @ts-types="@types/nodemailer"
import * as nodemailer from "nodemailer";

interface MailerOptions {
	readonly host: string;
	readonly port: number;
	readonly secure: boolean;
	readonly auth: {
		readonly user: string;
		readonly pass: string;
	};
}

class Mailer {
	constructor(private readonly config: MailerOptions, private readonly from: string) {}

	public async send(config: nodemailer.SendMailOptions) {
		config.from = this.from;

		const transporter = nodemailer.createTransport(this.config);
		await transporter.sendMail(config);
		transporter.close();
	}
}

export const mailer = new Mailer({
	host: Deno.env.get("MAILER_HOST")!,
	port: Number(Deno.env.get("MAILER_PORT")!),
	secure: true,
	auth: {
		user: Deno.env.get("MAILER_USER")!,
		pass: Deno.env.get("MAILER_PASS")!,
	},
}, Deno.env.get("MAILER_FROM")!);`,
		);
	}

	Deno.writeTextFileSync(
		path.join(servicesPath, "index.ts"),
		[
			project.api!.database && `export * from "./jsonToken.ts";`,
			project.api!.mailer && `export * from "./mailer.ts";`,
		].filter(Boolean).join("\n"),
	);
}

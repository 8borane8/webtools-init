import type { Project } from "../../../interfaces/Project.ts";
import * as utils from "../../../utils.ts";
import * as path from "@std/path";

export function models(srcPath: string, project: Project) {
	if (!project.api!.database) return;

	const modelsPath = path.join(srcPath, "models");
	utils.ensureDir(modelsPath);

	Deno.writeTextFileSync(
		path.join(modelsPath, "User.ts"),
		`import * as decorators from "@sequelize/core/decorators-legacy";
import * as sequelize from "@sequelize/core";

export class User extends sequelize.Model {
	@decorators.Attribute(sequelize.DataTypes.INTEGER)
	@decorators.PrimaryKey
	@decorators.AutoIncrement
	declare id: sequelize.CreationOptional<number>;

	@decorators.Attribute(sequelize.DataTypes.STRING)
	@decorators.NotNull
	declare username: string;

	@decorators.Attribute(sequelize.DataTypes.STRING)
	@decorators.NotNull
	@decorators.Unique
	declare email: string;

	@decorators.Attribute(sequelize.DataTypes.STRING)
	@decorators.NotNull
	declare password: string;

	@decorators.Attribute(sequelize.DataTypes.INTEGER)
	@decorators.NotNull
	@decorators.Default(0)
	declare resetId: sequelize.CreationOptional<number>;

	declare createdAt: sequelize.CreationOptional<Date>;
	declare updatedAt: sequelize.CreationOptional<Date>;
}`,
	);

	Deno.writeTextFileSync(
		path.join(modelsPath, "index.ts"),
		`export * from "./User.ts";`,
	);
}

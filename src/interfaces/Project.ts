export interface Project {
	name: string;
	vscode: boolean;

	app: {
		port: number;
		url: string;
	};

	api?: {
		port: number;
		url: string;

		database: boolean;
		mailer: boolean;
	};
}

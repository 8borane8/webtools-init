<h1 align="center">Welcome on Webtools Init !</h1>

<p align="center">
    <em>
        Webtools Init is a minimal CLI tool that lets you create a full-stack web application using Slick (Front, SSR, SPA) and ExpressAPI (Back).
    </em>
</p>

<p align="center">
    <img src="https://img.shields.io/github/issues-closed/8borane8/webtools-init.svg" alt="issues-closed" />
	&nbsp;
    <img src="https://img.shields.io/github/license/8borane8/webtools-init.svg" alt="license" />
    &nbsp;
    <img src="https://img.shields.io/github/stars/8borane8/webtools-init.svg" alt="stars" />
    &nbsp;
    <img src="https://img.shields.io/github/forks/8borane8/webtools-init.svg" alt="forks" />
</p>

<hr>

## ✨ Features

- **Interactive CLI** — guided setup through a series of prompts (project name, ports, URLs, optional services)
- **Full-stack or frontend-only** — generate a complete monorepo or a standalone Slick app
- **Frontend: Slick** — SSR with Preact, client hydration, and interactive islands (`@preact/signals`)
- **Backend: ExpressAPI** — HTTP server with auto-discovered routes, CORS, and JSON responses
- **Optional database** — Sequelize ORM with MariaDB, user model, JWT auth middleware, and `/user` endpoint
- **Optional mailer** — Nodemailer service ready to send emails
- **Deno workspace** — monorepo layout with shared formatting when the API is enabled
- **VS Code ready** — optional `.vscode/settings.json` with Deno enabled
- **Zero install** — runs instantly from JSR, no global setup required

## 📦 Installation

No installation needed. Run the CLI directly from JSR:

```bash
deno run -Ar jsr:@webtools/init
```

## 🧭 Interactive setup

The CLI walks you through the following steps:

| Step         | Prompt                                       | Default                |
| ------------ | -------------------------------------------- | ---------------------- |
| Project name | Letters, numbers, hyphens, underscores, dots | `webtools-new-project` |
| VS Code      | Enable Deno in `.vscode/settings.json`       | Yes                    |
| App port     | Frontend server port                         | `5000`                 |
| App URL      | Production frontend URL                      | _(empty)_              |
| Use API      | Enable a backend alongside the frontend      | Yes                    |
| API port     | Backend server port                          | `5050`                 |
| API URL      | Production API URL                           | _(empty)_              |
| Database     | Sequelize + MariaDB integration              | Yes                    |
| Mailer       | Nodemailer email service                     | Yes                    |

If you decline the API, only the frontend is generated at the project root. If you accept it, a Deno workspace monorepo
is created with `front/` and `back/` directories.

## 📁 Generated project structure

### With API (monorepo)

```
my-project/
├── deno.json          # Deno workspace (front + back)
├── front/
│   ├── deno.json
│   ├── .dev.env
│   ├── .env
│   └── src/
│       ├── index.ts       # Slick server entry point
│       ├── pages/         # Route pages (SSR)
│       ├── templates/     # Layout templates
│       ├── islands/       # Interactive Preact components
│       └── static/        # CSS, scripts, assets
└── back/
    ├── deno.json
    ├── .dev.env
    ├── .env
    └── src/
        ├── index.ts       # ExpressAPI server entry point
        ├── routes/        # Auto-loaded routers
        ├── middlewares/   # Request middlewares (if database)
        ├── models/        # Sequelize models (if database)
        └── services/      # JsonToken, mailer (if enabled)
```

### Without API (frontend only)

```
my-project/
├── deno.json
├── .dev.env
├── .env
└── src/
    ├── index.ts
    ├── pages/
    ├── templates/
    ├── islands/
    └── static/
```

## 🚀 Usage

Each application runs independently with its own `deno task` commands.

### Frontend

```bash
cd front        # or project root if no API
deno task dev   # development — watch mode + .dev.env
```

```bash
deno task build # production — .env
```

The generated frontend includes:

- A **Slick server** with SSR and client hydration
- A sample **home page** with a Preact **Counter island**
- A base **app template** with reset and layout styles
- If the database option is enabled: an `onrequest` hook that fetches the logged-in user from the API via a Bearer token
  cookie

### Backend

```bash
cd back
deno task dev   # development — watch mode + .dev.env
```

```bash
deno task build # production — .env
```

The generated backend includes:

- An **ExpressAPI** server with CORS restricted to `APP_URL`
- **Auto-discovery** of all routers exported from `src/routes/`
- A `GET /` route returning a JSON hello-world response
- If the database option is enabled:
  - A **User** model (`id`, `username`, `email`, `password`, `resetId`)
  - A **JsonToken** service for JWT authentication
  - A **user middleware** that validates tokens and attaches the user to the request
  - A `GET /user` route returning the authenticated user (password stripped)
- If the mailer option is enabled: a **Mailer** service wrapping Nodemailer

## ⚙️ Environment configuration

Two env files are generated per application:

- **`.dev.env`** — local development (localhost URLs, watch mode)
- **`.env`** — production (URLs provided during setup)

### Frontend variables

| Variable   | Description                            |
| ---------- | -------------------------------------- |
| `APP_PORT` | Server port                            |
| `APP_URL`  | Public frontend URL                    |
| `API_URL`  | Backend URL _(only if API is enabled)_ |

### Backend variables

| Variable     | Description                           |
| ------------ | ------------------------------------- |
| `API_SECRET` | JWT signing secret _(auto-generated)_ |
| `API_PORT`   | Server port                           |
| `API_URL`    | Public API URL                        |
| `APP_URL`    | Frontend URL (used for CORS)          |

If the **database** option is enabled, fill in the following in `/back`:

```
DATABASE_HOST=
DATABASE_USER=
DATABASE_PASS=
DATABASE_NAME=
```

If the **mailer** option is enabled, also configure:

```
MAILER_HOST=
MAILER_PORT=
MAILER_USER=
MAILER_PASS=
MAILER_NAME=
```

## 🛠 Tech stack

| Layer           | Package                                  | Role                            |
| --------------- | ---------------------------------------- | ------------------------------- |
| CLI             | `@webtools/init`                         | Project scaffolding             |
| Frontend server | `@webtools/slick-server`                 | SSR, pages, templates           |
| Frontend client | `@webtools/slick-client`                 | Hydration, cookies              |
| UI              | `preact` + `@preact/signals`             | Components and reactive islands |
| Backend         | `@webtools/expressapi`                   | HTTP server, router, JsonToken  |
| ORM             | `@sequelize/core` + `@sequelize/mariadb` | Database _(optional)_           |
| Email           | `nodemailer`                             | Mailer _(optional)_             |

## 🪪 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

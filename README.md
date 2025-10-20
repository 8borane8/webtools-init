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

- Create a ready-to-use full-stack web app (front + back)
- Frontend: Slick (SSR + SPA)
- Backend: ExpressAPI
- Authentication: Built-in JsonToken auth service
- Database: Seequelize ORM integration
- Pre-configured project structure (client, server, shared)
- Works instantly via JSR — no installation needed

## 📦 Installation

```bash
deno run -Ar jsr:@webtools/init
```

## 🚀 Usage

Once your project is created, two applications will be available (if you enabled the API):

- **Frontend** (in `/front`)
- **Backend** (in `/back`)

You must start them **separately**, each with its own command.

### 🔹 Frontend

```bash
cd front
deno task dev
```

> Runs the front app in **development mode**, using development environment variables.

To build it for production:

```bash
deno task build
```

> Builds and serves the front app in **production mode**, using production environment variables.

### 🔹 Backend

```bash
cd back
deno task dev
```

> Runs the back app in **development mode**, using development environment variables.

To build it for production:

```bash
deno task build
```

> Builds and serves the back app in **production mode**, using production environment variables.

## ⚙️ Environment Configuration

If you activate the **database** option during project creation, go to the `/back` directory and configure your
environment files with the following variables:

```
DATABASE_HOST=
DATABASE_USER=
DATABASE_PASS=
DATABASE_NAME=
```

If you enable the **mailer** service, also configure:

```
MAILER_HOST=
MAILER_USER=
MAILER_PASS=
MAILER_NAME=
```

When the database option is enabled, the generated code automatically includes:

- A minimal **user model**
- An **authentication middleware**
- An **endpoint** to fetch user data

This provides a ready-to-use foundation for managing user accounts securely.

## 🪪 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

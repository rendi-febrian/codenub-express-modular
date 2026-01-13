# CODENUB Express Modular CLI (cem)

> **The Ultimate CLI for scalable, type-safe Express.js applications with Clean Architecture.**

`cem` allows you to scaffold enterprise-grade Express applications in seconds, enforcing a modular Clean Architecture similar to NestJS but without the heavy runtime overhead. It comes packed with Prisma ORM, Docker support, and Swagger documentation capabilities out of the box.

## 🚀 Key Features

*   **Modular Architecture**: Automatically organizes code into Modules (Controller, Service, Repository, DTO).
*   **Clean Architecture**: Strict separation of concerns (Presentation, Application, Domain, Infrastructure).
*   **Developer Experience**: Interactive CLI, Smart Argument Detection, and Custom Path support.
*   **Prisma Integration**: First-class support for Database ORM.
*   **Production Ready**: Built-in support for **Docker** and **Swagger** setup.
*   **Standard Templates**: Pre-built templates for Authentication and User Management.

---

## 📦 Installation

Install globally via npm:

```bash
npm install -g codenub-express-modular
```

Or run directly with `npx`:

```bash
npx codenub-express-modular init my-app
```

---

## ⚡ Quick Start

### 1. Initialize Project
```bash
cem init my-awesome-app
cd my-awesome-app
npm install
```

### 2. Setup Database
```bash
# Initialize Prisma
cem prisma init

# (Optional) Update prisma/schema.prisma then generate client
cem prisma generate
```

### 3. Generate Resources
```bash
# Create a User module (Interactive prompt will offer a Standard Template)
cem create module user

# Create a standalone service with custom path
cem create service Services/Payment
```

### 4. Run Application
```bash
npm run dev
```

---

## 🛠️ CLI Commands REFERENCE

### Core Commands

#### `cem init <project-name>`
Scaffolds a new project with TypeScript, Express, and Clean Architecture structure.

#### `cem create` (Interactive Wizard)
Run without arguments to start the interactive wizard.
```bash
cem create
# ? What do you want to create? (Module / Service / Repository / Middleware)
# ? What is the name? ...
```

#### `cem create module <name>`
Generates a full feature module including Controller, Service, Repository, DTO, and Test spec.
*   **Special Trigger**: Using names `user` or `auth` triggers a prompt to use **Standard Templates** (Pre-wired Auth/User logic).

#### `cem create service <name>`
Generates a standalone Service class.
*   **Smart Parsing**: `cem create service Services/Aws` -> `src/Services/aws.service.ts`
*   **Interactive**: Prompts for target directory (Module, Global, or Custom Path).

#### `cem create repository <name>`
Generates a standalone Repository class.

#### `cem create middleware <name>`
Generates a Middleware function.
*   Default location: `src/common/middlewares`

### Power Features

#### `cem add docker` 🐳
Adds containerization support to your project.
*   Generates `Dockerfile` (Multi-stage build).
*   Generates `docker-compose.yml` (App + PostgreSQL).
*   Generates `.dockerignore`.

#### `cem add swagger` 📄
Adds OpenAPI documentation support.
*   Installs `swagger-ui-express`.
*   Generates `src/config/swagger.ts`.
*   *Note: You must manually mount the Swagger docs in `src/app.ts` after running this.*

### Database (Prisma)

#### `cem prisma init`
Installs Prisma dependencies and initializes schema.

#### `cem prisma generate`
Runs `prisma generate` to update the client.

### Productivity

#### `cem list`
Visualizes your project structure (Modules & Components).

#### `cem remove module <name>`
Safely deletes a module folder.

#### `cem doctor`
Diagnoses your environment (Node version, Config files, Prisma status).

---

## 📂 Project Structure

A generated `cem` project follows this industry-standard structure:

```
my-app/
├── src/
│   ├── common/             # Shared utilities, middlewares, guards
│   │   ├── middlewares/
│   ├── config/             # Environment & Library configs (Swagger, etc.)
│   ├── modules/            # Feature Modules
│   │   ├── user/
│   │   │   ├── dto/        # Data Transfer Objects
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   └── user.service.spec.ts
│   │   └── auth/
│   ├── app.ts              # Express App Setup
│   └── main.ts             # Entry Point
├── prisma/                 # Database Schema
├── docker-compose.yml
└── package.json
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

Distributed under the **MIT-LICENSE**.

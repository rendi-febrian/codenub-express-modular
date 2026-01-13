<p align="center">
  <img src="https://img.shields.io/npm/v/codenub-express-modular?style=for-the-badge&color=blue" alt="Version" />
  <img src="https://img.shields.io/npm/l/codenub-express-modular?style=for-the-badge&color=green" alt="License" />
  <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge" alt="Maintained" />
</p>

<h1 align="center">CODENUB Express Modular (CEM)</h1>

<p align="center">
  <b>The Enterprise-Grade CLI for Node.js & Express</b><br>
  <i>Build scalable, type-safe, and modular applications in seconds.</i>
</p>

<hr />

## 🌟 Introduction

**CEM** is not just a generator; it's a complete **Development Ecosystem**.
It bridges the gap between the simplicity of Express.js and the structure of NestJS.

**Why developers love CEM:**
*   **Zero Boilerplate**: Skip the setup. Get a running app in 10 seconds.
*   **Clean Architecture**: Enforced modular design (Service-Repository Pattern).
*   **Production Ready**: Comes with **Docker**, **Prisma**, **Swagger**, **Helmet**, and **CORS**.
*   **Type-Safe**: Built entirely on TypeScript.

---

## 📦 Installation

You have two options to use CEM.

### Option 1: Global Installation (Recommended)
Install it once, use it everywhere on your machine.
```bash
npm install -g codenub-express-modular
```

### Option 2: On-Demand (NPX)
Run without installing. Perfect for testing or one-time use.
```bash
npx codenub-express-modular <command>
```

---

## ⚡ Quick Start Guide

Go from zero to running API in 3 steps.

### Step 1: Initialize Project
Create a new project folder with the entire stack set up.
```bash
cem init my-app
```

### Step 2: Install & Setup
Enter the folder and install dependencies.
```bash
cd my-app
npm install
cem prisma init
```

### Step 3: Launch!
Start the development server.
```bash
npm run dev
```
> **Your App is Live:** `http://localhost:3000`
> **API Docs are Live:** `http://localhost:3000/docs`

---

## 💎 Features Deep Dive

### 1. The `create` Workflow
Stop copying and pasting files. Generate them.

*   **Modules**: Creates Controller, Service, Repository, DTO, and Test files.
    ```bash
    cem create module product
    ```
*   **Services / Repositories**: Create standalone components.
    ```bash
    cem create service Services/EmailSender
    ```

> **� Power Tip**: Try creating a module named `user` or `auth`.
> CEM will detect this and offer to **pre-fill authentication logic** (Login, Register, JWT, Password Hashing)!

### 2. Zero-Config Swagger
Documentation is critical but tedious. CEM solves this with **Auto-Swagger**.

*   **How to Enable**: Run `cem add swagger`.
*   **How it Works**:
    1.  CEM configures `swagger-jsdoc`.
    2.  When you run `cem create module`, the generated files already have JSDoc tags.
    3.  Your API documentation updates automatically as you code!

### 3. Docker Ecosystem
Deploying to production? We got you covered.

*   **Command**: `cem add docker`
*   **Database Choice**: The CLI will ask:
    *   `PostgreSQL` (Default)
    *   `MySQL`
    *   `SQLite`
*   **Output**: Generates a production-optimized `Dockerfile` (multistage build) and a tailored `docker-compose.yml`.

### 4. Database Management
CEM creates a wrapper around Prisma for easier memory.

*   `cem prisma init`: Sets up schema and client.
*   `cem prisma generate`: Refreshes your client after schema changes.

---

## 📂 Project Architecture

We follow the **Service-Repository Pattern** to keep your code clean and testable.

```
src/
├── app.ts                  # App Configuration (Middleware, Routes)
├── server.ts               # Entry Point
├── common/                 # Global Utilities
│   ├── middlewares/        # Express Middlewares
│   └── exceptions/         # Error Handling
├── config/                 # Environment Configs
└── modules/                # Feature Modules
    ├── user/
    │   ├── dto/            # Data Transfer Objects (Validation)
    │   ├── user.controller.ts  # Route Handlers
    │   ├── user.service.ts     # Business Logic
    │   ├── user.repository.ts  # Database Queries
    │   └── user.service.spec.ts # Unit Tests
```

---

## ❓ FAQ

**Q: Can I use this with MongoDB?**
A: Currently, we focus on Relational DBs via Prisma (Postgres, MySQL, SQLite). MongoDB support via Mongoose is on the roadmap!

**Q: Is this opinionated?**
A: Yes. We enforce strict TypeScript and Clean Architecture to ensure your project scales well.

---

## 🤝 Community & License

Built with ❤️ by **CODENUB**.
Licensed under **MIT**. Feel free to use in personal or commercial projects.

# Copilot instructions for this repository

This file contains concise, actionable instructions for AI coding agents working on this Express + Sequelize TypeScript API.

1. Project overview
- **Stack**: Node + TypeScript, Express 5, Sequelize (+ sequelize-typescript), PostgreSQL (`pg`).
- **Entry point**: `src/index.ts` — creates and starts the HTTP server exported from `src/server.ts`.
- **DB**: `src/config/db.ts` uses `process.env.DATABASE_URL` and loads models from `src/models/**/*.ts`.

2. How the app is run (dev / prod)
- Use `npm run dev` (runs `tsx watch src/index.ts`) for live TypeScript execution while developing.
- Use `npm start` to run `tsx src/index.ts`.
- Use `npm run build` to run `npx tsc` (produces JavaScript in `dist/` if tsconfig configured).

3. Environment variables (required)
- `DATABASE_URL` — Postgres connection string used by Sequelize.
- `JWT_SECRET` — secret used to sign authentication tokens in `src/handlers/auth.ts`.
- `PORT` — optional, default 4000.
- `NODE_ENV` — when `production` the auth cookie is flagged `secure`.

4. Routing & structure patterns
- Routes live in `src/routes/*.ts` and export an Express `Router`. Add a new route file and then mount it in `src/server.ts` using `server.use('/your-path', yourRouter)`.
- Example: `src/routes/auth.ts` -> mounted at `/auth` in `src/server.ts` and calls handlers in `src/handlers/auth.ts`.

5. Models & database usage
- Models are located in `src/models/*.model.ts` and are loaded automatically by Sequelize using the glob `__dirname + "/../models/**/*.ts"` in `src/config/db.ts`.
- The app calls `db.authenticate()` and `db.sync()` at startup (no migrations). Expect `sync()` to create/alter tables.

6. Auth details (important)
- Auth handlers are in `src/handlers/auth.ts`. They:
  - Use `bcrypt` for hashing/comparing passwords.
  - Use `jsonwebtoken` to create a JWT with `generateToken(id)` and set it as a cookie named `token`.
  - Rely on `process.env.JWT_SECRET` being set; if missing, token creation will fail.
  - Cookies are configured with `httpOnly`, `sameSite: 'strict'`, and `secure` when `NODE_ENV === 'production'`.

7. Conventions & gotchas discovered
- Start new route modules as `Router()` instances — server expects you to mount them in `src/server.ts`.
- The codebase uses `tsx` for running TypeScript directly in dev; avoid running `node` against `.ts` files unless you first compile.
- DB model filenames use PascalCase (e.g., `Users.model.ts`) and expose default exports used throughout the code (e.g., `import User from '../models/Users.model'`).
- Error handling is inconsistent in handlers (some `return res.status(...).json(...)`, others `throw new Error(error)`). When editing handlers, prefer keeping the current response style unless you update surrounding usages.
- `auth.loginUser` accesses `user.password` before null-checking `user` — be careful when editing to avoid introducing runtime crashes; preserve existing checks or add them with tests.

8. Useful files to inspect when making changes
- `src/server.ts` — server setup, mounting routers, DB connect and sync.
- `src/config/db.ts` — Sequelize instantiation and model discovery.
- `src/routes/*.ts` and `src/handlers/*.ts` — request routing and business logic.
- `package.json` — dev scripts (`dev`, `start`, `build`) and dependencies.

9. When modifying the code
- For new routes: add `src/routes/newRoute.ts`, export router, then add `server.use('/new', newRoute)` in `src/server.ts`.
- For DB model changes: update model in `src/models/`, then restart dev server (sync runs at startup). Note: no migrations — changing models may drop or alter tables depending on sync options.

10. Merge guidance (if this file previously existed)
- If an existing `.github/copilot-instructions.md` exists, preserve any project-specific notes and only add missing, verifiable details above (env names, run commands, file paths).

If anything here is unclear or you want more detail (examples of adding a route, model, or an explicit testing workflow), tell me which area to expand. 

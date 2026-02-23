# itsi-project

A full-stack todo application with user authentication. Built as a CI/CD learning project.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 + Vite + TypeScript |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| State | Pinia |
| Backend | Node.js + Express 5 + TypeScript |
| Database | SQLite3 |
| Auth | JWT + bcryptjs |
| Testing | Vitest (client), Jest (server) |

## Prerequisites

- Node.js 22 LTS
- npm 10+

## Quick Start

```bash
# Install all dependencies
npm install

# Configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit server/.env and set JWT_SECRET

# Start development servers
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both servers in development mode |
| `npm run build` | Compile server TypeScript + bundle client |
| `npm run test` | Run all tests |
| `npm run lint` | Lint all code |
| `npm run start` | Start production server |

## API

Base URL: `http://localhost:5000/api/v1`

### Auth (public)
- `POST /auth/register` — `{ email, password }` → `{ token, user }`
- `POST /auth/login` — `{ email, password }` → `{ token, user }`

### Tasks (requires `Authorization: Bearer <token>`)
- `GET /tasks` — get all your tasks
- `POST /tasks` — `{ title, description? }` → create task
- `PATCH /tasks/:id` — `{ title?, description? }` → update task
- `PATCH /tasks/:id/toggle` — toggle completed status
- `DELETE /tasks/:id` — delete task

## Project Structure

```
itsi-project/
├── server/          Express + TypeScript backend
│   └── src/
│       ├── routes/  auth.ts, tasks.ts
│       ├── middleware/
│       └── ...
└── client/          Vue 3 + Vite frontend
    └── src/
        ├── views/   LoginView, RegisterView, HomeView
        ├── components/
        ├── stores/  Pinia stores
        └── api/     Axios API client
```

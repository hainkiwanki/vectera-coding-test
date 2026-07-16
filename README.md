# Vectera Coding Test

This repo contains the **basics** for the coding test. It includes:
- **Backend**: Django + DRF skeleton with stubs and TODOs
- **Frontend**: Angular skeleton (routing, service stubs, components)
- **Docker**: Postgres + Backend
- **CI**: Placeholder workflow that **fails** by default (you will fix it)

> Target time: 4–6 hours. Complete the core tasks.

## Getting Started

### 1) Run with Docker (DB + Backend)
```bash
docker compose up --build
```
- Backend: http://localhost:8000
- Health: http://localhost:8000/api/health/
- DB: postgres://app:app@localhost:5432/app

**Note:** The backend image installs Python dependencies and runs migrations automatically.

### 2) Frontend (Angular)
```bash
cd frontend
npm install
npm start
```
- Angular dev server: http://localhost:4200 (proxies /api to http://localhost:8000)

### 3) What you implement
Backend (Django + DRF):
- Data models for `Meeting`, `Note`, `Summary`
- REST endpoints for meetings, notes, and summary flow
- Simulated async summary using the provided `services/ai.py` stub
- Basic validation, pagination, simple logging & `/api/health/`

Frontend (Angular):
- `/meetings` list (title, started_at, note count, summary badge)
- `/meetings/:id` detail (notes feed, add note form, “Generate summary”, summary panel)
- Loading/error states, typed API models, clean module structure
- Polling summary status until `ready`

Tests:
- Backend: at least 1 model test, 1 happy-path API test, 1 validation/edge test
- Frontend: at least 1 unit test (service or component)

### 4) Docs
- Update `DECISIONS.md` with assumptions, trade-offs, and improvements.
- Keep the timebox. Practical solutions are fine—avoid over-engineering.

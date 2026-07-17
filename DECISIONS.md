# DECISIONS

## Assumptions

- **No authentication** — the API is open; suitable for a local coding test, not production.
- **Meetings are created via the API** (or Django admin). The frontend lists and manages existing meetings but has no create-meeting form.
- **Single-user, local dev** — Docker runs Postgres + backend; Angular dev server proxies `/api` to `http://localhost:8000`.
- **AI is stubbed** — `services/ai.py` is used as-is (~1s sleep, dummy string).
- **Async = in-process thread** — sufficient to simulate pending → ready polling

---

## Choices & trade-offs

### Backend

- **`ModelViewSet` for meetings** — list, retrieve, and create come from DRF defaults with pagination (page size 20). Custom actions cover notes and summary.
- **Single `notes` action (`GET`/`POST`)** — merged the skeleton's separate list/add endpoints onto one URL to keep meeting-related routes together.
- **Separate read/create serializers** — `NoteCreateSerializer` accepts only `author` and `text`; `NoteSerializer` returns the full note. Validation relies on model constraints (e.g. empty `text` → 400).
- **`Count()` annotation on meetings** — `note_count` is included in list/retrieve responses without N+1 queries from the frontend.
- **`latest_summary` on meeting** — nested `SummarySerializer` via the OneToOne `summary` relation so list and detail pages get status in one request.
- **Async summary via daemon thread** — POST `/summarize/` sets status to `pending`, returns 202, and runs `ai.summarize()` in a background thread. On failure, status becomes `failed` and the error is stored in `content`.
- **Simple logging on write paths** — INFO logs for meeting create, note create, and summarize requests; exception logging on summary failure. GET endpoints are not logged to avoid noise.

### Frontend

- **Flat `AppModule` structure** — components, services, and typed models live in separate folders under `src/app/`. No feature modules; keeps the setup simple for a small app. Appropriate for the small scope of the assignment.
- **Typed API models** — `Meeting`, `Note`, `Summary`, and pagination interfaces mirror the backend responses.
- **`MeetingService` for all HTTP calls** — components handle presentation only.
- **Reload after mutations** — after adding a note or completing a summary, the meeting is refetched so `note_count` and summary badge stay in sync. Trades extra requests for simpler, always-correct UI state.
- **Polling with `setInterval`** — after triggering summarize, polls `GET /summary/` every 1s until `ready` or `failed`, then clears the timer in `ngOnDestroy`. The generate button is disabled while pending.
- **Minimal UI** — plain HTML tables/forms, loading/error states, no component library. Focused on meeting the spec within the timebox.

### Tests & CI

- **Backend (3 tests)** — model ordering, add-note happy path, empty-note validation edge case.
- **Frontend (1 test)** — `MeetingService.getMeetings()` HTTP contract via `HttpClientTestingModule`.
- **CI** — GitHub Actions runs backend `pytest` on push/PR. Frontend tests are run locally (`ng test --watch=false`).

---

## Deviations from the spec

| Spec                                            | Implementation                   | Why                                                                                                |
| ----------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| Meeting list "newest first"                     | Queryset orders by `-created_at` | Chose record creation time; model Meta uses `-started_at` — functionally similar for seeded data.  |
| Skeleton had separate `list_notes` / `add_note` | Combined into one `notes` action | Same URL/methods, less duplication.                                                                |
| Full meeting workflow in UI                     | No create-meeting form           | API supports `POST /api/meetings/`; UI focuses on list, detail, notes, and summary per spec scope. |

No other intentional deviations. All required endpoints, models, pagination, health check, async summary flow, and frontend pages are implemented.

---

## Future improvements

Given more time:

- Align meeting list ordering on `started_at` consistently (queryset + model Meta).
- Add a create-meeting form on the frontend.
- Replace setInterval polling with an RxJS interval() pipeline to better align with Angular's reactive programming model.
- Resume polling on page load when a summary is already `pending`.
- Enforce duplicate-summary prevention on the backend (frontend only disables the button).
- Replace the background thread with Celery or similar for production-grade async jobs.
- Expand test coverage (summarize flow, meeting CRUD, component tests).
- Add frontend step to CI; improve UI styling and user feedback (toasts, inline errors).
- Add explicit serializer validation messages instead of relying solely on model defaults.

---

## Time spent

| Area                              |        Time |
| --------------------------------- | ----------: |
| Backend API, models & serializers |  ~1.5 hours |
| Backend tests & logging           | ~30 minutes |
| Frontend (list, detail, polling)  |    ~2 hours |
| Frontend test & polish            | ~45 minutes |
| GitHub Actions & documentation    | ~15 minutes |

**Total:** ~5 hours

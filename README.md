# HireScreen AI

Web app for recruiters to trigger **Bolna** voice-agent screening calls and review **summaries** and transcripts in a dashboard. **No database and no server filesystem** — each browser keeps its own call list in **localStorage**, and the dashboard refreshes by polling Bolna’s execution API (API key stays on the server).

## Features

- **Start a call** — Enter a candidate phone number (E.164, e.g. `+91xxxxxxxxxx`) and invoke Bolna’s outbound call API.
- **Dashboard** — Card list with status, summary preview, expandable transcript; data merged from Bolna every few seconds.
- **Browser persistence** — Call rows (`phone`, `execution_id`) saved under `hirescreen_calls_v1` in **localStorage** (this device only).
- **Optional webhook** — `POST /api/webhook` only **logs** payloads for debugging (does not persist). Dashboard does not depend on it.

## Stack

- [Next.js](https://nextjs.org) App Router (React 19)
- [Tailwind CSS](https://tailwindcss.com) v4
- [Bolna Voice AI API](https://www.bolna.ai/docs)

## Prerequisites

1. **Bolna account** — Create an agent in the [Bolna platform](https://platform.bolna.ai/), configure summarization / extractions as needed.
2. **Agent ID & API key** — Required for `create-call` and for polling execution details.

## Environment variables

Create `.env` in the project root:

```bash
BOLNA_API_KEY=your-api-key
BOLNA_AGENT_ID=your-agent-uuid
```

Never commit `.env` (already ignored).

## Setup

Install dependencies (project uses [Bun](https://bun.sh); npm/pnpm/yarn also work):

```bash
bun install
```

Run the dev server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional: Bolna webhook (logging only)

If you want server logs of Bolna pushes, set in the Bolna agent **Analytics** tab:

```text
https://YOUR_PUBLIC_HOST/api/webhook
```

Use the **full path** `/api/webhook`, not the site root. This route does **not** write to disk or update the UI.

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/create-call` | Body: `{ "phone": "+91xxxxxxxxxx" }`. Calls Bolna `POST https://api.bolna.ai/call`. Client saves `execution_id` to localStorage. |
| `GET` | `/api/bolna-execution?execution_id=…` | Server-side proxy to `GET https://api.bolna.ai/agent/{agent_id}/execution/{execution_id}` with your API key. |
| `POST` | `/api/webhook` | Logs JSON body to stdout; returns `{ received: true }`. |

## Data storage

- **UI:** `localStorage` key `hirescreen_calls_v1` on each browser.
- **Production:** Safe on Vercel — no `mkdir` under `/var/task`.

Clearing site data / another browser / incognito = empty log.

## Scripts

```bash
bun dev      # development server
bun build    # production build
bun start    # run production server
bun lint     # ESLint
```

## Troubleshooting

- **Empty dashboard after deploy** — localStorage is per-browser; start a new call from that browser or pair with the same device you used locally.
- **Summary/transcript missing** — Depends on Bolna execution payload (summarization enabled, call finished). Poll uses the execution GET endpoint.
- **Webhook showed `POST /` in ngrok** — Webhook URL must include `/api/webhook` (optional for this app’s UI).

## Deploy notes

Deploy on Vercel or any Next host. Set `BOLNA_API_KEY` and `BOLNA_AGENT_ID` in the project environment.

## License

Private / as per your repo.

# HireScreen AI

Web app for recruiters to trigger **Bolna** voice-agent screening calls, receive **webhook** payloads after each call, and review **summaries** and transcripts in a dashboard. No database—call data is stored locally in JSON.

## Features

- **Start a call** — Enter a candidate phone number (E.164, e.g. `+91xxxxxxxxxx`) and invoke Bolna’s outbound call API.
- **Webhook ingestion** — `POST /api/webhook` accepts Bolna execution payloads (same shape as their execution API).
- **Dashboard** — Card list with status, summary preview, expandable transcript.
- **Local persistence** — Records live in `data/calls.json` (gitignored).

## Stack

- [Next.js](https://nextjs.org) App Router (React 19)
- [Tailwind CSS](https://tailwindcss.com) v4
- [Bolna Voice AI API](https://www.bolna.ai/docs)

## Prerequisites

1. **Bolna account** — Create an agent in the [Bolna platform](https://platform.bolna.ai/), configure summarization / extractions as needed.
2. **Agent ID & API key** — From Bolna for API calls.
3. **Public webhook URL** — Bolna POSTs to your server. For local development use a tunnel (e.g. [ngrok](https://ngrok.com)).

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

## Bolna webhook URL (important)

In the Bolna agent **Analytics** tab, set **“Push all execution data to webhook”** to your **full** webhook path, not the site root:

```text
https://YOUR_PUBLIC_HOST/api/webhook
```

Examples:

- Local + ngrok: `https://abc123.ngrok-free.app/api/webhook`
- Production: `https://your-domain.com/api/webhook`

If you only set `https://host/` Bolna will POST to `/` and this app’s handler will never run.

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/create-call` | Body: `{ "phone": "+91xxxxxxxxxx" }`. Calls Bolna `POST https://api.bolna.ai/call`, stores a pending row and attaches `execution_id` when returned. |
| `POST` | `/api/webhook` | Bolna pushes execution updates here; logs payload server-side and merges into `data/calls.json`. |
| `GET` | `/api/candidates` | Returns all stored call records (dashboard polls this). |

## Data storage

- **File:** `data/calls.json`
- **Ignored by git:** `/data/calls.json` is in `.gitignore`; `data/.gitkeep` keeps the folder in the repo.

Records align roughly with Bolna execution fields: `id`, `phone`, `execution_id`, `status`, `summary`, `transcript`, optional extraction fields, and `raw_webhook` for debugging.

## Scripts

```bash
bun dev      # development server
bun build    # production build
bun start    # run production server
bun lint     # ESLint
```

## Troubleshooting

- **Webhook shows `POST /` in ngrok but nothing in logs** — Webhook URL must end with `/api/webhook`.
- **Status stuck on “in progress”** — Confirm webhook deliveries and inspect terminal logs (`WEBHOOK RECEIVED` blocks in `app/api/webhook/route.ts`).
- **Duplicate / stale rows** — Old rows created before webhook fixes may lack `execution_id`; clear `data/calls.json` or delete the file and retry.

## Deploy notes

Deploy anywhere Next.js runs (Vercel, Railway, etc.). Set `BOLNA_API_KEY` and `BOLNA_AGENT_ID` in the host’s environment. Point Bolna’s webhook to your production `https://.../api/webhook`.

## License

Private / as per your repo.

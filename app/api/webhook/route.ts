import { NextRequest } from "next/server";

/** Logs payloads only — UI uses localStorage + /api/bolna-execution polling. */
export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch (e) {
    console.error("[webhook] Failed to parse JSON body:", e);
    return Response.json({ received: true });
  }

  console.log("\n========== WEBHOOK RECEIVED ==========");
  console.log(JSON.stringify(payload, null, 2));
  console.log("======================================\n");

  const id =
    (payload.id as string) ||
    (payload.execution_id as string) ||
    (payload.call_id as string);
  console.log(
    `[webhook] execution_id=${id ?? "NOT FOUND"} status=${String(payload.status ?? "—")}`
  );

  return Response.json({ received: true });
}

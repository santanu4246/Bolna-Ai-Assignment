import { NextRequest } from "next/server";
import { upsertByExecutionId } from "@/lib/storage";
import type { CallRecord, CallStatus } from "@/lib/storage";

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

  const execution_id =
    (payload.id as string) ||
    (payload.execution_id as string) ||
    (payload.call_id as string);

  const rawStatus = (payload.status as string) ?? "unknown";

  console.log(`[webhook] execution_id=${execution_id ?? "NOT FOUND"}`);
  console.log(`[webhook] status=${rawStatus}`);

  if (!execution_id) {
    console.warn("[webhook] No execution_id — payload keys:", Object.keys(payload).join(", "));
    return Response.json({ received: true });
  }

  const status = mapStatus(rawStatus);
  const telephony = payload.telephony_data as Record<string, unknown> | undefined;
  const phone = (telephony?.to_number as string) || (payload.to_number as string) || "unknown";
  const transcript = (payload.transcript as string) ?? undefined;
  const summary = (payload.summary as string) ?? undefined;
  const extracted = ((payload.extracted_data as Record<string, string>) ?? {});

  console.log(`[webhook] mapped status: ${status}`);
  console.log(`[webhook] phone: ${phone}`);
  console.log(`[webhook] has transcript: ${!!transcript}`);
  console.log(`[webhook] has summary: ${!!summary}`);
  console.log(`[webhook] extracted_data keys: ${Object.keys(extracted).join(", ") || "none"}`);

  const updates: Partial<CallRecord> = {
    status,
    ...(transcript !== undefined && { transcript }),
    ...(summary !== undefined && { summary }),
    ...(extracted.skills && { skills: extracted.skills }),
    ...(extracted.tech_stack && { tech_stack: extracted.tech_stack }),
    ...(extracted.project_summary && { project_summary: extracted.project_summary }),
    ...((extracted.salary_expectation || extracted.salary) && {
      salary_expectation: extracted.salary_expectation ?? extracted.salary,
    }),
    ...(extracted.availability && { availability: extracted.availability }),
    ...((extracted.candidate_rating || extracted.rating) && {
      candidate_rating: extracted.candidate_rating ?? extracted.rating,
    }),
    raw_webhook: payload,
  };

  const result = upsertByExecutionId(execution_id, phone, updates);
  console.log(`[webhook] saved record id=${result.id} status=${result.status}`);

  return Response.json({ received: true });
}

function mapStatus(raw: string): CallStatus {
  switch (raw) {
    case "completed":
    case "call-disconnected":
      return "completed";
    case "in-progress":
    case "ringing":
    case "initiated":
    case "queued":
    case "rescheduled":
    case "scheduled":
      return "in_progress";
    case "busy":
    case "no-answer":
    case "failed":
    case "error":
    case "canceled":
    case "stopped":
    case "balance-low":
      return "failed";
    default:
      return "pending";
  }
}

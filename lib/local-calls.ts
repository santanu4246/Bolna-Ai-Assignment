/** Browser-only persistence for screening calls (works on Vercel — no server FS). */

export const CALLS_STORAGE_KEY = "hirescreen_calls_v1";

export type UiCallStatus = "pending" | "in_progress" | "completed" | "failed";

export interface StoredCall {
  id: string;
  phone: string;
  execution_id: string;
  created_at: string;
  bolna_status?: string;
  summary?: string;
  transcript?: string;
  poll_error?: string;
}

export function bolnaStatusToUi(raw: string | undefined): UiCallStatus {
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

export function getStoredCalls(): StoredCall[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CALLS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredCall[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setStoredCalls(calls: StoredCall[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(calls));
}

export function appendCall(phone: string, execution_id: string): StoredCall {
  const record: StoredCall = {
    id: crypto.randomUUID(),
    phone,
    execution_id,
    created_at: new Date().toISOString(),
  };
  const next = [record, ...getStoredCalls()];
  setStoredCalls(next);
  return record;
}

export function updateCallByExecutionId(
  execution_id: string,
  patch: Partial<StoredCall>
): void {
  const calls = getStoredCalls();
  const idx = calls.findIndex((c) => c.execution_id === execution_id);
  if (idx === -1) return;
  calls[idx] = { ...calls[idx], ...patch };
  setStoredCalls(calls);
}

export function clearStoredCalls(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CALLS_STORAGE_KEY);
}

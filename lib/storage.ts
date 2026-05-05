import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_FILE = path.join(process.cwd(), "data", "calls.json");

export type CallStatus = "pending" | "in_progress" | "completed" | "failed";

export interface CallRecord {
  id: string;
  phone: string;
  execution_id?: string;
  status: CallStatus;
  summary?: string;
  transcript?: string;
  skills?: string;
  tech_stack?: string;
  project_summary?: string;
  salary_expectation?: string;
  availability?: string;
  candidate_rating?: string;
  raw_webhook?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

function readAll(): CallRecord[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeAll(records: CallRecord[]): void {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2));
}

export function createCall(phone: string): CallRecord {
  const records = readAll();
  const record: CallRecord = {
    id: randomUUID(),
    phone,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  records.unshift(record);
  writeAll(records);
  return record;
}

export function updateByExecutionId(
  execution_id: string,
  updates: Partial<CallRecord>
): CallRecord | null {
  const records = readAll();
  const idx = records.findIndex((r) => r.execution_id === execution_id);
  if (idx === -1) return null;
  records[idx] = {
    ...records[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  writeAll(records);
  return records[idx];
}

export function setExecutionId(
  id: string,
  execution_id: string
): CallRecord | null {
  const records = readAll();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  records[idx] = {
    ...records[idx],
    execution_id,
    status: "in_progress",
    updated_at: new Date().toISOString(),
  };
  writeAll(records);
  return records[idx];
}

export function upsertByExecutionId(
  execution_id: string,
  phone: string,
  updates: Partial<CallRecord>
): CallRecord {
  const records = readAll();
  const idx = records.findIndex((r) => r.execution_id === execution_id);

  if (idx !== -1) {
    records[idx] = {
      ...records[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    writeAll(records);
    return records[idx];
  }

  // Create new record
  const record: CallRecord = {
    id: randomUUID(),
    phone,
    execution_id,
    status: "pending",
    ...updates,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  records.unshift(record);
  writeAll(records);
  return record;
}

export function clearAllCalls(): void {
  writeAll([]);
}

export function getAllCalls(): CallRecord[] {
  return readAll();
}

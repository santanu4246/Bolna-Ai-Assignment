"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { CallRecord } from "@/lib/storage";

const STATUS: Record<string, { dot: string; text: string; bg: string }> = {
  pending:     { dot: "bg-zinc-500",                    text: "text-zinc-500",   bg: "bg-zinc-500/10 border-zinc-500/20" },
  in_progress: { dot: "bg-blue-400 animate-pulse",      text: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
  completed:   { dot: "bg-emerald-400",                 text: "text-emerald-400",bg: "bg-emerald-500/10 border-emerald-500/20" },
  failed:      { dot: "bg-red-400",                     text: "text-red-400",    bg: "bg-red-500/10 border-red-500/20" },
};

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.29 6.29l1.65-1.65a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

export default function Dashboard() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchCalls = useCallback(async () => {
    try {
      const res = await fetch("/api/candidates");
      const data = await res.json();
      setCalls(data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchCalls();
    const id = setInterval(fetchCalls, 5000);
    return () => clearInterval(id);
  }, [fetchCalls]);

  const completed = calls.filter(c => c.status === "completed").length;
  const inProgress = calls.filter(c => c.status === "in_progress").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.29 6.29l1.65-1.65a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <span className="font-semibold tracking-tight">HireScreen AI</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-violet-900/30"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Call
        </Link>
      </nav>

      <main className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Screening Log</h1>
          <p className="text-zinc-500 text-sm">
            {calls.length} total · {completed} completed
            {inProgress > 0 && (
              <span className="ml-2 text-blue-400 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {inProgress} in progress
              </span>
            )}
          </p>
        </div>

        {/* Stats row */}
        {calls.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Calls",  value: calls.length,  color: "text-zinc-100" },
              { label: "Completed",    value: completed,      color: "text-emerald-400" },
              { label: "In Progress",  value: inProgress,     color: "text-blue-400" },
            ].map(s => (
              <div key={s.label} className="bg-zinc-900/60 border border-white/5 rounded-xl p-4">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="py-24 text-center text-zinc-700 text-sm">Loading…</div>
        ) : calls.length === 0 ? (
          <div className="border border-dashed border-white/8 rounded-2xl flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/8 flex items-center justify-center mb-4 text-zinc-700">
              <PhoneIcon />
            </div>
            <p className="text-zinc-500 text-sm mb-4">No screening calls yet</p>
            <Link href="/" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              Start the first screening →
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {calls.map((call) => {
              const s = STATUS[call.status] ?? STATUS.pending;
              const isOpen = expanded === call.id;
              return (
                <div key={call.id} className="bg-zinc-900/60 border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10">
                  <button
                    onClick={() => setExpanded(isOpen ? null : call.id)}
                    className="w-full text-left px-5 py-4 flex items-center gap-4"
                  >
                    {/* Status dot */}
                    <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />

                    {/* Phone */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-zinc-500"><PhoneIcon /></span>
                        <span className="font-mono text-sm font-medium text-zinc-200">{call.phone}</span>
                      </div>
                      {call.summary ? (
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-1">{call.summary}</p>
                      ) : (
                        <p className="text-xs text-zinc-700 italic">
                          {call.status === "completed" ? "No summary" : call.status === "in_progress" ? "Call in progress…" : "Waiting to connect"}
                        </p>
                      )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.bg} ${s.text}`}>
                        {call.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-zinc-700">
                        {new Date(call.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-zinc-700"><ChevronIcon open={isOpen} /></span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/5 px-5 py-5 space-y-5">
                      {call.summary && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">Summary</p>
                          <p className="text-sm text-zinc-300 leading-relaxed">{call.summary}</p>
                        </div>
                      )}

                      {call.transcript && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">Transcript</p>
                          <div className="bg-zinc-950 rounded-xl border border-white/5 p-4 max-h-60 overflow-auto">
                            <pre className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono">
                              {call.transcript}
                            </pre>
                          </div>
                        </div>
                      )}

                      {!call.summary && !call.transcript && (
                        <p className="text-sm text-zinc-700 italic">No data received yet from webhook.</p>
                      )}

                      {call.execution_id && (
                        <p className="text-xs text-zinc-800 font-mono pt-1 border-t border-white/5">
                          {call.execution_id}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

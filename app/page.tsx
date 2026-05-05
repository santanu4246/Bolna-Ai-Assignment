"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    execution_id?: string;
    error?: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/create-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) setPhone("");
    } catch {
      setResult({ error: "Network error" });
    } finally {
      setLoading(false);
    }
  }

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
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          Dashboard
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 bg-violet-400/10 border border-violet-400/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              AI-Powered Screening
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-center mb-3 bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-tight">
            Screen candidates<br />with a single call
          </h1>
          <p className="text-zinc-500 text-sm text-center leading-relaxed mb-10">
            Enter a phone number. The AI calls the candidate, asks screening questions, and logs everything automatically.
          </p>

          {/* Card */}
          <div className="bg-zinc-900/60 backdrop-blur border border-white/8 rounded-2xl p-6 shadow-2xl shadow-black/50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-zinc-400 mb-2">
                  Candidate Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.29 6.29l1.65-1.65a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 xxx xxx xxxx"
                    required
                    disabled={loading}
                    className="w-full bg-zinc-800/80 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/40 disabled:opacity-50 transition-all"
                  />
                </div>
                <p className="mt-1.5 text-xs text-zinc-700">Include country code — e.g. +91 for India</p>
              </div>

              <button
                type="submit"
                disabled={loading || !phone}
                className="w-full relative bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all shadow-lg shadow-violet-900/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Initiating call…
                  </>
                ) : (
                  <>
                    Start Screening Call
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {result && (
              <div className={`mt-4 rounded-xl p-4 text-sm border ${
                result.success
                  ? "bg-emerald-500/8 border-emerald-500/20 text-emerald-300"
                  : "bg-red-500/8 border-red-500/20 text-red-300"
              }`}>
                {result.success ? (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Call queued successfully</p>
                      <p className="text-xs opacity-60 mt-0.5">
                        The AI agent will call the candidate shortly.{" "}
                        <Link href="/dashboard" className="underline underline-offset-2 hover:opacity-80">
                          Track in dashboard →
                        </Link>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {result.error ?? "Something went wrong"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <p className="text-center text-xs text-zinc-700 mt-6">
            Results appear in the{" "}
            <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2">
              dashboard
            </Link>{" "}
            after the call ends
          </p>
        </div>
      </main>
    </div>
  );
}

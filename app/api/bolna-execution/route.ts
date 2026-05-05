import { NextRequest } from "next/server";

/** Proxies Bolna execution fetch — keeps API key server-side (works on Vercel). */
export async function GET(request: NextRequest) {
  const execution_id = request.nextUrl.searchParams.get("execution_id");
  const agentId = process.env.BOLNA_AGENT_ID;
  const apiKey = process.env.BOLNA_API_KEY;

  if (!execution_id) {
    return Response.json({ error: "execution_id required" }, { status: 400 });
  }

  if (!agentId || agentId === "your-agent-id-here" || !apiKey) {
    return Response.json(
      { error: "Bolna env vars not configured" },
      { status: 500 }
    );
  }

  const url = `https://api.bolna.ai/agent/${agentId}/execution/${execution_id}`;
  const bolnaRes = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  const data = await bolnaRes.json().catch(() => ({}));
  return Response.json(data, { status: bolnaRes.status });
}

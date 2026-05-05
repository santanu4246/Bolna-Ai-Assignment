import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const agentId = process.env.BOLNA_AGENT_ID;
  const apiKey = process.env.BOLNA_API_KEY;

  if (!agentId || agentId === "your-agent-id-here") {
    return Response.json(
      { error: "BOLNA_AGENT_ID is not configured in .env" },
      { status: 500 }
    );
  }

  if (!apiKey) {
    return Response.json(
      { error: "BOLNA_API_KEY is not configured in .env" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { phone } = body as { phone: string };

  if (!phone) {
    return Response.json({ error: "phone is required" }, { status: 400 });
  }

  const bolnaRes = await fetch("https://api.bolna.ai/call", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      agent_id: agentId,
      recipient_phone_number: phone,
    }),
  });

  const bolnaData = (await bolnaRes.json()) as {
    execution_id?: string;
    message?: string;
    status?: string;
    detail?: string;
  };

  console.log("[create-call] Bolna response:", bolnaData);

  if (!bolnaRes.ok) {
    return Response.json(
      { error: bolnaData.detail ?? "Bolna API error", bolnaData },
      { status: bolnaRes.status }
    );
  }

  return Response.json({
    success: true,
    execution_id: bolnaData.execution_id,
    status: bolnaData.status,
  });
}

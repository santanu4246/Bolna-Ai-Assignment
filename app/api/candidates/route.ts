import { getAllCalls } from "@/lib/storage";

export async function GET() {
  const calls = getAllCalls();
  return Response.json(calls);
}

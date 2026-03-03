import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const requestId = (body?.requestId ?? "").toString();
  const code = (body?.code ?? "").toString();

  if (!requestId || !code) {
    return NextResponse.json({ ok: false, message: "requestId/code required" }, { status: 400 });
  }

  const result = db.verifyOtp(requestId, code);

  if (!result.ok) {
    const status = result.reason === "EXPIRED" ? 410 : 401;
    return NextResponse.json({ ok: false, reason: result.reason }, { status });
  }

  return NextResponse.json({ ok: true });
}
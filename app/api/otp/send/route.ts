import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const phone = (body?.phone ?? "").toString().trim();

  if (!phone) {
    return NextResponse.json({ ok: false, message: "phone required" }, { status: 400 });
  }

  const rec = db.createOtp(phone);

  // 데모 편의: 콘솔에 OTP 찍기 (실서비스면 절대 금지)
  console.log(`[DEMO OTP] phone=${phone} code=${rec.code} requestId=${rec.requestId}`);

  return NextResponse.json({
    ok: true,
    requestId: rec.requestId,
    expiresInSec: 180,
    // 데모 UX: 화면에 표시할 수 있게 힌트로 내려줌 (원하면 나중에 제거)
    demoCode: rec.code,
  });
}
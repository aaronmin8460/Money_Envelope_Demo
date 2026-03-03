import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  const token = params.token;
  const rec = db.getTransfer(token);

  if (!rec) {
    return NextResponse.json({ ok: false, reason: "NOT_FOUND" }, { status: 404 });
  }
  if (rec.expired) {
    return NextResponse.json({ ok: false, reason: "EXPIRED", expiresAt: rec.expiresAt }, { status: 410 });
  }

  return NextResponse.json({
    ok: true,
    data: {
      token: rec.token,
      recipientPhone: rec.recipientPhone,
      amount: rec.amount,
      message: rec.message,
      expiresAt: rec.expiresAt,
      createdAt: rec.createdAt,
    },
  });
}
import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const recipientPhone = (body?.recipientPhone ?? "").toString().trim();
  const amount = Number(body?.amount ?? 0);
  const message = (body?.message ?? "").toString();

  if (!recipientPhone) {
    return NextResponse.json({ ok: false, message: "recipientPhone required" }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ ok: false, message: "invalid amount" }, { status: 400 });
  }

  const rec = db.createTransfer({ recipientPhone, amount, message });
    console.log("created token", rec.token, db._debugSize());
  return NextResponse.json({
    ok: true,
    token: rec.token,
    expiresAt: rec.expiresAt,
  });
}
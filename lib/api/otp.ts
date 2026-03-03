import { http } from "@/lib/http";

export type SendOtpReq = { phone: string };
export type SendOtpRes = { ok: true; requestId: string; expiresInSec: number };

export async function sendOtp(payload: SendOtpReq) {
  const { data } = await http.post<SendOtpRes>("/api/otp/send", payload);
  return data;
}
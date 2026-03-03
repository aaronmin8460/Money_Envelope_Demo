import { addDays } from "date-fns";

export type OtpRequest = {
  requestId: string;
  phone: string;
  code: string;
  expiresAt: number;
  verified: boolean;
};

export type TransferRecord = {
  token: string;
  recipientPhone: string;
  amount: number;
  message: string;
  createdAt: number;
  expiresAt: number;
};

type DemoStore = {
  otpRequests: Map<string, OtpRequest>;
  transfers: Map<string, TransferRecord>;
};

// ✅ Turbopack/dev 리로드에도 유지되는 글로벌 스토어
const g = globalThis as unknown as { __demoStore?: DemoStore };

const store: DemoStore =
  g.__demoStore ??
  (g.__demoStore = {
    otpRequests: new Map<string, OtpRequest>(),
    transfers: new Map<string, TransferRecord>(),
  });

function randDigits(n: number) {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function randToken() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const db = {
  createOtp(phone: string) {
    const requestId = randToken();
    const code = randDigits(6);
    const expiresAt = Date.now() + 3 * 60 * 1000;
    const rec: OtpRequest = { requestId, phone, code, expiresAt, verified: false };
    store.otpRequests.set(requestId, rec);
    return rec;
  },

  verifyOtp(requestId: string, code: string) {
    const rec = store.otpRequests.get(requestId);
    if (!rec) return { ok: false as const, reason: "NOT_FOUND" as const };
    if (Date.now() > rec.expiresAt) return { ok: false as const, reason: "EXPIRED" as const };
    if (rec.code !== code) return { ok: false as const, reason: "INVALID" as const };
    rec.verified = true;
    store.otpRequests.set(requestId, rec);
    return { ok: true as const };
  },

  isOtpVerified(requestId: string) {
    const rec = store.otpRequests.get(requestId);
    return !!rec?.verified && Date.now() <= rec.expiresAt;
  },

  createTransfer(input: { recipientPhone: string; amount: number; message: string }) {
    const token = randToken();
    const createdAt = Date.now();
    const expiresAt = addDays(createdAt, 7).getTime();
    const rec: TransferRecord = { token, createdAt, expiresAt, ...input };
    store.transfers.set(token, rec);
    return rec;
  },

  getTransfer(token: string) {
    const rec = store.transfers.get(token);
    if (!rec) return null;
    if (Date.now() > rec.expiresAt) return { ...rec, expired: true as const };
    return { ...rec, expired: false as const };
  },

  // 디버그용 (원하면 삭제)
  _debugSize() {
    return { transfers: store.transfers.size, otps: store.otpRequests.size };
  },
};
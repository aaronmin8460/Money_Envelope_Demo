"use client";

import { AppShell } from "@/components/common/AppShell";
import { TopBar } from "@/components/common/TopBar";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTransferStore } from "@/lib/store/transfer.store";
import { useMutation } from "@tanstack/react-query";
import { http } from "@/lib/http";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type VerifyRes = { ok: true } | { ok: false; reason?: string };
type CreateTransferRes = { ok: true; token: string; expiresAt: number };

export default function OtpPage() {
  const router = useRouter();
  const { recipientPhone, amount, message, requestId, reset } = useTransferStore();

  const [code, setCode] = useState("");
  const [left, setLeft] = useState(180);

  // store가 비어있으면 /send로
  useEffect(() => {
    if (!requestId || !recipientPhone || !amount) {
      router.replace("/send");
    }
  }, [requestId, recipientPhone, amount, router]);

  // 타이머
  useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mmss = useMemo(() => {
    const m = Math.floor(left / 60);
    const s = left % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [left]);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const { data } = await http.post<VerifyRes>("/api/otp/verify", {
        requestId,
        code,
      });
      return data;
    },
  });

  const createTransferMutation = useMutation({
    mutationFn: async () => {
      const { data } = await http.post<CreateTransferRes>("/api/transfer/create", {
        requestId,
        recipientPhone,
        amount,
        message,
      });
      return data;
    },
  });

  const onVerify = async () => {
    if (!requestId) return;
    if (!/^\d{6}$/.test(code)) {
      toast.error("6자리 숫자를 입력해줘");
      return;
    }
    if (left === 0) {
      toast.error("인증 시간이 만료됐어. 다시 전송해줘.");
      router.replace("/send");
      return;
    }

    try {
      const vr = await verifyMutation.mutateAsync();
      if (!vr.ok) {
        toast.error(vr.reason === "EXPIRED" ? "인증 만료" : "인증번호가 틀림");
        return;
      }

      toast.success("인증 완료");

      const tr = await createTransferMutation.mutateAsync();
      toast.success("링크 생성 완료");

      // 완성 페이지로 이동
      router.replace(`/send/complete?token=${encodeURIComponent(tr.token)}`);
    } catch {
      toast.error("처리 실패");
    }
  };

  return (
    <AppShell>
      <TopBar title="인증번호 입력" />
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-neutral-900">송금자 인증</div>
            <div className="text-xs text-neutral-500">
              {recipientPhone} 로 링크를 보낼 준비 중 · 남은시간 {mmss}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="6자리 인증번호"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
            <Button
              className="w-full"
              onClick={onVerify}
              disabled={verifyMutation.isPending || createTransferMutation.isPending}
            >
              {verifyMutation.isPending || createTransferMutation.isPending
                ? "처리 중..."
                : "인증하고 링크 만들기"}
            </Button>

            <Button
              className="w-full"
              variant="secondary"
              onClick={() => {
                reset();
                router.replace("/send");
              }}
            >
              처음부터 다시
            </Button>

            <p className="text-xs text-neutral-500">
              데모라서 서버 콘솔에도 OTP가 찍혀. (실서비스면 보안팀이 널 찾으러 온다)
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
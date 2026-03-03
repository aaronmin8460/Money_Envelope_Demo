"use client";

import { AppShell } from "@/components/common/AppShell";
import { TopBar } from "@/components/common/TopBar";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";

type LinkRes =
  | {
      ok: true;
      data: {
        token: string;
        recipientPhone: string;
        amount: number;
        message: string;
        expiresAt: number;
        createdAt: number;
      };
    }
  | { ok: false; reason: "NOT_FOUND" | "EXPIRED"; expiresAt?: number };

export default function ReceiveClient({ token }: { token: string }) {
  const router = useRouter();

  const q = useQuery({
    queryKey: ["link", token],
    retry: false,
    queryFn: async () => {
      try {
        const { data } = await http.get<LinkRes>(`/api/link/${token}`);
        return data;
      } catch (e) {
        // axios는 404/410이면 throw 함 → 응답 바디를 꺼내서 반환(=ok:false 처리)
        if (axios.isAxiosError(e) && e.response?.data) {
          return e.response.data as LinkRes;
        }
        throw e;
      }
    },
  });

  // 렌더 중 router.replace 금지 → effect에서 처리
  useEffect(() => {
    if (q.data && !q.data.ok) router.replace("/expired");
  }, [q.data, router]);

  if (q.isLoading) {
    return (
      <AppShell>
        <TopBar title="받기" back={false} />
        <p className="text-sm text-neutral-600">불러오는 중...</p>
      </AppShell>
    );
  }

  if (q.isError) {
    return (
      <AppShell>
        <TopBar title="받기" back={false} />
        <p className="text-sm text-neutral-600">에러 발생. 다시 시도해줘.</p>
        <Button className="mt-3 w-full" onClick={() => q.refetch()}>
          다시 불러오기
        </Button>
      </AppShell>
    );
  }

  // ok:false면 effect가 /expired로 보냄 (여기서는 화면 깜빡임 방지)
  if (!q.data || !q.data.ok) return null;

  const { amount, message, expiresAt } = q.data.data;

  return (
    <AppShell>
      <TopBar title="돈 받기" back={false} />
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-neutral-900">송금 링크</div>
            <div className="text-xs text-neutral-500">
              만료일: {format(new Date(expiresAt), "yyyy-MM-dd HH:mm")}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-neutral-900">
              {amount.toLocaleString()}원
            </div>

            {message ? (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-800">
                {message}
              </div>
            ) : (
              <div className="text-sm text-neutral-500">메시지 없음</div>
            )}

            <Button
              className="w-full"
              onClick={() => toast.success("데모: 내 계좌로 받기")}
            >
              내 계좌로 받기
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
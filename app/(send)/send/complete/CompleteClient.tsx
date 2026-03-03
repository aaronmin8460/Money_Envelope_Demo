"use client";

import { AppShell } from "@/components/common/AppShell";
import { TopBar } from "@/components/common/TopBar";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useTransferStore } from "@/lib/store/transfer.store";

export default function CompleteClient() {
  const sp = useSearchParams();
  const token = sp.get("token");
  const reset = useTransferStore((s) => s.reset);

  const link =
    token && typeof window !== "undefined"
      ? `${window.location.origin}/r/${token}`
      : token
      ? `/r/${token}`
      : "";

  if (!token) {
    return (
      <AppShell>
        <TopBar title="완료" />
        <p className="text-sm text-neutral-700">토큰이 없어. /send부터 다시.</p>
        <Link href="/send">
          <Button className="mt-3">송금 다시 시작</Button>
        </Link>
      </AppShell>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("링크 복사됨");
    } catch {
      toast.error("복사 실패");
    }
  };

  return (
    <AppShell>
      <TopBar title="링크 생성 완료" back={false} />
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-neutral-900">받는 사람에게 링크 전송</div>
            <div className="text-xs text-neutral-500">링크는 7일 뒤 만료</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs break-all">
              {link}
            </div>
            <Button className="w-full" onClick={copy}>
              링크 복사
            </Button>
            <Link href={`/r/${token}`}>
              <Button className="w-full" variant="secondary">
                링크 열어보기(수취인 화면)
              </Button>
            </Link>
            <Button
              className="w-full"
              variant="ghost"
              onClick={() => {
                reset();
                toast.success("초기화 완료");
              }}
            >
              새 송금 만들기용 초기화
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
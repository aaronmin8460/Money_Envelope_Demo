import Link from "next/link";
import { AppShell } from "@/components/common/AppShell";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ExpiredPage() {
  return (
    <AppShell>
      <div className="pt-6">
        <Card>
          <CardHeader>
            <div className="text-lg font-bold text-neutral-900">링크가 만료됐어</div>
            <div className="text-sm text-neutral-500">
              7일이 지나거나, 존재하지 않는 링크야.
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/">
              <Button className="w-full">홈으로</Button>
            </Link>
            <Link href="/send">
              <Button className="w-full" variant="secondary">
                새 송금 만들기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
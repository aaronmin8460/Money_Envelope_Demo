import Link from "next/link";
import { AppShell } from "@/components/common/AppShell";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <AppShell>
      <div className="pt-6">
        <Card>
          <CardHeader>
            <div className="text-lg font-bold text-neutral-900">송금 데모</div>
            <div className="text-sm text-neutral-500">
              송금자가 인증하고 링크 발송 · 7일 만료
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-neutral-700">
              버튼 누르면 송금 플로우 시작.
            </div>
            <Link href="/send">
              <Button className="w-full">송금 시작</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
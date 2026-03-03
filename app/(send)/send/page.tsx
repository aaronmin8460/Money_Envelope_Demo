"use client";

import { AppShell } from "@/components/common/AppShell";
import { TopBar } from "@/components/common/TopBar";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transferDraftSchema, type TransferDraft, type TransferDraftInput } from "@/lib/validators/transfer";
import { useMutation } from "@tanstack/react-query";
import { http } from "@/lib/http";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTransferStore } from "@/lib/store/transfer.store";

type CreateTransferRes = { ok: true; token: string; expiresAt: number };

export default function SendPage() {
  const router = useRouter();
  const setDraft = useTransferStore((s) => s.setDraft);

  const form = useForm<TransferDraftInput, any, TransferDraft>({
    resolver: zodResolver(transferDraftSchema),
    defaultValues: { recipientPhone: "", amount: 1000, message: "" },
    mode: "onChange",
  });

  const createTransferMutation = useMutation({
    mutationFn: async (payload: TransferDraft) => {
      const { data } = await http.post<CreateTransferRes>("/api/transfer/create", payload);
      return data;
    },
    onSuccess: (data) => {
      toast.success("링크 생성 완료");
      router.push(`/send/complete?token=${encodeURIComponent(data.token)}`);
    },
    onError: () => toast.error("링크 생성 실패"),
  });

  const onSubmit = (values: TransferDraft) => {
    setDraft(values);
    createTransferMutation.mutate(values);
  };

  const amount = form.watch("amount");

  return (
    <AppShell>
      <TopBar title="돈봉투 선물하기" />
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-neutral-900">받는 사람</div>
            <div className="text-xs text-neutral-500">전화번호로 링크를 보낼 거에요</div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              placeholder="전화번호 (예: 01012345678)"
              inputMode="tel"
              {...form.register("recipientPhone")}
            />
            {form.formState.errors.recipientPhone ? (
              <p className="text-xs text-red-500">
                {form.formState.errors.recipientPhone.message}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-neutral-900">금액</div>
            <div className="text-xs text-neutral-500">최소 1,000원</div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              placeholder="금액"
              inputMode="numeric"
              value={amount ? String(amount) : ""}
              onChange={(e) =>
                form.setValue("amount", Number(e.target.value || 0), { shouldValidate: true })
              }
            />
            {form.formState.errors.amount ? (
              <p className="text-xs text-red-500">{form.formState.errors.amount.message}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-neutral-900">메시지 (선택)</div>
            <div className="text-xs text-neutral-500">40자까지</div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder="예: 생일축하해~~" {...form.register("message")} />
            {form.formState.errors.message ? (
              <p className="text-xs text-red-500">{form.formState.errors.message.message}</p>
            ) : null}
          </CardContent>
        </Card>

        <Button
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
          disabled={!form.formState.isValid || createTransferMutation.isPending}
        >
          {createTransferMutation.isPending ? "생성 중..." : "링크 만들기"}
        </Button>

        <p className="text-center text-xs text-neutral-500">
          링크는 생성 후 7일 뒤 만료됩니다.
        </p>
      </div>
    </AppShell>
  );
}
import { z } from "zod";

export const transferDraftSchema = z.object({
  recipientPhone: z
    .string()
    .min(10, "전화번호를 입력해줘")
    .max(15, "전화번호가 너무 길어")
    .regex(/^[0-9+ -]+$/, "숫자 위주로 입력해줘"),
  amount: z
    .number({ invalid_type_error: "금액이 필요해" })
    .int("정수만 가능")
    .min(1000, "최소 1,000원")
    .max(10_000_000, "데모는 최대 1천만원"),
  message: z.string().max(40, "메시지는 40자까지").optional().default(""),
});

export type TransferDraft = z.infer<typeof transferDraftSchema>;
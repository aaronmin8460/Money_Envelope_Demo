import { z } from "zod";

export const transferDraftSchema = z.object({
  recipientPhone: z
    .string()
    .min(10, "전화번호를 입력해줘")
    .max(15, "전화번호가 너무 길어")
    .regex(/^[0-9+ -]+$/, "숫자 위주로 입력해줘"),
  amount: z
    .coerce.number() // ⭐ 폼 입력 string 안전하게 처리
    .int("정수만 가능")
    .min(1000, "최소 1,000원")
    .max(10_000_000, "데모는 최대 1천만원"),
  message: z.string().max(40, "메시지는 40자까지").default(""),
});

// ✅ input/output 타입을 분리
export type TransferDraftInput = z.input<typeof transferDraftSchema>;   // message?: string
export type TransferDraft = z.output<typeof transferDraftSchema>;       // message: string
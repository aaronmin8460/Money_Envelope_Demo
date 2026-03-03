import { z } from "zod";

export const otpVerifySchema = z.object({
  requestId: z.string().min(1),
  code: z.string().regex(/^\d{6}$/, "6자리 숫자"),
});

export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
import { useMutation } from "@tanstack/react-query";
import { sendOtp } from "@/lib/api/otp";

export function useSendOtp() {
  return useMutation({
    mutationFn: sendOtp,
  });
}
import { create } from "zustand";

type TransferState = {
  recipientPhone: string;
  amount: number;
  message: string;

  requestId: string | null;

  setDraft: (draft: { recipientPhone: string; amount: number; message: string }) => void;
  setRequestId: (id: string | null) => void;
  reset: () => void;
};

export const useTransferStore = create<TransferState>((set) => ({
  recipientPhone: "",
  amount: 0,
  message: "",

  requestId: null,

  setDraft: (draft) =>
    set({
      recipientPhone: draft.recipientPhone,
      amount: draft.amount,
      message: draft.message,
    }),
  setRequestId: (id) => set({ requestId: id }),
  reset: () =>
    set({
      recipientPhone: "",
      amount: 0,
      message: "",
      requestId: null,
    }),
}));
import { Suspense } from "react";
import CompleteClient from "./CompleteClient";

function Fallback() {
  return (
    <div className="min-h-dvh bg-neutral-50">
      <div className="mx-auto w-full max-w-md px-4 pb-10 pt-6">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">불러오는 중...</div>
          <div className="mt-2 text-xs text-neutral-500">링크 정보를 준비하고 있어요</div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Fallback />}>
      <CompleteClient />
    </Suspense>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopBar({
  title,
  back = true,
  right,
  className,
}: {
  title?: string;
  back?: boolean;
  right?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  return (
    <div className={cn("sticky top-0 z-10 bg-neutral-50/80 backdrop-blur", className)}>
      <div className="flex items-center gap-3 py-4">
        <div className="w-10">
          {back ? (
            <button
              onClick={() => router.back()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-neutral-100"
              aria-label="back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : null}
        </div>
        <div className="flex-1 text-center text-sm font-semibold text-neutral-900">
          {title ?? ""}
        </div>
        <div className="w-10 flex justify-end">{right ?? null}</div>
      </div>
    </div>
  );
}
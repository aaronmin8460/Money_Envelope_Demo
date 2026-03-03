import { cn } from "@/lib/utils";

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-dvh bg-neutral-50">
      <div className={cn("mx-auto w-full max-w-md px-4 pb-10", className)}>
        {children}
      </div>
    </div>
  );
}
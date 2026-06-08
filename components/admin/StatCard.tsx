import { cn } from "@/lib/cn";

export default function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-white p-6 shadow-sm",
        className,
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl text-ink">{value}</p>
      {hint ? <p className="mt-2 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}

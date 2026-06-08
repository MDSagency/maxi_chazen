export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center">
      <p className="font-display text-2xl text-ink">{title}</p>
      {description ? (
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">{description}</p>
      ) : null}
    </div>
  );
}

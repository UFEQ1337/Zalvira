export function FeaturedGamesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse h-60"
          />
        ))}
    </div>
  );
}

export function GameGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse h-40"
          />
        ))}
    </div>
  );
}

export function RecommendationsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse h-48"
          />
        ))}
    </div>
  );
}

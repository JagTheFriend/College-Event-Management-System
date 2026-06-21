export function EventCardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="skeleton h-40 w-full rounded-xl" />
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
    </div>
  );
}

export function EventListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="skeleton h-64 w-full rounded-2xl" />
      <div className="skeleton h-8 w-2/3" />
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
      <div className="skeleton h-4 w-3/4" />
    </div>
  );
}

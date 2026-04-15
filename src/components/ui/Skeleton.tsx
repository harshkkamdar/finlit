interface SkeletonBaseProps {
  className?: string;
}

export function SkeletonText({
  lines = 3,
  className = "",
}: SkeletonBaseProps & { lines?: number }) {
  const widths = ["w-full", "w-4/5", "w-3/5", "w-11/12", "w-2/3"];

  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`h-3.5 rounded skeleton ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: SkeletonBaseProps) {
  return (
    <div
      className={`bg-surface rounded-xl p-6 shadow-sm ${className}`}
    >
      {/* Header area */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded skeleton w-1/3" />
          <div className="h-3 rounded skeleton w-1/2" />
        </div>
      </div>

      {/* Content lines */}
      <SkeletonText lines={3} />

      {/* Action area */}
      <div className="mt-5 flex gap-3">
        <div className="h-9 rounded-lg skeleton w-24" />
        <div className="h-9 rounded-lg skeleton w-20" />
      </div>
    </div>
  );
}

export function SkeletonCircle({
  size = 48,
  className = "",
}: SkeletonBaseProps & { size?: number }) {
  return (
    <div
      className={`rounded-full skeleton ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonPage({ className = "" }: SkeletonBaseProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div className="space-y-2">
          <div className="h-8 rounded skeleton w-64" />
          <div className="h-4 rounded skeleton w-48" />
        </div>
        <div className="h-14 rounded-xl skeleton w-52" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-xl p-5 shadow-sm">
            <div className="h-3 rounded skeleton w-20 mb-3" />
            <div className="h-7 rounded skeleton w-16" />
          </div>
        ))}
      </div>

      {/* Chapter cards */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

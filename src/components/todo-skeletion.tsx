export function TodoSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto space-y-4 max-h-[100vh] overflow-hidden">
      <div className="space-y-3">
        {/* Individual todo item skeletons */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            {/* Checkbox skeleton */}
            <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
            {/* Todo text skeleton */}
            <div className="flex-1">
              <div
                className={`h-4 bg-muted rounded animate-pulse ${
                  i % 2 === 0 ? "w-3/4" : "w-5/6"
                }`}
              ></div>
            </div>
            {/* Action buttons skeleton */}
            <div className="flex gap-3">
              <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
              <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

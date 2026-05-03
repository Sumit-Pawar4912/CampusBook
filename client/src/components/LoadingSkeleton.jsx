const LoadingSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {[1, 2, 3].map(item => (
      <div key={item} className="rounded-3xl bg-white p-6 shadow">
        <div className="h-48 w-full animate-pulse rounded-3xl bg-slate-200" />
        <div className="mt-6 space-y-3">
          <div className="h-6 w-3/4 animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;

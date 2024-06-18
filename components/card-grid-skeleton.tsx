import { Skeleton } from "@/components/ui/skeleton";

export function CardGridSkeleton() {
  return (
    <>
      {new Array(16).fill("").map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}
export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[450px] min-w-48 rounded-xl" />
    </div>
  );
}

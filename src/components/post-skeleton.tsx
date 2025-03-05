import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton() {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100/50 pb-8 last:border-none">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-5/6 mt-2" />

      <footer className="flex justify-between items-center mt-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </footer>
    </div>
  );
}

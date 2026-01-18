import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const PlantDetailsSkeleton = () => {
  return (
    <div className="container py-8 max-w-4xl animate-fade-in">
      {/* Back button skeleton */}
      <Skeleton className="h-10 w-24 mb-6 rounded-md" />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image skeleton */}
        <Skeleton className="aspect-square rounded-2xl" />

        {/* Info skeleton */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <Skeleton className="h-9 w-48 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>

          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

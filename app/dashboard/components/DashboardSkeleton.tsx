import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardSkeletonProps {
  type: "header" | "activity" | "ai" | "analytics" | "content" | "network" | "growth" | "onboarding" | "community" | "performance"
}

export function DashboardSkeleton({ type }: DashboardSkeletonProps) {
  switch (type) {
    case "header":
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      )
    
    case "activity":
      return (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[120px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </Card>
      )
    
    case "ai":
      return (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-8 w-[120px]" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-5 w-[60px]" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </Card>
      )
    
    case "analytics":
      return (
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="h-3 w-[100px]" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-3 w-[60px]" />
              </div>
            </Card>
          ))}
        </div>
      )
    
    case "content":
      return (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[140px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-3 w-[60%]" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-[100px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
          ))}
        </Card>
      )
    
    case "network":
      return (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[130px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </Card>
      )
    
    case "growth":
      return (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[160px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-2 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-[100px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </Card>
      )
    
    case "onboarding":
      return (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[180px]" />
            <Skeleton className="h-8 w-[120px]" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
                <Skeleton className="h-3 w-[90%]" />
                <Skeleton className="h-8 w-full" />
              </Card>
            ))}
          </div>
        </Card>
      )
    
    case "community":
      return (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[140px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[120px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
              </div>
            ))}
          </div>
        </Card>
      )
    
    case "performance":
      return (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[160px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-full" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-4" />
                  <Skeleton className="h-3 w-[60px]" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )
    
    default:
      return null
  }
} 
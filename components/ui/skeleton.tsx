import * as React from "react"
import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils"

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
  size?: "sm" | "lg";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "animate-pulse rounded-md bg-secondary",
        variant === "destructive" && "bg-destructive",
        size === "sm" && "h-2 w-12",
        size === "lg" && "h-4 w-32",
        className
      )}
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";

export { Skeleton };

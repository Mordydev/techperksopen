"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

interface Metric {
  label: string
  value: string
  change: number
  icon: React.ReactNode
}

export function PerformanceTeaser() {
  // TODO: Replace with actual data fetching
  const metrics: Metric[] = [
    {
      label: "LinkedIn Visibility",
      value: "+12%",
      change: 12,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      label: "Network Growth",
      value: "+24",
      change: 24,
      icon: <Users className="h-4 w-4" />,
    },
  ]

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Performance Overview</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/successinsights">
            View Details
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-semibold">{metric.value}</p>
              </div>
              <div
                className={`rounded-full p-2.5 ${
                  metric.change > 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {metric.icon}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/successinsights">View Detailed Insights</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 
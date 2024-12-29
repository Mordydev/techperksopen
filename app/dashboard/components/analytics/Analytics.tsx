"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Calendar,
  Network,
  TrendingUp,
  TrendingDown,
  ChartLine,
  Sparkles,
  Users,
  MessageSquare,
  Eye
} from "lucide-react"
import Link from "next/link"
import { formatNumber } from "@/lib/utils"

interface Metric {
  id: string
  label: string
  value: number
  previousValue: number
  trend: 'up' | 'down' | 'stable'
  change: number
  icon: typeof ChartLine
  color: string
  href: string
  description: string
}

export function Analytics() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call to get analytics data
    setMetrics([
      {
        id: '1',
        label: 'Content Performance',
        value: 3,
        previousValue: 2,
        trend: 'up',
        change: 50,
        icon: Calendar,
        color: 'text-blue-500',
        href: '/dashboard/content',
        description: 'Posts scheduled this week'
      },
      {
        id: '2',
        label: 'Community Activity',
        value: 28,
        previousValue: 20,
        trend: 'up',
        change: 40,
        icon: Users,
        color: 'text-green-500',
        href: '/dashboard/community',
        description: 'Active discussions this month'
      },
      {
        id: '3',
        label: 'Profile Views',
        value: 156,
        previousValue: 120,
        trend: 'up',
        change: 30,
        icon: Eye,
        color: 'text-orange-500',
        href: '/dashboard/success-insights',
        description: 'Profile visits this week'
      },
      {
        id: '4',
        label: 'Engagement Rate',
        value: 85,
        previousValue: 75,
        trend: 'up',
        change: 13,
        icon: Sparkles,
        color: 'text-purple-500',
        href: '/dashboard/success-insights',
        description: 'Average engagement on posts'
      }
    ])
    setIsLoading(false)
  }, [])

  if (isLoading) return null // Skeleton handled by parent

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <TooltipProvider>
        {metrics.map((metric) => (
          <Link
            key={metric.id}
            href={metric.href}
            className="block group"
          >
            <Card className="p-4 hover:shadow-md transition-shadow">
              <Tooltip>
                <TooltipTrigger className="w-full text-left">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <metric.icon className={`h-5 w-5 ${metric.color}`} />
                        <h3 className="font-semibold">{metric.label}</h3>
                      </div>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : metric.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <ChartLine className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <p className="text-2xl font-bold">
                      {formatNumber(metric.value)}
                      {metric.label === 'Engagement Rate' && '%'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {metric.description}
                    </p>
                    {metric.change !== 0 && (
                      <div className={`mt-2 text-sm flex items-center gap-1
                        ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {metric.trend === 'up' ? '+' : '-'}{Math.abs(metric.change)}%
                        <span className="text-gray-600">vs last period</span>
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p>Previous: {formatNumber(metric.previousValue)}</p>
                    <p>Change: {metric.change > 0 ? '+' : ''}{metric.change}%</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </Card>
          </Link>
        ))}
      </TooltipProvider>
    </div>
  )
} 
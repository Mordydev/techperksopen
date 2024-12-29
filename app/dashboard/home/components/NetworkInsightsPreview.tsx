"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowUpRight,
  MessageSquare,
  ThumbsUp,
  Users,
  TrendingUp,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface NetworkStats {
  newConnections: number
  engagement: {
    total: number
    trend: number
  }
  profileViews: {
    total: number
    trend: number
  }
  recommendations: number
  recentConnections: Array<{
    id: string
    name: string
    title: string
    avatar: string
    mutualConnections: number
  }>
}

export function NetworkInsightsPreview() {
  // TODO: Replace with actual data fetching
  const stats: NetworkStats = {
    newConnections: 12,
    engagement: {
      total: 245,
      trend: 24,
    },
    profileViews: {
      total: 89,
      trend: 15,
    },
    recommendations: 8,
    recentConnections: [
      {
        id: "1",
        name: "Sarah Chen",
        title: "AI Product Manager at TechCorp",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        mutualConnections: 12,
      },
      {
        id: "2",
        name: "Michael Rodriguez",
        title: "Senior Developer at InnovateLabs",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        mutualConnections: 8,
      },
    ],
  }

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Network Growth</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/network">
            View Details
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Profile Views"
              value={stats.profileViews.total}
              trend={stats.profileViews.trend}
              icon={<Users className="h-4 w-4" />}
            />
            <StatCard
              label="Engagement"
              value={stats.engagement.total}
              trend={stats.engagement.trend}
              icon={<ThumbsUp className="h-4 w-4" />}
            />
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium mb-3">Recent Connections</h3>
            <div className="space-y-3">
              {stats.recentConnections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center gap-3 pb-3 last:pb-0 last:border-0 border-b"
                >
                  <Image
                    src={connection.avatar}
                    alt={connection.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {connection.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {connection.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {connection.mutualConnections} mutual connections
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Message
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="New Connections"
              value={stats.newConnections}
              icon={<UserPlus className="h-4 w-4" />}
              showTrend={false}
            />
            <StatCard
              label="Recommendations"
              value={stats.recommendations}
              icon={<MessageSquare className="h-4 w-4" />}
              showTrend={false}
              href="/dashboard/network#recommendations"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/network">View Network Analytics</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  trend?: number
  showTrend?: boolean
  href?: string
}

function StatCard({
  label,
  value,
  icon,
  trend,
  showTrend = true,
  href,
}: StatCardProps) {
  const Content = (
    <div className="rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-primary/10 p-2">{icon}</div>
        {showTrend && trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp
              className={`h-3 w-3 ${trend < 0 ? "rotate-180" : ""}`}
            />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold">
          {value.toLocaleString()}
          {!showTrend && "+"}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block hover:opacity-80">
        {Content}
      </Link>
    )
  }

  return Content
} 
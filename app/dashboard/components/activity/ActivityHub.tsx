"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Rocket,
  Users,
  ThumbsUp,
  PenLine,
  Target,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { formatTimeAgo } from "@/lib/utils"
import { useProfile } from "@/lib/supabase/hooks/use-profile"

interface Activity {
  id: string
  type: 'post' | 'community' | 'engagement' | 'milestone'
  title: string
  description: string
  timestamp: string
  icon: typeof Rocket
  iconBgColor: string
  iconColor: string
}

export function ActivityHub() {
  const { profile } = useProfile()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const quickActions = [
    {
      icon: PenLine,
      label: "Create Content",
      description: `Schedule your ${profile?.post_frequency?.toLowerCase() || 'next'} post`,
      href: "/dashboard/content/new",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Target,
      label: "Set Goals",
      description: "Track your progress",
      href: "/dashboard/success-insights/goals",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Users,
      label: "Network",
      description: "Grow your connections",
      href: "/dashboard/network",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Sparkles,
      label: "Get AI Help",
      description: "Personalized guidance",
      href: "/dashboard/ai-partner",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    }
  ]

  useEffect(() => {
    setActivities([
      {
        id: '1',
        type: 'post',
        title: 'New post published',
        description: 'Your post about AI trends received 45 likes',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        icon: Rocket,
        iconBgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        id: '2',
        type: 'community',
        title: 'Community Engagement',
        description: 'Your comment in the Tech Leaders group received 12 responses',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        icon: Users,
        iconBgColor: 'bg-green-100',
        iconColor: 'text-green-600'
      },
      {
        id: '3',
        type: 'engagement',
        title: 'High engagement',
        description: 'Your latest posts are performing 45% better than average',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        icon: ThumbsUp,
        iconBgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      }
    ])

    setIsLoading(false)
  }, [profile?.post_frequency])

  if (isLoading) return null // Skeleton handled by parent

  return (
    <Card className="p-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="block group"
          >
            <div className={`p-4 rounded-lg transition-all ${action.bgColor} hover:ring-2 hover:ring-offset-2 hover:ring-offset-white hover:ring-${action.color}`}>
              <action.icon className={`h-6 w-6 ${action.color} mb-3`} />
              <h3 className="font-medium mb-1">{action.label}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/activity">View All</Link>
        </Button>
      </div>

      {/* Activity Feed */}
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${activity.iconBgColor}`}>
              <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-xs text-gray-400">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
} 
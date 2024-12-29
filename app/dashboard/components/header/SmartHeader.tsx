"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Brain } from "lucide-react"
import { useProfile } from "@/lib/supabase/hooks/use-profile"
import { getTimeBasedGreeting } from "@/lib/utils"

export function SmartHeader() {
  const { profile, loading } = useProfile()
  const [aiTip, setAiTip] = useState<string>("")

  useEffect(() => {
    if (profile?.primary_goal) {
      setAiTip(`Pro tip: Based on your goal to ${profile.primary_goal.toLowerCase()}, try sharing your expertise through ${profile.post_frequency?.toLowerCase() || 'regular'} content to increase engagement by 40%`)
    } else {
      setAiTip("Pro tip: Share your expertise through short-form content to increase engagement by 40%")
    }
  }, [profile])

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours()
    const name = profile?.full_name?.split(' ')[0] || "there"
    
    if (hour < 12) {
      return `Good morning, ${name}! Ready to make an impact today?`
    } else if (hour < 17) {
      return `Good afternoon, ${name}! Keep the momentum going!`
    } else {
      return `Good evening, ${name}! Let's review your achievements!`
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-[250px] bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-[350px] bg-gray-200 animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {getPersonalizedGreeting()}
        </h1>
        <p className="text-muted-foreground mt-2">
          {formattedDate}
        </p>
        {profile?.headline && (
          <p className="text-muted-foreground mt-2">
            {profile.headline}
          </p>
        )}
        {profile?.weekly_goal_progress !== undefined && (
          <div className="mt-4 flex items-center gap-2">
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all duration-500" 
                style={{ width: `${profile.weekly_goal_progress}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">
              {profile.weekly_goal_progress}% of weekly goals completed
            </span>
          </div>
        )}
      </div>

      {/* AI Tip */}
      <Card className="p-4 bg-purple-50 border-purple-100">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <p className="text-sm text-purple-900">{aiTip}</p>
        </div>
      </Card>
    </div>
  )
} 
"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Trophy,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  Zap,
  Medal
} from "lucide-react"
import Link from "next/link"
import { useProfile } from "@/lib/supabase/hooks/use-profile"

interface Achievement {
  id: string
  title: string
  description: string
  earnedAt: string
  type: 'milestone' | 'skill' | 'engagement'
  icon: typeof Trophy
  color: string
}

interface Goal {
  id: string
  title: string
  progress: number
  target: number
  unit: string
  dueDate: string
  status: 'on_track' | 'at_risk' | 'completed'
}

interface Skill {
  name: string
  level: number
  endorsements: number
  trending: boolean
}

export function GrowthTracker() {
  const { profile } = useProfile()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    setAchievements([
      {
        id: '1',
        title: 'Network Builder',
        description: 'Connected with 100+ professionals',
        earnedAt: new Date().toISOString(),
        type: 'milestone',
        icon: Trophy,
        color: 'text-yellow-500'
      },
      {
        id: '2',
        title: 'Content Creator',
        description: 'Published 10 engaging posts',
        earnedAt: new Date().toISOString(),
        type: 'engagement',
        icon: Star,
        color: 'text-purple-500'
      }
    ])

    setGoals([
      {
        id: '1',
        title: 'Grow Network',
        progress: 120,
        target: 150,
        unit: 'connections',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'on_track'
      },
      {
        id: '2',
        title: 'Content Engagement',
        progress: 85,
        target: 100,
        unit: 'engagement rate',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'at_risk'
      }
    ])

    setSkills([
      {
        name: 'Leadership',
        level: 4,
        endorsements: 12,
        trending: true
      },
      {
        name: 'Project Management',
        level: 3,
        endorsements: 8,
        trending: false
      },
      {
        name: 'Strategic Planning',
        level: 4,
        endorsements: 15,
        trending: true
      }
    ])

    setIsLoading(false)
  }, [])

  if (isLoading) return null // Skeleton handled by parent

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Professional Growth</h2>
        </div>
        <Button asChild>
          <Link href="/dashboard/growth">View Details</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Goals Progress */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4" />
            Current Goals
          </h3>
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">{goal.title}</p>
                <Badge variant={
                  goal.status === 'completed' ? 'default' :
                  goal.status === 'on_track' ? 'secondary' : 'destructive'
                }>
                  {goal.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    goal.status === 'completed' ? 'bg-green-500' :
                    goal.status === 'on_track' ? 'bg-blue-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{goal.progress} / {goal.target} {goal.unit}</span>
                <span>{new Date(goal.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Achievements */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Recent Achievements
          </h3>
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="flex items-center gap-3">
                <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills & Endorsements */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Top Skills
          </h3>
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{skill.name}</p>
                {skill.trending && (
                  <Badge variant="secondary">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < skill.level ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                    fill={i < skill.level ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {skill.endorsements} endorsements
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Points & Rewards */}
      {profile?.points !== undefined && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-yellow-900">Growth Points</h3>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {profile.tier || 'Bronze'}
            </Badge>
          </div>
          <p className="text-2xl font-bold text-yellow-900">
            {profile.points} points
          </p>
          {profile.next_tier_points && (
            <div className="mt-2">
              <div className="w-full h-2 bg-yellow-100 rounded-full">
                <div
                  className="h-2 bg-yellow-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${(profile.points / profile.next_tier_points) * 100}%`
                  }}
                />
              </div>
              <p className="text-sm text-yellow-800 mt-1">
                {profile.next_tier_points - profile.points} points to next tier
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
} 
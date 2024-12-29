"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Network,
  Users,
  UserPlus,
  Building,
  Briefcase,
  ArrowRight,
  Globe,
  TrendingUp,
  Code,
  Brain,
  Laptop,
  LineChart,
  Rocket,
  Target
} from "lucide-react"
import Link from "next/link"
import { formatNumber } from "@/lib/utils"

interface Connection {
  id: string
  name: string
  title: string
  company: string
  industry: string
  mutualConnections: number
  profileUrl: string
  recommendationReason: string
  sharedSkills: string[]
  sharedGroups: number
  recentActivity?: string
  engagementRate?: number
}

const getIndustryIcon = (industry: string) => {
  switch (industry.toLowerCase()) {
    case 'technology':
      return <Laptop className="h-4 w-4" />
    case 'software':
      return <Code className="h-4 w-4" />
    case 'artificial intelligence':
      return <Brain className="h-4 w-4" />
    case 'data science':
      return <LineChart className="h-4 w-4" />
    case 'startup':
      return <Rocket className="h-4 w-4" />
    default:
      return <Target className="h-4 w-4" />
  }
}

interface NetworkStats {
  totalConnections: number
  newConnectionsThisMonth: number
  pendingInvitations: number
  connectionRate: number
  industryDistribution: {
    [key: string]: number
  }
}

export function NetworkInsights() {
  const [recommendedConnections, setRecommendedConnections] = useState<Connection[]>([])
  const [stats, setStats] = useState<NetworkStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call to get network data
    setRecommendedConnections([
      {
        id: '1',
        name: 'Sarah Miller',
        title: 'CTO',
        company: 'TechCorp',
        industry: 'Technology',
        mutualConnections: 15,
        profileUrl: '#',
        recommendationReason: 'Frequently engages with your AI-related content',
        sharedSkills: ['Machine Learning', 'Cloud Architecture', 'Team Leadership'],
        sharedGroups: 3,
        recentActivity: 'Published an article about AI trends',
        engagementRate: 85
      },
      {
        id: '2',
        name: 'John Davis',
        title: 'Product Manager',
        company: 'InnovateLabs',
        industry: 'Software',
        mutualConnections: 8,
        profileUrl: '#',
        recommendationReason: 'Works in your industry with similar tech stack',
        sharedSkills: ['Agile', 'Product Strategy', 'SaaS'],
        sharedGroups: 2,
        recentActivity: 'Looking for AI integration partners',
        engagementRate: 72
      },
      {
        id: '3',
        name: 'Emily Chen',
        title: 'AI Research Lead',
        company: 'FutureAI',
        industry: 'Artificial Intelligence',
        mutualConnections: 12,
        profileUrl: '#',
        recommendationReason: 'Leader in AI research with shared interests',
        sharedSkills: ['Deep Learning', 'NLP', 'Research'],
        sharedGroups: 4,
        recentActivity: 'Spoke at AI Conference 2024',
        engagementRate: 92
      }
    ])

    setStats({
      totalConnections: 487,
      newConnectionsThisMonth: 28,
      pendingInvitations: 5,
      connectionRate: 75,
      industryDistribution: {
        'Technology': 45,
        'Software': 30,
        'AI & ML': 15,
        'Other': 10
      }
    })

    setIsLoading(false)
  }, [])

  if (isLoading) return null // Skeleton handled by parent

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-green-500" />
          <h2 className="text-lg font-semibold">Network Insights</h2>
        </div>
        <Button asChild>
          <Link href="/dashboard/network">
            View All
          </Link>
        </Button>
      </div>

      {/* Network Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Connections</p>
            <p className="text-2xl font-bold">{formatNumber(stats.totalConnections)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">This Month</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">+{stats.newConnectionsThisMonth}</p>
              <Badge variant="secondary" className="h-6">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.connectionRate}%
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Connections */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Recommended Connections</h3>
        {recommendedConnections.map((connection) => (
          <div
            key={connection.id}
            className="grid grid-cols-[auto,1fr] gap-4 p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted">
              {getIndustryIcon(connection.industry)}
            </div>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{connection.name}</p>
                    {connection.engagementRate && connection.engagementRate > 80 && (
                      <Badge variant="secondary" className="text-xs">
                        High Engagement
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {connection.title} at {connection.company}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="ml-2" asChild>
                  <Link href={connection.profileUrl} className="flex items-center gap-2">
                    Connect
                    <UserPlus className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                {connection.recommendationReason}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{connection.mutualConnections} mutual connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{connection.industry}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{connection.sharedGroups} shared groups</span>
                  </div>
                  {connection.recentActivity && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{connection.recentActivity}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {connection.sharedSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Industry Distribution */}
      {stats && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Industry Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.industryDistribution).map(([industry, percentage]) => (
              <div key={industry} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{industry}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
} 
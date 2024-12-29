"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, PenLine, Plus, Tag } from "lucide-react"
import Link from "next/link"

interface ContentItem {
  id: string
  title: string
  date: string
  time: string
  platform: "linkedin" | "twitter"
  status: "draft" | "scheduled" | "published"
  type: "text" | "article" | "image"
  tags?: string[]
}

const getStatusColor = (status: ContentItem["status"]) => {
  switch (status) {
    case "draft":
      return "bg-yellow-100 text-yellow-800"
    case "scheduled":
      return "bg-blue-100 text-blue-800"
    case "published":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function ContentCalendarPreview() {
  // TODO: Replace with actual data fetching
  const upcomingContent: ContentItem[] = [
    {
      id: "1",
      title: "Industry Insights: The Future of AI",
      date: "2024-01-18",
      time: "10:00",
      platform: "linkedin",
      status: "scheduled",
      type: "article",
      tags: ["AI", "Technology", "Future of Work"],
    },
    {
      id: "2",
      title: "Weekly Tech Roundup",
      date: "2024-01-20",
      time: "14:30",
      platform: "linkedin",
      status: "draft",
      type: "text",
      tags: ["Tech News", "Weekly Update"],
    },
  ]

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Content Calendar</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/content/new">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/content-and-calendar">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingContent.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                  <Badge variant="outline">{item.type}</Badge>
                </div>
                <h4 className="font-medium line-clamp-1">{item.title}</h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{item.time}</span>
                  </div>
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" asChild className="mt-2">
                <Link href={`/dashboard/content/${item.id}`}>
                  <PenLine className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button className="w-full" asChild>
            <Link href="/dashboard/content-and-calendar">View Full Calendar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 
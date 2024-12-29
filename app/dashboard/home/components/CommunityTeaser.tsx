"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, TrendingUp, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Event {
  id: string
  title: string
  date: string
  attendees: number
}

interface Conversation {
  id: string
  title: string
  author: {
    name: string
    avatar: string
  }
  replies: number
  likes: number
  topic: string
  preview: string
}

export function CommunityTeaser() {
  // TODO: Replace with actual data fetching
  const upcomingEvents: Event[] = [
    {
      id: "1",
      title: "LinkedIn Growth Strategies Workshop",
      date: "2024-01-20",
      attendees: 45,
    },
    {
      id: "2",
      title: "Content Creation Masterclass",
      date: "2024-01-25",
      attendees: 32,
    },
  ]

  const trendingConversations: Conversation[] = [
    {
      id: "1",
      title: "How AI is Transforming Professional Networking",
      author: {
        name: "Alex Thompson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      },
      replies: 24,
      likes: 156,
      topic: "AI & Tech",
      preview: "The integration of AI in professional networking has opened up new possibilities for...",
    },
    {
      id: "2",
      title: "Best Practices for LinkedIn Content Strategy",
      author: {
        name: "Maria Garcia",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      },
      replies: 18,
      likes: 92,
      topic: "Content Strategy",
      preview: "When it comes to LinkedIn content, consistency and value are key...",
    },
  ]

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Community</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/community">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Upcoming Events Section */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Conversations Section */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Trending Conversations
            </h3>
            <div className="space-y-4">
              {trendingConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="space-y-3 pb-3 border-b last:pb-0 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <Image
                      src={conversation.author.avatar}
                      alt={conversation.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">{conversation.author.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {conversation.topic}
                        </Badge>
                      </div>
                      <Link
                        href={`/dashboard/community/discussions/${conversation.id}`}
                        className="block group"
                      >
                        <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors">
                          {conversation.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {conversation.preview}
                        </p>
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{conversation.replies} replies</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{conversation.likes} likes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button className="flex-1" asChild>
            <Link href="/dashboard/community">Join the Conversation</Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/community/new">
              <MessageSquare className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 
"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Edit,
  Plus,
  ThumbsUp,
  MessageSquare,
  Share2,
  Tag
} from "lucide-react"
import Link from "next/link"
import { formatDate, formatTimeAgo } from "@/lib/utils"
import { useContentCalendarStore } from "@/lib/hooks/useContentCalendarStore"
import { EditPostModal } from "./EditPostModal"

interface Post {
  id: string
  title: string
  content?: string
  scheduledFor: string
  status: 'draft' | 'scheduled' | 'published'
  type: 'text' | 'article' | 'image'
  tags?: string[]
  engagement?: {
    likes: number
    comments: number
    shares: number
  }
}

interface FormValues {
  title: string
  content: string
  scheduledFor: Date
  tags: string[]
}

export function ContentCalendar() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { openModal } = useContentCalendarStore()

  useEffect(() => {
    // In a real app, this would be an API call to get content data
    setPosts([
      {
        id: '1',
        title: 'The Future of AI in Professional Development',
        content: 'Exploring how AI is transforming professional growth and career development...',
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        type: 'article',
        tags: ['AI', 'Career Development', 'Technology']
      },
      {
        id: '2',
        title: '5 Tips for Effective Professional Networking',
        content: 'Learn how to build and maintain professional relationships...',
        scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'draft',
        type: 'text',
        tags: ['Networking', 'Career Tips', 'Professional Growth']
      },
      {
        id: '3',
        title: 'Latest Project Success Story',
        content: 'Showcasing our recent achievements...',
        scheduledFor: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'published',
        type: 'image',
        tags: ['Success Story', 'Project Management', 'Case Study'],
        engagement: {
          likes: 45,
          comments: 12,
          shares: 8
        }
      }
    ])
    setIsLoading(false)
  }, [])

  const handleEdit = (post: Post) => {
    setSelectedPost(post)
    openModal(post.id)
  }

  const handleSave = (values: FormValues) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === selectedPost?.id
          ? {
              ...post,
              title: values.title,
              content: values.content,
              scheduledFor: values.scheduledFor.toISOString(),
              tags: values.tags
            }
          : post
      )
    )
    setSelectedPost(null)
  }

  const getStatusColor = (status: Post['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'published':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: Post['type']) => {
    switch (type) {
      case 'text':
        return '📝'
      case 'article':
        return '📄'
      case 'image':
        return '🖼️'
      default:
        return '📄'
    }
  }

  if (isLoading) return null // Skeleton handled by parent

  const upcomingPosts = posts.filter(post => 
    post.status === 'scheduled' || post.status === 'draft'
  )

  const recentPosts = posts.filter(post => 
    post.status === 'published'
  )

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Content Calendar</h2>
        </div>
        <Button asChild>
          <Link href="/dashboard/content/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Link>
        </Button>
      </div>

      {/* Upcoming Posts */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Upcoming</h3>
        {upcomingPosts.length > 0 ? (
          upcomingPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getStatusColor(post.status)}>
                    {post.status}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getTypeIcon(post.type)} {post.type}
                  </Badge>
                </div>
                <p className="font-medium">{post.title}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {post.status === 'scheduled'
                      ? `Scheduled for ${formatDate(post.scheduledFor)}`
                      : 'Draft saved ' + formatTimeAgo(post.scheduledFor)}
                  </span>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(post)}
                className="ml-4"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No upcoming posts scheduled</p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/dashboard/content/new">Schedule Your First Post</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Posts</h3>
          {recentPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-lg border bg-card"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getStatusColor(post.status)}>
                    {post.status}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getTypeIcon(post.type)} {post.type}
                  </Badge>
                </div>
                <p className="font-medium">{post.title}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Published {formatTimeAgo(post.scheduledFor)}</span>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {post.engagement && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4 text-blue-500" />
                      <span>{post.engagement.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <span>{post.engagement.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4 text-purple-500" />
                      <span>{post.engagement.shares}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <EditPostModal post={selectedPost} onSave={handleSave} />
    </Card>
  )
} 
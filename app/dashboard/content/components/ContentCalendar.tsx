'use client'

import { useMemo, useState } from 'react'
import { useContentStore } from '../stores/useContentStore'
import { useFilter } from '../contexts/FilterContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { MoreHorizontal, Archive, Trash } from 'lucide-react'
import { toast } from 'sonner'

export function ContentCalendar() {
  const { posts, updatePost, deletePost } = useContentStore()
  const { calendarFilter } = useFilter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Filter posts based on current filters
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Don't show archived posts
      if (post.archived) return false

      // Apply memo type filter
      if (calendarFilter.memoType) {
        if (calendarFilter.memoType === 'voice' && post.source?.type !== 'voice_note') return false
        if (calendarFilter.memoType === 'chat' && post.source?.type !== 'chat_thread') return false
      }

      // Apply project filter
      if (calendarFilter.projectId && post.projectId !== calendarFilter.projectId) return false

      // Apply tag filter
      if (calendarFilter.tags?.length && !calendarFilter.tags.every(tag => post.tags.includes(tag))) return false

      // Apply status filter
      if (calendarFilter.status && post.status !== calendarFilter.status) return false

      return true
    })
  }, [posts, calendarFilter])

  const handleArchive = (postId: string) => {
    try {
      updatePost(postId, { archived: true })
      toast.success('Post archived')
    } catch (error) {
      toast.error('Failed to archive post')
    }
  }

  const handleDelete = (postId: string) => {
    try {
      deletePost(postId)
      toast.success('Post deleted')
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  // Group posts by date
  const postsByDate = useMemo(() => {
    const grouped = new Map<string, typeof posts>()
    
    filteredPosts.forEach(post => {
      if (!post.scheduledFor) return
      
      const dateKey = format(post.scheduledFor, 'yyyy-MM-dd')
      const existing = grouped.get(dateKey) || []
      grouped.set(dateKey, [...existing, post])
    })
    
    return grouped
  }, [filteredPosts])

  const renderPostsForDate = (date: string) => {
    const posts = postsByDate.get(date) || []

    return (
      <div className="space-y-2">
        {posts.map((post) => (
          <Card key={post.id} className="p-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{post.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {post.source?.type}
                  </Badge>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {post.content}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleArchive(post.id)}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card className="p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
        components={{
          Day: ({ day }) => (
            <div className="w-full min-h-[100px] p-1">
              <div className="text-xs font-medium">
                {format(day.date, 'd')}
              </div>
              {renderPostsForDate(format(day.date, 'yyyy-MM-dd'))}
            </div>
          ),
        }}
      />
    </Card>
  )
} 
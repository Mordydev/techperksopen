'use client'

import { useState } from 'react'
import { useContentStore, type Post } from '../stores/useContentStore'
import { useFilter } from '../contexts/FilterContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FilterBar } from './FilterBar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
} from 'date-fns'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { PostEditorModal } from './PostEditorModal'
import { RequestChangesModal } from './RequestChangesModal'
import { cn } from '@/lib/utils'

export function ContentCalendar() {
  const {
    posts,
    updatePost,
    deletePost,
    calendarSettings,
  } = useContentStore()

  const { postFilter, setPostFilter, syncFilters } = useFilter()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false)
  const [view, setView] = useState<'week' | 'month'>('week')

  const startDate = view === 'week' ? startOfWeek(selectedDate) : startOfMonth(selectedDate)
  const endDate = view === 'week' ? endOfWeek(selectedDate) : endOfMonth(selectedDate)
  const daysInView = eachDayOfInterval({ start: startDate, end: endDate })

  const filteredPosts = posts.filter((post) => {
    if (!postFilter) return true
    
    const matchesStatus = !postFilter.status || post.status === postFilter.status
    const matchesMemoType = !postFilter.memoType || post.source?.type === postFilter.memoType
    const matchesProject = !postFilter.projectId || post.projectId === postFilter.projectId
    const matchesTags = !postFilter.tags?.length || 
      postFilter.tags.every(tag => post.tags.includes(tag))
    const matchesDateRange = !postFilter.dateRange || 
      (post.scheduledFor && 
        new Date(post.scheduledFor) >= postFilter.dateRange.start &&
        new Date(post.scheduledFor) <= postFilter.dateRange.end)
    const matchesSearch = !postFilter.search ? true : (
      post.title.toLowerCase().includes(postFilter.search.toLowerCase()) ||
      post.content.toLowerCase().includes(postFilter.search.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(postFilter.search.toLowerCase()))
    )

    return matchesStatus && matchesMemoType && matchesProject && 
           matchesTags && matchesDateRange && matchesSearch
  })

  const getPostsForDate = (date: Date) => {
    return filteredPosts.filter(post => 
      post.scheduledFor && isSameDay(new Date(post.scheduledFor), date)
    )
  }

  const handlePrevious = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev)
      if (view === 'week') {
        newDate.setDate(newDate.getDate() - 7)
      } else {
        newDate.setMonth(newDate.getMonth() - 1)
      }
      return newDate
    })
  }

  const handleNext = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev)
      if (view === 'week') {
        newDate.setDate(newDate.getDate() + 7)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const getDayClassName = (date: Date) => {
    return cn(
      'h-full min-h-[120px] p-2',
      !isSameMonth(date, selectedDate) && 'opacity-50',
      isToday(date) && 'bg-accent',
      'hover:bg-accent/50 transition-colors'
    )
  }

  const getPostDensityClass = (posts: Post[]) => {
    if (posts.length === 0) return ''
    if (posts.length <= 2) return 'border-l-2 border-primary/30'
    if (posts.length <= 4) return 'border-l-2 border-primary/60'
    return 'border-l-2 border-primary'
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('week')}
            className={cn(view === 'week' && 'bg-primary text-primary-foreground')}
          >
            Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('month')}
            className={cn(view === 'month' && 'bg-primary text-primary-foreground')}
          >
            Month
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {view === 'week' ? (
              <>
                {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
              </>
            ) : (
              format(selectedDate, 'MMMM yyyy')
            )}
          </span>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <FilterBar showSearch={false} className="flex-1 justify-end" />
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {/* Calendar header */}
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date(startDate)
          date.setDate(date.getDate() + i)
          return (
            <div
              key={i}
              className="bg-card px-2 py-1.5 text-sm font-medium text-muted-foreground"
            >
              {format(date, 'EEE')}
            </div>
          )
        })}

        {/* Calendar days */}
        {daysInView.map((date) => {
          const postsForDate = getPostsForDate(date)
          return (
            <div
              key={date.toISOString()}
              className={cn(
                'bg-card relative',
                getDayClassName(date),
                getPostDensityClass(postsForDate)
              )}
            >
              <div className="font-medium text-sm mb-1">
                {format(date, 'd')}
              </div>
              <div className="space-y-1">
                {view === 'month' && postsForDate.length > 0 && (
                  <div
                    className="text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => {
                      setSelectedDate(date)
                      setView('week')
                    }}
                  >
                    {postsForDate.length} post{postsForDate.length !== 1 && 's'}
                  </div>
                )}
                {(view === 'week' || postsForDate.length <= 3) &&
                  postsForDate.map((post) => (
                    <div
                      key={post.id}
                      className="p-1.5 rounded-md bg-muted hover:bg-muted/80 cursor-pointer"
                      onClick={() => {
                        setSelectedPost(post)
                        setShowEditModal(true)
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-xs font-medium line-clamp-2">
                            {post.title}
                          </p>
                          {post.source && (
                            <Badge variant="secondary" className="text-xs">
                              {post.source.type === 'ai_call' ? 'AI Call' :
                               post.source.type === 'voice_note' ? 'Voice Memo' : 'Chat Memo'}
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation()
                              setSelectedPost(post)
                              setShowRequestChangesModal(true)
                            }}>
                              Request Changes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation()
                                deletePost(post.id)
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
      </div>

      {selectedPost && (
        <>
          <PostEditorModal
            post={selectedPost}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false)
              setSelectedPost(null)
            }}
          />
          <RequestChangesModal
            post={selectedPost}
            isOpen={showRequestChangesModal}
            onClose={() => {
              setShowRequestChangesModal(false)
              setSelectedPost(null)
            }}
          />
        </>
      )}
    </div>
  )
} 
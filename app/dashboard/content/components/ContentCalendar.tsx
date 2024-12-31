'use client'

import { useState } from 'react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, parseISO, startOfMonth, endOfMonth, addMonths } from 'date-fns'
import { useContentStore, type Post } from '../stores/useContentStore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react'
import { PostEditorModal } from './PostEditorModal'

type ViewType = 'week' | 'month'

interface DraggablePostProps {
  post: Post
  onClick?: () => void
  isDragging?: boolean
}

function DraggablePost({ post, onClick, isDragging }: DraggablePostProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: post.id,
    data: post,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-300'
      case 'draft':
        return 'bg-gray-100 border-gray-300'
      case 'needs-changes':
        return 'bg-red-100 border-red-300'
      case 'scheduled':
        return 'bg-blue-100 border-blue-300'
      case 'published':
        return 'bg-green-100 border-green-300'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn('group touch-none', isDragging && 'opacity-50')}
    >
      <Card
        className={cn(
          'p-2 text-sm border cursor-pointer hover:shadow-md transition-shadow relative',
          getStatusColor(post.status)
        )}
        onClick={onClick}
      >
        <div className="absolute right-1 top-1/2 -translate-y-1/2 sm:hidden opacity-0 group-active:opacity-100">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="pr-6 sm:pr-2">
          <div className="font-medium truncate">{post.title}</div>
          {post.stats && (
            <div className="text-xs text-muted-foreground">
              {post.stats.likes} likes • {post.stats.comments} comments
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

interface DroppableDayProps {
  date: Date
  children: React.ReactNode
  isCompact?: boolean
}

function DroppableDay({ date, children, isCompact }: DroppableDayProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: date.toISOString(),
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'border rounded-lg transition-colors',
        isCompact ? 'p-1 min-h-[120px]' : 'p-2 min-h-[200px]',
        isOver && 'bg-muted'
      )}
    >
      {children}
    </div>
  )
}

export function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>('week')
  const [activePost, setActivePost] = useState<Post | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingDrop, setPendingDrop] = useState<{
    post: Post
    newDate: Date
  } | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const posts = useContentStore((state) => state.posts)
  const updatePost = useContentStore((state) => state.updatePost)

  const getDaysToDisplay = () => {
    if (viewType === 'week') {
      const weekStart = startOfWeek(currentDate)
      const weekEnd = endOfWeek(currentDate)
      return eachDayOfInterval({ start: weekStart, end: weekEnd })
    } else {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      return eachDayOfInterval({ start: monthStart, end: monthEnd })
    }
  }

  const handleDateChange = (direction: 'prev' | 'next') => {
    if (viewType === 'week') {
      setCurrentDate(prev => addDays(prev, direction === 'next' ? 7 : -7))
    } else {
      setCurrentDate(prev => addMonths(prev, direction === 'next' ? 1 : -1))
    }
  }

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
    setShowEditModal(true)
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  )

  const getPostsForDate = (date: Date) => {
    return posts.filter((post) => {
      if (!post.scheduledFor) return false
      return format(post.scheduledFor, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const post = posts.find((p) => p.id === event.active.id)
    if (post) {
      setActivePost(post)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePost(null)
    const { active, over } = event

    if (!over) return

    const post = posts.find((p) => p.id === active.id)
    if (!post) return

    const newDate = parseISO(over.id as string)
    
    // Don't allow dropping on the same date
    if (post.scheduledFor && format(post.scheduledFor, 'yyyy-MM-dd') === format(newDate, 'yyyy-MM-dd')) {
      return
    }

    setPendingDrop({ post, newDate })
    setShowConfirm(true)
  }

  const handleConfirmDrop = () => {
    if (!pendingDrop) return

    const { post, newDate } = pendingDrop
    try {
      updatePost(post.id, {
        scheduledFor: newDate,
        status: 'scheduled',
      })
      toast.success('Post rescheduled', {
        description: `Moved to ${format(newDate, 'PPP')}`,
      })
    } catch (err) {
      toast.error('Failed to reschedule post', {
        description: err instanceof Error ? err.message : 'Please try again',
      })
    }

    setPendingDrop(null)
    setShowConfirm(false)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center">
          <div className="flex justify-center sm:justify-start space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewType('week')}
              className={cn(viewType === 'week' && 'bg-primary text-primary-foreground')}
            >
              Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewType('month')}
              className={cn(viewType === 'month' && 'bg-primary text-primary-foreground')}
            >
              Month
            </Button>
          </div>
          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateChange('prev')}
              className="px-2 sm:px-4"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Previous</span>
            </Button>
            <span className="font-medium text-sm sm:text-base whitespace-nowrap">
              {viewType === 'week' 
                ? `${format(getDaysToDisplay()[0], 'MMM d')} - ${format(getDaysToDisplay()[6], 'MMM d, yyyy')}`
                : format(currentDate, 'MMMM yyyy')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateChange('next')}
              className="px-2 sm:px-4"
            >
              <span className="hidden sm:inline mr-2">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className={cn(
            "grid gap-1 sm:gap-4",
            viewType === 'week' ? 'grid-cols-7' : 'grid-cols-7'
          )}>
            {getDaysToDisplay().map((date) => (
              <DroppableDay 
                key={date.toISOString()} 
                date={date}
                isCompact={viewType === 'month' || window.innerWidth < 640}
              >
                <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  <span className="sm:hidden">{format(date, 'E')}</span>
                  <span className="hidden sm:inline">{format(date, 'EEE')}</span>{' '}
                  <span className="text-muted-foreground">{format(date, 'd')}</span>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  {getPostsForDate(date).map((post) => (
                    <DraggablePost
                      key={post.id}
                      post={post}
                      isDragging={activePost?.id === post.id}
                      onClick={() => handlePostClick(post)}
                    />
                  ))}
                </div>
              </DroppableDay>
            ))}
          </div>

          <DragOverlay>
            {activePost && <DraggablePost post={activePost} />}
          </DragOverlay>
        </DndContext>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Reschedule</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDrop && (
                <>
                  Are you sure you want to reschedule "{pendingDrop.post.title}" to{' '}
                  {format(pendingDrop.newDate, 'PPP')}?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setPendingDrop(null)
              setShowConfirm(false)
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDrop}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedPost && (
        <PostEditorModal
          post={selectedPost}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedPost(null)
          }}
        />
      )}
    </>
  )
} 
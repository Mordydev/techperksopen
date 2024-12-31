'use client'

import { useState } from 'react'
import { useContentStore, type Post } from '../stores/useContentStore'
import { useFilter } from '../contexts/FilterContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FilterBar } from './FilterBar'
import { SortBar } from './SortBar'
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
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { PostEditorModal } from './PostEditorModal'
import { RequestChangesModal } from './RequestChangesModal'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  MoreHorizontal, Edit, Calendar as CalendarIcon, AlertTriangle, Archive,
  Trash, Grid, List, LayoutList, Search, Filter, Save, X
} from 'lucide-react'
import { toast } from 'sonner'

export function ListView() {
  const {
    posts,
    currentSort,
    currentLayout,
    savedFilters,
    setSort,
    setLayout,
    saveFilter,
    deleteSavedFilter,
    bulkUpdateStatus,
    bulkAssignProject,
    bulkArchive,
    bulkDelete,
    updatePost,
    deletePost,
  } = useContentStore()

  const { postFilter, setPostFilter, syncFilters } = useFilter()

  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false)

  // Apply filters and sort
  const filteredPosts = posts
    .filter((post) => {
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
    .sort((a, b) => {
      if (currentSort.field === 'date') {
        const dateA = a.scheduledFor ? new Date(a.scheduledFor) : new Date(0)
        const dateB = b.scheduledFor ? new Date(b.scheduledFor) : new Date(0)
        return currentSort.direction === 'asc' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime()
      }
      if (currentSort.field === 'priority') {
        const priorityMap = { high: 3, medium: 2, low: 1 } as const
        const priorityA = priorityMap[a.priority || 'low']
        const priorityB = priorityMap[b.priority || 'low']
        return currentSort.direction === 'asc'
          ? priorityA - priorityB
          : priorityB - priorityA
      }
      if (currentSort.field === 'engagement' && a.stats && b.stats) {
        const engagementA = a.stats.likes + a.stats.comments
        const engagementB = b.stats.likes + b.stats.comments
        return currentSort.direction === 'asc'
          ? engagementA - engagementB
          : engagementB - engagementA
      }
      return 0
    })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLayout('detailed')}
            className={cn(currentLayout === 'detailed' && 'bg-primary text-primary-foreground')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLayout('compact')}
            className={cn(currentLayout === 'compact' && 'bg-primary text-primary-foreground')}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLayout('grid')}
            className={cn(currentLayout === 'grid' && 'bg-primary text-primary-foreground')}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <SortBar />
          <FilterBar onSaveFilter={saveFilter} />
        </div>
      </div>

      <div className={cn(
        'grid gap-4',
        currentLayout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
        'grid-cols-1'
      )}>
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            className={cn(
              'p-4',
              currentLayout === 'compact' && 'py-2',
              selectedPosts.includes(post.id) && 'ring-2 ring-primary'
            )}
          >
            <div className="flex items-start gap-4">
              <Checkbox
                checked={selectedPosts.includes(post.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedPosts([...selectedPosts, post.id])
                  } else {
                    setSelectedPosts(selectedPosts.filter(id => id !== post.id))
                  }
                }}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium leading-none">{post.title}</h3>
                    {currentLayout !== 'compact' && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.content}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedPost(post)
                        setShowEditModal(true)
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedPost(post)
                        setShowRequestChangesModal(true)
                      }}>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Request Changes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        updatePost(post.id, { archived: true })
                        toast.success('Post archived')
                      }}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          deletePost(post.id)
                          toast.success('Post deleted')
                        }}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {post.status}
                  </Badge>
                  {post.scheduledFor && (
                    <Badge variant="outline">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {format(new Date(post.scheduledFor), 'PP')}
                    </Badge>
                  )}
                  {post.source && (
                    <Badge>
                      {post.source.type === 'ai_call' ? 'AI Call' :
                       post.source.type === 'voice_note' ? 'Voice Memo' : 'Chat Memo'}
                    </Badge>
                  )}
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
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
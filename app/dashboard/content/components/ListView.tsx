'use client'

import { useState } from 'react'
import { useContentStore, type Post, type PostStatus, type PostFilter, type PostSort, type ViewLayout } from '../stores/useContentStore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
    currentFilter,
    currentSort,
    currentLayout,
    savedFilters,
    setFilter,
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

  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false)
  const [showFilterPopover, setShowFilterPopover] = useState(false)
  const [filterName, setFilterName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Apply filters and sort
  const filteredPosts = posts
    .filter((post) => {
      if (!currentFilter) return true
      
      const matchesStatus = !currentFilter.status || post.status === currentFilter.status
      const matchesMemoType = !currentFilter.memoType || post.source?.type === currentFilter.memoType
      const matchesProject = !currentFilter.projectId || post.projectId === currentFilter.projectId
      const matchesTags = !currentFilter.tags?.length || 
        currentFilter.tags.every(tag => post.tags.includes(tag))
      const matchesDateRange = !currentFilter.dateRange || 
        (post.scheduledFor && 
          new Date(post.scheduledFor) >= currentFilter.dateRange.start &&
          new Date(post.scheduledFor) <= currentFilter.dateRange.end)
      const matchesSearch = !currentFilter.search || 
        post.title.toLowerCase().includes(currentFilter.search.toLowerCase())

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
      if (currentSort.field === 'engagement' && a.stats && b.stats) {
        const engagementA = a.stats.likes + a.stats.comments
        const engagementB = b.stats.likes + b.stats.comments
        return currentSort.direction === 'asc'
          ? engagementA - engagementB
          : engagementB - engagementA
      }
      return 0
    })

  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      toast.error('Filter name is required')
      return
    }
    saveFilter(filterName, currentFilter)
    setFilterName('')
    setShowFilterPopover(false)
    toast.success('Filter saved')
  }

  const handleBulkAction = (action: 'status' | 'project' | 'archive' | 'delete', value?: PostStatus | string) => {
    if (!selectedPosts.length) {
      toast.error('No posts selected')
      return
    }

    try {
      switch (action) {
        case 'status':
          if (value as PostStatus) {
            bulkUpdateStatus(selectedPosts, value as PostStatus)
            toast.success(`Updated status for ${selectedPosts.length} posts`)
          }
          break
        case 'project':
          if (value) {
            bulkAssignProject(selectedPosts, value)
            toast.success(`Assigned project for ${selectedPosts.length} posts`)
          }
          break
        case 'archive':
          bulkArchive(selectedPosts)
          toast.success(`Archived ${selectedPosts.length} posts`)
          break
        case 'delete':
          bulkDelete(selectedPosts)
          toast.success(`Deleted ${selectedPosts.length} posts`)
          break
      }
      setSelectedPosts([])
    } catch (error) {
      toast.error('Failed to perform bulk action')
    }
  }

  const handleEdit = (post: Post) => {
    setSelectedPost(post)
    setShowEditModal(true)
  }

  const handleRequestChanges = (post: Post) => {
    setSelectedPost(post)
    setShowRequestChangesModal(true)
  }

  const handleArchive = async (post: Post) => {
    try {
      await updatePost(post.id, { archived: true })
      toast.success('Post archived')
    } catch (error) {
      toast.error('Failed to archive post')
    }
  }

  const handleDelete = async (post: Post) => {
    try {
      await deletePost(post.id)
      toast.success('Post deleted')
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const getStatusColor = (status: PostStatus) => {
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
    }
  }

  const getStatusBadge = (post: Post) => {
    return (
      <span
        className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          getStatusColor(post.status)
        )}
      >
        {post.status}
      </span>
    )
  }

  const renderPostCard = (post: Post) => {
    const isSelected = selectedPosts.includes(post.id)

    const cardContent = (
      <>
        <div className="flex items-start gap-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => {
              setSelectedPosts(prev =>
                checked
                  ? [...prev, post.id]
                  : prev.filter(id => id !== post.id)
              )
            }}
          />
          <div className="flex-1">
            <h3 className="font-medium">{post.title}</h3>
            {currentLayout !== 'compact' && (
              <>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {post.content}
                </p>
                {post.scheduledFor && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Scheduled for: {format(post.scheduledFor, 'PPP')}
                  </p>
                )}
              </>
            )}
            {post.tags.length > 0 && currentLayout !== 'compact' && (
              <div className="flex gap-2 mt-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(post)}
            {post.stats && post.status === 'published' && currentLayout !== 'compact' && (
              <div className="text-xs text-muted-foreground">
                {post.stats.likes} likes • {post.stats.comments} comments
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(post)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {post.status !== 'published' && (
                  <DropdownMenuItem onClick={() => handleRequestChanges(post)}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Request Changes
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleArchive(post)}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDelete(post)}
                  className="text-red-600"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </>
    )

    return currentLayout === 'grid' ? (
      <Card key={post.id} className="p-4 h-full">
        {cardContent}
      </Card>
    ) : (
      <Card key={post.id} className={cn("p-4", currentLayout === 'compact' && "py-2")}>
        {cardContent}
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search and Filter */}
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setFilter({ ...currentFilter, search: e.target.value })
              }}
              className="pl-8 w-full sm:w-[300px]"
            />
          </div>
          <Popover open={showFilterPopover} onOpenChange={setShowFilterPopover}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={currentFilter.status || 'all'}
                    onValueChange={(value) =>
                      setFilter({
                        ...currentFilter,
                        status: value === 'all' ? undefined : value as PostStatus,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Posts</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="needs-changes">Needs Changes</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !currentFilter.dateRange && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {currentFilter.dateRange ? (
                            `${format(currentFilter.dateRange.start, 'PP')} - ${format(currentFilter.dateRange.end, 'PP')}`
                          ) : (
                            "Pick a date range"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={{
                            from: currentFilter.dateRange?.start,
                            to: currentFilter.dateRange?.end,
                          }}
                          onSelect={(range) => {
                            if (range?.from && range?.to) {
                              setFilter({
                                ...currentFilter,
                                dateRange: {
                                  start: range.from,
                                  end: range.to,
                                },
                              })
                            }
                          }}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Memo Type</Label>
                  <Select
                    value={currentFilter.memoType || 'all'}
                    onValueChange={(value) =>
                      setFilter({
                        ...currentFilter,
                        memoType: value === 'all' ? undefined : value as 'voice' | 'chat' | 'ai_call',
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by memo type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="voice">Voice Memos</SelectItem>
                      <SelectItem value="chat">Chat Memos</SelectItem>
                      <SelectItem value="ai_call">AI Calls</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilter({})
                      setSearchQuery('')
                      setShowFilterPopover(false)
                    }}
                  >
                    Reset
                  </Button>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Filter name..."
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                    />
                    <Button onClick={handleSaveFilter}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* View Options */}
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {currentSort.field === 'date' && 'Date'}
                {currentSort.field === 'priority' && 'Priority'}
                {currentSort.field === 'engagement' && 'Engagement'}
                {' '}
                {currentSort.direction === 'asc' ? '↑' : '↓'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSort({ field: 'date', direction: 'desc' })}>
                Date (Newest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort({ field: 'date', direction: 'asc' })}>
                Date (Oldest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort({ field: 'engagement', direction: 'desc' })}>
                Most Engagement
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort({ field: 'engagement', direction: 'asc' })}>
                Least Engagement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex border rounded-md">
            <Button
              variant={currentLayout === 'compact' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setLayout('compact')}
              className="rounded-r-none"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={currentLayout === 'detailed' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setLayout('detailed')}
              className="rounded-none border-x"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={currentLayout === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setLayout('grid')}
              className="rounded-l-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="flex gap-2 items-center bg-muted p-2 rounded-md">
          <span className="text-sm text-muted-foreground">
            {selectedPosts.length} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedPosts([])}
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleBulkAction('status', 'draft')}>
                Set as Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('status', 'pending')}>
                Set as Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('status', 'scheduled')}>
                Set as Scheduled
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleBulkAction('archive')}>
                Archive Selected
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleBulkAction('delete')}
                className="text-red-600"
              >
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {savedFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setFilter(filter.filter)}
            >
              {filter.name}
              <X
                className="h-3 w-3 ml-1"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteSavedFilter(filter.id)
                }}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Posts Grid/List */}
      <div className={cn(
        "space-y-4",
        currentLayout === 'grid' && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      )}>
        {filteredPosts.map(renderPostCard)}
      </div>

      {/* Modals */}
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
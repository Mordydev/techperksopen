'use client'

import { useState } from 'react'
import { useContentStore, type Post } from '../stores/useContentStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, Clock, Tag as TagIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PostEditorModalProps {
  post?: Post
  isOpen: boolean
  onClose: () => void
}

export function PostEditorModal({ post, isOpen, onClose }: PostEditorModalProps) {
  const updatePost = useContentStore((state) => state.updatePost)
  const [title, setTitle] = useState(post?.title ?? '')
  const [scheduledFor, setScheduledFor] = useState<Date | undefined>(
    post?.scheduledFor ? new Date(post.scheduledFor) : undefined
  )
  const [status, setStatus] = useState<Post['status']>(post?.status ?? 'draft')
  const [tags, setTags] = useState<string[]>(post?.tags ?? [])
  const [newTag, setNewTag] = useState('')

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    try {
      if (post) {
        updatePost(post.id, {
          title: title.trim(),
          scheduledFor,
          status,
          tags,
        })
        toast.success('Post updated')
      }
      onClose()
    } catch (error) {
      toast.error('Failed to save post')
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()])
      }
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const canChangeStatus = (newStatus: Post['status']) => {
    if (!post) return true
    
    // Published posts can't change status
    if (post.status === 'published') return false
    
    // Can't publish without scheduling
    if (newStatus === 'published' && !scheduledFor) return false
    
    // Can't schedule without a date
    if (newStatus === 'scheduled' && !scheduledFor) return false

    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit Post' : 'Create Post'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
            />
          </div>

          {post?.source && (
            <div className="space-y-2">
              <Label>Source</Label>
              <div className="text-sm text-muted-foreground">
                {post.source.type === 'ai_call' && 'Generated from AI Call'}
                {post.source.type === 'voice_note' && 'Generated from Voice Note'}
                {post.source.type === 'chat_thread' && 'Generated from Chat Thread'}
                {' - '}
                {format(post.source.timestamp, 'PPp')}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value as Post['status'])}
              disabled={!canChangeStatus(status)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="needs-changes">Needs Changes</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Schedule</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !scheduledFor && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledFor ? format(scheduledFor, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledFor}
                  onSelect={setScheduledFor}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                  <span className="ml-1">×</span>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag and press Enter..."
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
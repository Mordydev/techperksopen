'use client'

import { useState } from 'react'
import { useContentStore, type Post } from '../stores/useContentStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface RequestChangesModalProps {
  post: Post
  isOpen: boolean
  onClose: () => void
}

export function RequestChangesModal({ post, isOpen, onClose }: RequestChangesModalProps) {
  const requestChanges = useContentStore((state) => state.requestChanges)
  const [notes, setNotes] = useState('')

  const handleSubmit = () => {
    if (notes.trim()) {
      requestChanges(post.id, notes.trim())
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Changes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="post-title" className="text-muted-foreground">
              Post Title
            </Label>
            <div id="post-title" className="font-medium">
              {post.title}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Revision Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the changes needed..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!notes.trim()}>
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
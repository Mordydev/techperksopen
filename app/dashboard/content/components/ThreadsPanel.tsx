'use client'

import { useState } from 'react'
import { useContentStore, type Thread } from '../stores/useContentStore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { MessageSquare, Mic, Archive, RotateCcw, MoreHorizontal, Plus, Tag, FolderPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function ThreadsPanel() {
  const threads = useContentStore((state) => state.threads)
  const createThread = useContentStore((state) => state.createThread)
  const updateThread = useContentStore((state) => state.updateThread)
  const [showNewThreadModal, setShowNewThreadModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newThreadType, setNewThreadType] = useState<'chat' | 'voice'>('chat')
  const [newTag, setNewTag] = useState('')
  const [selectedProject, setSelectedProject] = useState('')

  const activeThreads = threads.filter((thread) => !thread.isArchived)
  const archivedThreads = threads.filter((thread) => thread.isArchived)

  const handleCreateThread = () => {
    if (newThreadTitle.trim()) {
      createThread({
        title: newThreadTitle.trim(),
        type: newThreadType,
        createdAt: new Date(),
        tags: [],
        content: [],
      })
      setNewThreadTitle('')
      setNewThreadType('chat')
      setShowNewThreadModal(false)
      toast.success('Thread created')
    }
  }

  const handleArchiveThread = (thread: Thread) => {
    updateThread(thread.id, { isArchived: true })
    toast.success('Thread archived')
  }

  const handleUnarchiveThread = (thread: Thread) => {
    updateThread(thread.id, { isArchived: false })
    toast.success('Thread restored')
  }

  const handleAddTag = (thread: Thread) => {
    if (newTag.trim()) {
      const updatedTags = [...thread.tags, newTag.trim()]
      updateThread(thread.id, { tags: updatedTags })
      setNewTag('')
      setShowTagModal(false)
      setSelectedThread(null)
      toast.success('Tag added')
    }
  }

  const handleAssignProject = (thread: Thread) => {
    if (selectedProject) {
      updateThread(thread.id, { projectId: selectedProject })
      setSelectedProject('')
      setShowProjectModal(false)
      setSelectedThread(null)
      toast.success('Project assigned')
    }
  }

  const ThreadCard = ({ thread }: { thread: Thread }) => (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {thread.type === 'chat' ? (
              <MessageSquare className="h-4 w-4 text-blue-500" />
            ) : (
              <Mic className="h-4 w-4 text-green-500" />
            )}
            <h3 className="font-medium">{thread.title}</h3>
          </div>
          {thread.tags.length > 0 && (
            <div className="flex gap-2 mt-2">
              {thread.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {thread.projectId && (
            <div className="mt-2">
              <Badge variant="outline">Project: {thread.projectId}</Badge>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedThread(thread)
                setShowTagModal(true)
              }}
            >
              <Tag className="h-4 w-4 mr-2" />
              Add Tag
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedThread(thread)
                setShowProjectModal(true)
              }}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Assign Project
            </DropdownMenuItem>
            {thread.isArchived ? (
              <DropdownMenuItem onClick={() => handleUnarchiveThread(thread)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleArchiveThread(thread)}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Threads</h2>
        <Button onClick={() => setShowNewThreadModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Thread
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeThreads.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedThreads.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <div className="space-y-4">
            {activeThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="archived" className="mt-4">
          <div className="space-y-4">
            {archivedThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showNewThreadModal} onOpenChange={setShowNewThreadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Thread</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                placeholder="Enter thread title..."
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-4">
                <Button
                  variant={newThreadType === 'chat' ? 'default' : 'outline'}
                  onClick={() => setNewThreadType('chat')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                <Button
                  variant={newThreadType === 'voice' ? 'default' : 'outline'}
                  onClick={() => setNewThreadType('voice')}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Voice
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewThreadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateThread} disabled={!newThreadTitle.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTagModal} onOpenChange={setShowTagModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter tag name..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowTagModal(false)
              setSelectedThread(null)
            }}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedThread && handleAddTag(selectedThread)} 
              disabled={!newTag.trim()}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project-1">Project 1</SelectItem>
                  <SelectItem value="project-2">Project 2</SelectItem>
                  <SelectItem value="project-3">Project 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowProjectModal(false)
              setSelectedThread(null)
            }}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedThread && handleAssignProject(selectedThread)} 
              disabled={!selectedProject}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
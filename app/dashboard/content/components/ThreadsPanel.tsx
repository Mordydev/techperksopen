'use client'

import { useState } from 'react'
import { useContentStore } from '../stores/useContentStore'
import { Button } from '@/components/ui/button'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageSquare, Mic, Plus } from 'lucide-react'
import { CollapsibleThreadView } from './CollapsibleThreadView'
import { TagManagement } from './TagManagement'
import { ThreadOrganizer } from './ThreadOrganizer'

export function ThreadsPanel() {
  const threads = useContentStore((state) => state.threads)
  const createThread = useContentStore((state) => state.createThread)
  const updateThread = useContentStore((state) => state.updateThread)
  const deleteThread = useContentStore((state) => state.deleteThread)
  const [showNewThreadModal, setShowNewThreadModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [selectedThreads, setSelectedThreads] = useState<string[]>([])
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newThreadType, setNewThreadType] = useState<'chat' | 'voice'>('chat')
  const [selectedProject, setSelectedProject] = useState('')
  const [view, setView] = useState<'list' | 'organize'>('list')

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
    }
  }

  const handleSendMessage = (threadId: string, content: string, attachments?: File[]) => {
    const thread = threads.find((t) => t.id === threadId)
    if (!thread) return

    const newMessage = {
      id: crypto.randomUUID(),
      type: 'message' as const,
      content,
      timestamp: new Date(),
      sender: 'user' as const,
      attachments: attachments?.map(file => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      })),
    }

    updateThread(threadId, {
      content: [...thread.content, newMessage],
    })
  }

  const handleSaveVoiceMemo = (threadId: string, blob: Blob) => {
    const thread = threads.find((t) => t.id === threadId)
    if (!thread) return

    const newMemo = {
      id: crypto.randomUUID(),
      type: 'voice' as const,
      content: URL.createObjectURL(blob),
      timestamp: new Date(),
      sender: 'user' as const,
    }

    updateThread(threadId, {
      content: [...thread.content, newMemo],
    })
  }

  const handleManageTags = (threadId: string) => {
    setSelectedThread(threadId)
    setShowTagModal(true)
  }

  const handleAssignProject = (threadId: string) => {
    setSelectedThread(threadId)
    setShowProjectModal(true)
  }

  const handleArchiveThread = (threadId: string) => {
    updateThread(threadId, { isArchived: true })
  }

  const handleUnarchiveThread = (threadId: string) => {
    updateThread(threadId, { isArchived: false })
  }

  const handleTagsChange = (tags: string[]) => {
    if (selectedThread) {
      updateThread(selectedThread, { tags })
      setShowTagModal(false)
      setSelectedThread(null)
    }
  }

  const handleProjectAssign = () => {
    if (selectedThread && selectedProject) {
      updateThread(selectedThread, { projectId: selectedProject })
      setSelectedProject('')
      setShowProjectModal(false)
      setSelectedThread(null)
    }
  }

  const handleSelectThread = (threadId: string) => {
    setSelectedThreads((prev) =>
      prev.includes(threadId)
        ? prev.filter((id) => id !== threadId)
        : [...prev, threadId]
    )
  }

  const handleSelectAllThreads = (selected: boolean) => {
    setSelectedThreads(selected ? threads.map((t) => t.id) : [])
  }

  const handleBulkArchive = (threadIds: string[]) => {
    threadIds.forEach((id) => updateThread(id, { isArchived: true }))
    setSelectedThreads([])
  }

  const handleBulkUnarchive = (threadIds: string[]) => {
    threadIds.forEach((id) => updateThread(id, { isArchived: false }))
    setSelectedThreads([])
  }

  const handleBulkDelete = (threadIds: string[]) => {
    threadIds.forEach((id) => deleteThread(id))
    setSelectedThreads([])
  }

  const handleBulkAssignProject = (threadIds: string[], projectId: string) => {
    threadIds.forEach((id) => updateThread(id, { projectId }))
    setSelectedThreads([])
  }

  const handleBulkManageTags = (threadIds: string[]) => {
    if (threadIds.length === 1) {
      handleManageTags(threadIds[0])
    }
    // TODO: Implement bulk tag management for multiple threads
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Threads</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setView(view === 'list' ? 'organize' : 'list')}
          >
            {view === 'list' ? 'Organize' : 'View List'}
          </Button>
          <Button onClick={() => setShowNewThreadModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Thread
          </Button>
        </div>
      </div>

      {view === 'list' ? (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({activeThreads.length})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({archivedThreads.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            <div className="space-y-4">
              {activeThreads.map((thread) => (
                <CollapsibleThreadView
                  key={thread.id}
                  thread={thread}
                  onSendMessage={(content, attachments) =>
                    handleSendMessage(thread.id, content, attachments)
                  }
                  onSaveVoiceMemo={(blob) => handleSaveVoiceMemo(thread.id, blob)}
                  onManageTags={() => handleManageTags(thread.id)}
                  onAssignProject={() => handleAssignProject(thread.id)}
                  onArchive={() => handleArchiveThread(thread.id)}
                  onUnarchive={() => handleUnarchiveThread(thread.id)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="archived" className="mt-4">
            <div className="space-y-4">
              {archivedThreads.map((thread) => (
                <CollapsibleThreadView
                  key={thread.id}
                  thread={thread}
                  onSendMessage={(content, attachments) =>
                    handleSendMessage(thread.id, content, attachments)
                  }
                  onSaveVoiceMemo={(blob) => handleSaveVoiceMemo(thread.id, blob)}
                  onManageTags={() => handleManageTags(thread.id)}
                  onAssignProject={() => handleAssignProject(thread.id)}
                  onArchive={() => handleArchiveThread(thread.id)}
                  onUnarchive={() => handleUnarchiveThread(thread.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <ThreadOrganizer
          threads={threads}
          selectedThreads={selectedThreads}
          onSelectThread={handleSelectThread}
          onSelectAllThreads={handleSelectAllThreads}
          onBulkArchive={handleBulkArchive}
          onBulkUnarchive={handleBulkUnarchive}
          onBulkDelete={handleBulkDelete}
          onBulkAssignProject={handleBulkAssignProject}
          onBulkManageTags={handleBulkManageTags}
        />
      )}

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

      {selectedThread && (
        <>
          <Dialog open={showTagModal} onOpenChange={setShowTagModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Tags</DialogTitle>
              </DialogHeader>
              <TagManagement
                selectedTags={threads.find((t) => t.id === selectedThread)?.tags || []}
                onTagsChange={handleTagsChange}
                suggestedTags={[
                  { id: '1', name: 'Important', color: 'bg-red-500' },
                  { id: '2', name: 'Draft', color: 'bg-yellow-500' },
                  { id: '3', name: 'Review', color: 'bg-blue-500' },
                  { id: '4', name: 'Approved', color: 'bg-green-500' },
                ]}
                categories={[
                  { id: '1', name: 'Status', color: 'bg-blue-100' },
                  { id: '2', name: 'Priority', color: 'bg-red-100' },
                  { id: '3', name: 'Type', color: 'bg-green-100' },
                ]}
              />
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
                  onClick={handleProjectAssign}
                  disabled={!selectedProject}
                >
                  Assign
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
} 
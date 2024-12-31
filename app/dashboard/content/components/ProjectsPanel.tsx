'use client'

import { useState } from 'react'
import { useContentStore, type Thread } from '../stores/useContentStore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Folder, MoreHorizontal, Plus, MessageSquare, Mic } from 'lucide-react'
import { toast } from 'sonner'

type Project = {
  id: string
  name: string
  description?: string
  createdAt: Date
}

export function ProjectsPanel() {
  const threads = useContentStore((state) => state.threads)
  const [projects, setProjects] = useState<Project[]>([])
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: newProjectName.trim(),
        description: newProjectDescription.trim() || undefined,
        createdAt: new Date(),
      }
      setProjects([...projects, newProject])
      setNewProjectName('')
      setNewProjectDescription('')
      setShowNewProjectModal(false)
      toast.success('Project created')
    }
  }

  const getProjectThreads = (projectId: string) => {
    return threads.filter((thread) => thread.projectId === projectId)
  }

  const ProjectCard = ({ project }: { project: Project }) => {
    const projectThreads = getProjectThreads(project.id)
    const chatThreads = projectThreads.filter((t) => t.type === 'chat')
    const voiceThreads = projectThreads.filter((t) => t.type === 'voice')

    return (
      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-blue-500" />
              <h3 className="font-medium">{project.name}</h3>
            </div>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {project.description}
              </p>
            )}
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                {chatThreads.length}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mic className="h-4 w-4" />
                {voiceThreads.length}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Generate Post</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Projects</h2>
        <Button onClick={() => setShowNewProjectModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Enter project description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProjectModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Archive,
  ChevronDown,
  FolderPlus,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Tag,
  Trash2,
} from 'lucide-react'
import { Thread } from '../stores/useContentStore'
import { cn } from '@/lib/utils'

interface ThreadOrganizerProps {
  threads: Thread[]
  selectedThreads: string[]
  onSelectThread: (threadId: string) => void
  onSelectAllThreads: (selected: boolean) => void
  onBulkArchive: (threadIds: string[]) => void
  onBulkUnarchive: (threadIds: string[]) => void
  onBulkDelete: (threadIds: string[]) => void
  onBulkAssignProject: (threadIds: string[], projectId: string) => void
  onBulkManageTags: (threadIds: string[]) => void
  className?: string
}

export function ThreadOrganizer({
  threads,
  selectedThreads,
  onSelectThread,
  onSelectAllThreads,
  onBulkArchive,
  onBulkUnarchive,
  onBulkDelete,
  onBulkAssignProject,
  onBulkManageTags,
  className,
}: ThreadOrganizerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState('')

  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleProjectAssign = () => {
    if (selectedThreads.length > 0 && selectedProject) {
      onBulkAssignProject(selectedThreads, selectedProject)
      setSelectedProject('')
      setShowProjectModal(false)
    }
  }

  const isAllSelected = selectedThreads.length === threads.length
  const isAnySelected = selectedThreads.length > 0

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search threads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        
        {isAnySelected && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Bulk Actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {selectedThreads.length} thread{selectedThreads.length === 1 ? '' : 's'} selected
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onBulkManageTags(selectedThreads)}>
                <Tag className="mr-2 h-4 w-4" />
                Manage Tags
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowProjectModal(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Assign Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onBulkArchive(selectedThreads)}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkUnarchive(selectedThreads)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onBulkDelete(selectedThreads)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAllThreads(e.target.checked)}
                  className="h-4 w-4"
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredThreads.map((thread) => (
              <TableRow key={thread.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedThreads.includes(thread.id)}
                    onChange={() => onSelectThread(thread.id)}
                    className="h-4 w-4"
                  />
                </TableCell>
                <TableCell>{thread.title}</TableCell>
                <TableCell className="capitalize">{thread.type}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {thread.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {thread.projectId && (
                    <Badge variant="outline">{thread.projectId}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={thread.isArchived ? 'secondary' : 'default'}
                  >
                    {thread.isArchived ? 'Archived' : 'Active'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onBulkManageTags([thread.id])}>
                        <Tag className="mr-2 h-4 w-4" />
                        Manage Tags
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedProject('')
                        setShowProjectModal(true)
                        onSelectThread(thread.id)
                      }}>
                        <FolderPlus className="mr-2 h-4 w-4" />
                        Assign Project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {thread.isArchived ? (
                        <DropdownMenuItem onClick={() => onBulkUnarchive([thread.id])}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onBulkArchive([thread.id])}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onBulkDelete([thread.id])}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProjectModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleProjectAssign} disabled={!selectedProject}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
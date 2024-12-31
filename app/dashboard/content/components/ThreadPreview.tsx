'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MessageSquare,
  Mic,
  MoreHorizontal,
  Tag,
  FolderPlus,
  Archive,
  RotateCcw,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Thread } from '../stores/useContentStore'
import { format, isToday, isYesterday } from 'date-fns'

interface ThreadPreviewProps {
  thread: Thread
  onManageTags: () => void
  onAssignProject: () => void
  onArchive: () => void
  onUnarchive: () => void
  className?: string
}

export function ThreadPreview({
  thread,
  onManageTags,
  onAssignProject,
  onArchive,
  onUnarchive,
  className,
}: ThreadPreviewProps) {
  const lastMessage = thread.content[thread.content.length - 1]
  
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'p')
    }
    if (isYesterday(date)) {
      return 'Yesterday'
    }
    return format(date, 'MMM d')
  }

  const getPreviewText = () => {
    if (!lastMessage) return 'No messages yet'
    
    if (lastMessage.type === 'message') {
      return lastMessage.content.length > 50
        ? `${lastMessage.content.slice(0, 50)}...`
        : lastMessage.content
    }
    
    return 'Voice memo'
  }

  return (
    <div className={cn('flex items-center justify-between py-2 px-4', className)}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          thread.type === 'chat' ? 'bg-blue-100' : 'bg-green-100'
        )}>
          {thread.type === 'chat' ? (
            <MessageSquare className="h-5 w-5 text-blue-500" />
          ) : (
            <Mic className="h-5 w-5 text-green-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{thread.title}</h3>
            {thread.projectId && (
              <Badge variant="outline" className="hidden sm:inline-flex">
                {thread.projectId}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="truncate">{getPreviewText()}</span>
            {lastMessage && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(lastMessage.timestamp)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        {thread.tags.length > 0 && (
          <div className="hidden sm:flex gap-1">
            {thread.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {thread.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{thread.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onManageTags}>
              <Tag className="h-4 w-4 mr-2" />
              Manage Tags
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAssignProject}>
              <FolderPlus className="h-4 w-4 mr-2" />
              Assign Project
            </DropdownMenuItem>
            {thread.isArchived ? (
              <DropdownMenuItem onClick={onUnarchive}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
} 
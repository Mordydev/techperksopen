'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Mic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Thread } from '../stores/useContentStore'
import { ChatThreadInterface } from './ChatThreadInterface'
import { VoiceMemoRecorder } from './VoiceMemoRecorder'
import { VoiceMemoPlayer } from './VoiceMemoPlayer'
import { ThreadPreview } from './ThreadPreview'
import { useMediaQuery } from '@/hooks/use-media-query'

interface CollapsibleThreadViewProps {
  thread: Thread
  onSendMessage: (content: string, attachments?: File[]) => void
  onSaveVoiceMemo: (blob: Blob) => void
  onManageTags: () => void
  onAssignProject: () => void
  onArchive: () => void
  onUnarchive: () => void
  className?: string
}

export function CollapsibleThreadView({
  thread,
  onSendMessage,
  onSaveVoiceMemo,
  onManageTags,
  onAssignProject,
  onArchive,
  onUnarchive,
  className,
}: CollapsibleThreadViewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const ExpandedContent = () => (
    <div className="p-4 border-t">
      {thread.type === 'chat' ? (
        <ChatThreadInterface
          messages={thread.content.map((c) => ({
            id: c.id,
            content: c.content,
            sender: c.sender,
            timestamp: c.timestamp,
            attachments: c.attachments,
          }))}
          onSendMessage={onSendMessage}
          className="h-[400px]"
        />
      ) : (
        <div className="space-y-4">
          {!isRecording ? (
            <Button
              onClick={() => setIsRecording(true)}
              className="w-full"
            >
              <Mic className="h-4 w-4 mr-2" />
              Record Voice Memo
            </Button>
          ) : (
            <VoiceMemoRecorder
              onSave={(blob) => {
                onSaveVoiceMemo(blob)
                setIsRecording(false)
              }}
              onCancel={() => setIsRecording(false)}
            />
          )}
          
          {thread.content
            .filter((c) => c.type === 'voice')
            .map((memo) => (
              <VoiceMemoPlayer
                key={memo.id}
                audioUrl={memo.content}
              />
            ))}
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <Card className={className}>
        <Sheet>
          <SheetTrigger asChild>
            <div className="cursor-pointer">
              <ThreadPreview
                thread={thread}
                onManageTags={onManageTags}
                onAssignProject={onAssignProject}
                onArchive={onArchive}
                onUnarchive={onUnarchive}
              />
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>{thread.title}</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <ExpandedContent />
            </div>
          </SheetContent>
        </Sheet>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
      >
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer">
            <ThreadPreview
              thread={thread}
              onManageTags={onManageTags}
              onAssignProject={onAssignProject}
              onArchive={onArchive}
              onUnarchive={onUnarchive}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ExpandedContent />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
} 
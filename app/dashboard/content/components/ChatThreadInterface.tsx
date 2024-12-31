'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar } from '@/components/ui/avatar'
import { Send, Paperclip, Smile } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  attachments?: Array<{
    id: string
    name: string
    url: string
    type: string
  }>
}

interface ChatThreadInterfaceProps {
  messages: Message[]
  onSendMessage: (content: string, attachments?: File[]) => void
  className?: string
}

export function ChatThreadInterface({
  messages,
  onSendMessage,
  className,
}: ChatThreadInterfaceProps) {
  const [newMessage, setNewMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage.trim(), attachments)
      setNewMessage('')
      setAttachments([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const MessageBubble = ({ message }: { message: Message }) => {
    const isUser = message.sender === 'user'

    return (
      <div
        className={cn(
          'flex gap-3 mb-4',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <Avatar className="h-8 w-8">
          <div className={cn(
            'w-full h-full rounded-full',
            isUser ? 'bg-blue-500' : 'bg-green-500'
          )} />
        </Avatar>
        
        <div className={cn(
          'flex flex-col max-w-[70%]',
          isUser ? 'items-end' : 'items-start'
        )}>
          <div
            className={cn(
              'rounded-lg p-3',
              isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'block text-sm underline',
                      isUser ? 'text-white' : 'text-blue-500'
                    )}
                  >
                    {attachment.name}
                  </a>
                ))}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground mt-1">
            {format(message.timestamp, 'p')}
          </span>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn('flex flex-col h-[600px]', className)}>
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="border-t p-4 space-y-4">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
              >
                <span className="text-sm truncate max-w-[200px]">
                  {file.name}
                </span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Type a message..."
            className="min-h-[80px]"
          />
          
          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 w-10"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleSend}
              size="icon"
              className="h-10 w-10"
              disabled={!newMessage.trim() && attachments.length === 0}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
} 
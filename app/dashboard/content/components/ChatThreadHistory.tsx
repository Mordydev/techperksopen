'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Calendar, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, isToday, isYesterday, isSameDay } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

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

interface ChatThreadHistoryProps {
  messages: Message[]
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  className?: string
}

export function ChatThreadHistory({
  messages,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  className,
}: ChatThreadHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [filteredMessages, setFilteredMessages] = useState<Message[]>(messages)
  const [groupedMessages, setGroupedMessages] = useState<
    Array<{ date: Date; messages: Message[] }>
  >([])
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Filter messages based on search query and date range
    let filtered = messages
    
    if (searchQuery) {
      filtered = filtered.filter((message) =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (dateRange?.from) {
      filtered = filtered.filter(
        (message) => message.timestamp >= dateRange.from!
      )
    }
    
    if (dateRange?.to) {
      filtered = filtered.filter(
        (message) => message.timestamp <= dateRange.to!
      )
    }
    
    setFilteredMessages(filtered)
  }, [messages, searchQuery, dateRange])

  useEffect(() => {
    // Group messages by date
    const groups: { [key: string]: Message[] } = {}
    
    filteredMessages.forEach((message) => {
      const date = new Date(message.timestamp)
      date.setHours(0, 0, 0, 0)
      const key = date.toISOString()
      
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(message)
    })
    
    const sortedGroups = Object.entries(groups)
      .map(([dateStr, messages]) => ({
        date: new Date(dateStr),
        messages: messages.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        ),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
    
    setGroupedMessages(sortedGroups)
  }, [filteredMessages])

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore?.()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(loaderRef.current)

    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore])

  const formatMessageDate = (date: Date) => {
    if (isToday(date)) {
      return 'Today'
    }
    if (isYesterday(date)) {
      return 'Yesterday'
    }
    return format(date, 'MMMM d, yyyy')
  }

  const MessageGroup = ({
    date,
    messages,
  }: {
    date: Date
    messages: Message[]
  }) => (
    <div className="space-y-4">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2">
        <div className="text-sm font-medium text-muted-foreground">
          {formatMessageDate(date)}
        </div>
      </div>
      
      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className="p-4">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'w-2 h-2 rounded-full mt-2',
                  message.sender === 'user' ? 'bg-blue-500' : 'bg-green-500'
                )}
              />
              <div className="flex-1 space-y-1">
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {attachment.name}
                      </a>
                    ))}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {format(message.timestamp, 'p')}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} -{' '}
                    {format(dateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-8">
          {groupedMessages.map(({ date, messages }) => (
            <MessageGroup key={date.toISOString()} date={date} messages={messages} />
          ))}
          
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-2 h-2 rounded-full mt-2" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {hasMore && <div ref={loaderRef} className="h-8" />}
          
          {!isLoading && filteredMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-1">No messages found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or date range
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
} 
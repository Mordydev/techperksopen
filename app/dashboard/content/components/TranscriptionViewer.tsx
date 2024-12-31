'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Search, Download, Copy, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface TranscriptSegment {
  id: string
  text: string
  startTime: number // in seconds
  endTime: number // in seconds
  speaker?: string
}

interface TranscriptionViewerProps {
  audioUrl: string
  transcript: TranscriptSegment[]
  onTimeUpdate?: (time: number) => void
  className?: string
}

export function TranscriptionViewer({
  audioUrl,
  transcript,
  onTimeUpdate,
  className,
}: TranscriptionViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedSegments, setHighlightedSegments] = useState<string[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      onTimeUpdate?.(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onTimeUpdate])

  useEffect(() => {
    if (!searchQuery) {
      setHighlightedSegments([])
      return
    }

    const query = searchQuery.toLowerCase()
    const matches = transcript
      .filter((segment) => segment.text.toLowerCase().includes(query))
      .map((segment) => segment.id)
    
    setHighlightedSegments(matches)
  }, [searchQuery, transcript])

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const jumpToSegment = (startTime: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = startTime
    setCurrentTime(startTime)
  }

  const copyTranscript = async () => {
    const text = transcript.map((segment) => segment.text).join(' ')
    await navigator.clipboard.writeText(text)
    toast.success('Transcript copied to clipboard')
  }

  const downloadTranscript = () => {
    const text = transcript.map((segment) => {
      const time = new Date(segment.startTime * 1000).toISOString().substr(11, 8)
      return `[${time}] ${segment.speaker ? segment.speaker + ': ' : ''}${segment.text}`
    }).join('\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcript.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className={cn('flex flex-col h-[600px]', className)}>
      <div className="border-b p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="h-8 w-8"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {formatTime(currentTime)}
          </div>
          
          <div className="flex-1" />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={copyTranscript}
            className="h-8 w-8"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={downloadTranscript}
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div ref={transcriptRef} className="space-y-4">
          {transcript.map((segment) => {
            const isActive = currentTime >= segment.startTime && currentTime < segment.endTime
            const isHighlighted = highlightedSegments.includes(segment.id)

            return (
              <div
                key={segment.id}
                className={cn(
                  'p-2 rounded transition-colors cursor-pointer hover:bg-accent',
                  isActive && 'bg-accent',
                  isHighlighted && 'ring-2 ring-primary'
                )}
                onClick={() => jumpToSegment(segment.startTime)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(segment.startTime)}
                  </span>
                  {segment.speaker && (
                    <span className="text-xs font-medium">
                      {segment.speaker}
                    </span>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{segment.text}</p>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      <audio ref={audioRef} src={audioUrl} className="hidden" />
    </Card>
  )
} 
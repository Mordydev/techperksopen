'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, Square, Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface VoiceMemoRecorderProps {
  onSave: (blob: Blob) => void
  onCancel: () => void
}

export function VoiceMemoRecorder({ onSave, onCancel }: VoiceMemoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Set up audio context and analyser
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256
      
      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current.start()
      setIsRecording(true)
      visualize()
    } catch (err) {
      toast.error('Could not access microphone', {
        description: 'Please ensure you have granted microphone permissions.',
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }

  const visualize = () => {
    if (!canvasRef.current || !analyserRef.current) return
    
    const canvas = canvasRef.current
    const canvasCtx = canvas.getContext('2d')
    if (!canvasCtx) return
    
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const draw = () => {
      if (!isRecording) return
      
      animationFrameRef.current = requestAnimationFrame(draw)
      analyserRef.current!.getByteTimeDomainData(dataArray)
      
      canvasCtx.fillStyle = 'rgb(249, 250, 251)'
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
      canvasCtx.lineWidth = 2
      canvasCtx.strokeStyle = 'rgb(37, 99, 235)'
      canvasCtx.beginPath()
      
      const sliceWidth = canvas.width / bufferLength
      let x = 0
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2
        
        if (i === 0) {
          canvasCtx.moveTo(x, y)
        } else {
          canvasCtx.lineTo(x, y)
        }
        
        x += sliceWidth
      }
      
      canvasCtx.lineTo(canvas.width, canvas.height / 2)
      canvasCtx.stroke()
    }
    
    draw()
  }

  const handleSave = () => {
    if (audioBlob) {
      onSave(audioBlob)
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full h-24 bg-gray-50 rounded-md"
        width={600}
        height={96}
      />
      
      <div className="flex justify-center gap-4">
        {!isRecording && !audioBlob && (
          <Button onClick={startRecording}>
            <Mic className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        )}
        
        {isRecording && (
          <Button variant="destructive" onClick={stopRecording}>
            <Square className="h-4 w-4 mr-2" />
            Stop Recording
          </Button>
        )}
        
        {audioBlob && (
          <>
            <Button variant="default" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Discard
            </Button>
          </>
        )}
      </div>
    </Card>
  )
} 
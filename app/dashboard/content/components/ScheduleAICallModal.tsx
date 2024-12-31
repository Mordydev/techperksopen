'use client'

import { useState } from 'react'
import { useContentStore } from '../stores/useContentStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format, isBefore, addMinutes, startOfToday } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ScheduleAICallModalProps {
  isOpen: boolean
  onClose: () => void
}

type TimeSlot = {
  hour: string
  minute: string
}

export function ScheduleAICallModal({ isOpen, onClose }: ScheduleAICallModalProps) {
  const scheduleAICall = useContentStore((state) => state.scheduleAICall)
  const [date, setDate] = useState<Date>()
  const [timeSlot, setTimeSlot] = useState<TimeSlot>({ hour: '09', minute: '00' })
  const [notes, setNotes] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string>('')

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes = ['00', '15', '30', '45']

  const validateDateTime = (selectedDate: Date) => {
    const now = new Date()
    if (isBefore(selectedDate, now)) {
      throw new Error('Cannot schedule a call in the past')
    }
  }

  const getSelectedDateTime = () => {
    if (!date) return null
    const dateTime = new Date(date)
    dateTime.setHours(parseInt(timeSlot.hour))
    dateTime.setMinutes(parseInt(timeSlot.minute))
    return dateTime
  }

  const handleSchedule = () => {
    try {
      const dateTime = getSelectedDateTime()
      if (!dateTime) {
        setError('Please select a date and time')
        return
      }

      validateDateTime(dateTime)
      setError('')
      setShowConfirm(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid date/time selection')
    }
  }

  const handleConfirm = () => {
    const dateTime = getSelectedDateTime()
    if (!dateTime) return

    try {
      scheduleAICall(dateTime, notes.trim() || undefined)
      toast.success('AI Call scheduled successfully', {
        description: `Scheduled for ${format(dateTime, 'PPP p')}`,
      })
      onClose()
    } catch (err) {
      toast.error('Failed to schedule AI Call', {
        description: err instanceof Error ? err.message : 'Please try again',
      })
    }
  }

  const minDate = startOfToday()
  const maxDate = addMinutes(new Date(), 60 * 24 * 14) // 2 weeks from now

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule AI Call</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date: Date) =>
                      isBefore(date, minDate) || isBefore(maxDate, date)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hour</Label>
                <Select
                  value={timeSlot.hour}
                  onValueChange={(value) =>
                    setTimeSlot((prev) => ({ ...prev, hour: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Minute</Label>
                <Select
                  value={timeSlot.minute}
                  onValueChange={(value) =>
                    setTimeSlot((prev) => ({ ...prev, minute: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Minute" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        :{minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes for the AI call..."
                className="min-h-[100px]"
              />
            </div>

            {error && (
              <div className="text-sm font-medium text-destructive">{error}</div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={!date}>
              Schedule Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm AI Call Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              {date && (
                <>
                  Are you sure you want to schedule an AI call for{' '}
                  {format(getSelectedDateTime()!, 'PPP')} at{' '}
                  {format(getSelectedDateTime()!, 'p')}?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 
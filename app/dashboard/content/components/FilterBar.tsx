'use client'

import { useState } from 'react'
import { useFilter, type MemoType, type PostStatus, type FilterState } from '../contexts/FilterContext'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Filter, Save, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { DatePicker } from "@/components/ui/date-picker"
import { type DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  onSaveFilter?: (name: string, filter: any) => void
  showDateRange?: boolean
  showSearch?: boolean
  className?: string
}

export function FilterBar({
  onSaveFilter,
  showDateRange = true,
  showSearch = true,
  className = '',
}: FilterBarProps) {
  const { postFilter, setPostFilter, syncFilters } = useFilter()
  const [showFilterPopover, setShowFilterPopover] = useState(false)
  const [filterName, setFilterName] = useState('')

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setPostFilter({
      ...postFilter,
      ...updates,
    })
    syncFilters()
  }

  const handleSaveFilter = () => {
    if (!onSaveFilter) return
    if (!filterName.trim()) {
      toast.error('Filter name is required')
      return
    }
    onSaveFilter(filterName.trim(), postFilter)
    setFilterName('')
    setShowFilterPopover(false)
    toast.success('Filter saved')
  }

  const dateRange = postFilter.dateRange
    ? {
        from: postFilter.dateRange.start,
        to: postFilter.dateRange.end,
      }
    : undefined

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Select
        value={postFilter.status || 'all'}
        onValueChange={(value) => {
          handleFilterChange({
            status: value === 'all' ? undefined : value as PostStatus,
          })
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Posts</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="needs-changes">Needs Changes</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="published">Published</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={postFilter.memoType || 'all'}
        onValueChange={(value) => {
          handleFilterChange({
            memoType: value === 'all' ? undefined : value as MemoType,
          })
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="voice_note">Voice Memos</SelectItem>
          <SelectItem value="chat_thread">Chat Memos</SelectItem>
          <SelectItem value="ai_call">AI Calls</SelectItem>
        </SelectContent>
      </Select>

      {showDateRange && (
        <DatePicker
          mode="range"
          selected={dateRange}
          onSelect={(range: DateRange | undefined) => {
            if (range?.from && range?.to) {
              handleFilterChange({
                dateRange: {
                  start: range.from,
                  end: range.to,
                },
              })
            }
          }}
          placeholder="Filter by date range"
          numberOfMonths={2}
          showWeekNumber={false}
          weekStartsOn={1}
          className="w-[300px]"
          captionLayout="dropdown"
          fixedWeeks
          fromDate={new Date(2020, 0, 1)}
          defaultMonth={new Date()}
        />
      )}

      {showSearch && (
        <Input
          placeholder="Search..."
          value={postFilter.search}
          onChange={(e) => {
            handleFilterChange({
              search: e.target.value,
            })
          }}
          className="w-[200px]"
        />
      )}

      {onSaveFilter && (
        <Popover open={showFilterPopover} onOpenChange={setShowFilterPopover}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Filter Name</Label>
                <Input
                  placeholder="My Filter"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveFilter} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Filter
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
} 
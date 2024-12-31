'use client'

import { useContentStore, type PostSort } from '../stores/useContentStore'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface SortBarProps {
  className?: string
}

export function SortBar({ className = '' }: SortBarProps) {
  const { currentSort, setSort } = useContentStore()

  const toggleDirection = () => {
    setSort({
      ...currentSort,
      direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select
        value={currentSort.field}
        onValueChange={(value) => {
          setSort({
            ...currentSort,
            field: value as PostSort['field'],
          })
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="engagement">Engagement</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={toggleDirection}
        className="h-10 w-10"
      >
        {currentSort.direction === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
} 
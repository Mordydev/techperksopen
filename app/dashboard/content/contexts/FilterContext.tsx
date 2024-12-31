'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type MemoType = 'voice_note' | 'chat_thread' | 'ai_call'
export type PostStatus = 'pending' | 'draft' | 'needs-changes' | 'scheduled' | 'published'

export type FilterState = {
  status?: PostStatus
  memoType?: MemoType
  projectId?: string
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  search: string
}

type FilterContextType = {
  postFilter: FilterState
  setPostFilter: (filter: FilterState) => void
  syncFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [postFilter, setPostFilter] = useState<FilterState>({
    search: '',
  })

  const syncFilters = () => {
    // This function will be called whenever filters are updated
    // to ensure all components using the filters are in sync
  }

  return (
    <FilterContext.Provider value={{ postFilter, setPostFilter, syncFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
} 
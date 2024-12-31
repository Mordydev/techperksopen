import { create } from 'zustand'
import { StateCreator } from 'zustand'
import { MemoType } from '../contexts/FilterContext'

export type PostStatus = 'pending' | 'draft' | 'needs-changes' | 'scheduled' | 'published'

export type PostSource = {
  type: MemoType
  id: string
  timestamp: Date
}

export type PostPriority = 'high' | 'medium' | 'low'

export type Post = {
  id: string
  title: string
  content: string
  status: PostStatus
  priority?: PostPriority
  scheduledFor?: Date
  tags: string[]
  stats?: {
    likes: number
    comments: number
  }
  source?: PostSource
  projectId?: string
  revisionNotes?: string
  archived?: boolean
}

export type Thread = {
  id: string
  title: string
  type: 'chat' | 'voice'
  content: Array<{
    id: string
    type: 'message' | 'voice'
    content: string
    timestamp: Date
    sender: 'user' | 'ai'
    attachments?: Array<{
      id: string
      name: string
      url: string
      type: string
    }>
  }>
  tags: string[]
  createdAt: Date
  isArchived?: boolean
  projectId?: string
}

export type AICall = {
  id: string
  scheduledFor: Date
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    interval: number
    endDate?: Date
  }
  timezone?: string
}

export type PostFilter = {
  dateRange?: {
    start: Date
    end: Date
  }
  memoType?: MemoType
  projectId?: string
  status?: PostStatus
  tags?: string[]
  search?: string
}

export type PostSort = {
  field: 'date' | 'priority' | 'engagement'
  direction: 'asc' | 'desc'
}

export type ViewLayout = 'compact' | 'detailed' | 'grid'

export type CalendarSettings = {
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
  workingHours: {
    start: number
    end: number
  }
  timezone: string
  showWeekNumbers: boolean
  defaultView: 'week' | 'month'
}

export type CalendarFilter = {
  memoType?: MemoType
  projectId?: string
  status?: PostStatus
  tags?: string[]
}

interface ContentStore {
  posts: Post[]
  threads: Thread[]
  aiCalls: AICall[]
  // Post Actions
  createPost: (post: Omit<Post, 'id'>) => void
  updatePost: (id: string, updates: Partial<Post>) => void
  deletePost: (id: string) => void
  requestChanges: (id: string, notes: string) => void
  schedulePost: (id: string, date: Date) => void
  publishPost: (id: string) => void
  // Thread Actions
  createThread: (thread: Omit<Thread, 'id'>) => void
  updateThread: (id: string, updates: Partial<Thread>) => void
  archiveThread: (id: string) => void
  // AI Call Actions
  scheduleAICall: (date: Date, notes?: string) => void
  cancelAICall: (id: string) => void
  // Filter and Sort State
  currentFilter: PostFilter
  currentSort: PostSort
  currentLayout: ViewLayout
  savedFilters: { id: string; name: string; filter: PostFilter }[]
  // Filter and Sort Actions
  setFilter: (filter: PostFilter) => void
  setSort: (sort: PostSort) => void
  setLayout: (layout: ViewLayout) => void
  saveFilter: (name: string, filter: PostFilter) => void
  deleteSavedFilter: (id: string) => void
  // Bulk Actions
  bulkUpdateStatus: (ids: string[], status: PostStatus) => void
  bulkAssignProject: (ids: string[], projectId: string) => void
  bulkArchive: (ids: string[]) => void
  bulkDelete: (ids: string[]) => void
  // Calendar State
  calendarSettings: CalendarSettings
  calendarFilter: CalendarFilter
  // Calendar Actions
  setCalendarSettings: (settings: Partial<CalendarSettings>) => void
  setCalendarFilter: (filter: CalendarFilter) => void
  deleteThread: (id: string) => void
}

// Mock Data
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Product Launch Strategy',
    content: 'Key points from our AI strategy call discussing the upcoming product launch...',
    status: 'scheduled',
    priority: 'high',
    scheduledFor: new Date('2024-02-20T10:00:00'),
    tags: ['product', 'launch', 'strategy'],
    source: {
      type: 'ai_call',
      id: 'call_1',
      timestamp: new Date('2024-02-15T10:00:00')
    },
    projectId: 'thread_1'
  },
  {
    id: '2',
    title: 'Customer Feedback Summary',
    content: 'Voice memo from the customer feedback session...',
    status: 'draft',
    priority: 'medium',
    tags: ['feedback', 'customer'],
    source: {
      type: 'voice_note',
      id: 'memo_1',
      timestamp: new Date('2024-02-14T15:30:00')
    },
    projectId: 'thread_2'
  },
  {
    id: '3',
    title: 'Team Brainstorming Results',
    content: 'Chat discussion about new feature ideas...',
    status: 'pending',
    tags: ['features', 'brainstorming'],
    source: {
      type: 'chat_thread',
      id: 'chat_1',
      timestamp: new Date('2024-02-13T14:00:00')
    },
    projectId: 'thread_1'
  }
]

const mockThreads: Thread[] = [
  {
    id: 'thread_1',
    title: 'Q1 Product Launch',
    type: 'chat',
    content: [
      {
        id: 'message_1',
        type: 'message',
        content: 'Initial planning discussion',
        timestamp: new Date('2024-02-10T09:00:00'),
        sender: 'user'
      },
      {
        id: 'message_2',
        type: 'message',
        content: 'Feature prioritization',
        timestamp: new Date('2024-02-10T09:30:00'),
        sender: 'ai'
      },
      {
        id: 'message_3',
        type: 'message',
        content: 'Marketing strategy',
        timestamp: new Date('2024-02-10T10:00:00'),
        sender: 'ai'
      }
    ],
    tags: ['product', 'launch', 'Q1'],
    createdAt: new Date('2024-02-10T09:00:00'),
    isArchived: false
  },
  {
    id: 'thread_2',
    title: 'Customer Research',
    type: 'voice',
    content: [
      {
        id: 'voice_1',
        type: 'voice',
        content: 'Interview with John Doe',
        timestamp: new Date('2024-02-12T11:00:00'),
        sender: 'ai'
      },
      {
        id: 'voice_2',
        type: 'voice',
        content: 'Feedback session notes',
        timestamp: new Date('2024-02-12T11:30:00'),
        sender: 'ai'
      },
      {
        id: 'voice_3',
        type: 'voice',
        content: 'Action items',
        timestamp: new Date('2024-02-12T12:00:00'),
        sender: 'ai'
      }
    ],
    tags: ['research', 'customer', 'feedback'],
    createdAt: new Date('2024-02-12T11:00:00'),
    isArchived: false
  }
]

const mockAICalls: AICall[] = [
  {
    id: 'call_1',
    scheduledFor: new Date('2024-02-20T10:00:00'),
    status: 'scheduled',
    notes: 'Product launch strategy discussion',
    recurrence: {
      frequency: 'weekly',
      interval: 1,
      endDate: new Date('2024-03-20T10:00:00')
    },
    timezone: 'America/New_York'
  },
  {
    id: 'call_2',
    scheduledFor: new Date('2024-02-22T15:00:00'),
    status: 'scheduled',
    notes: 'Marketing campaign planning',
    timezone: 'America/New_York'
  }
]

const createContentStore: StateCreator<ContentStore> = (set) => ({
  posts: mockPosts,
  threads: mockThreads,
  aiCalls: mockAICalls,

  // Post Actions
  createPost: (post: Omit<Post, 'id'>) =>
    set((state: ContentStore) => ({
      posts: [...state.posts, { ...post, id: crypto.randomUUID() }],
    })),

  updatePost: (id: string, updates: Partial<Post>) =>
    set((state: ContentStore) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, ...updates } : post
      ),
    })),

  deletePost: (id: string) =>
    set((state: ContentStore) => ({
      posts: state.posts.filter((post) => post.id !== id),
    })),

  requestChanges: (id: string, notes: string) =>
    set((state: ContentStore) => ({
      posts: state.posts.map((post) =>
        post.id === id
          ? { ...post, status: 'needs-changes' as PostStatus, revisionNotes: notes }
          : post
      ),
    })),

  schedulePost: (id: string, date: Date) =>
    set((state: ContentStore) => ({
      posts: state.posts.map((post) =>
        post.id === id
          ? { ...post, status: 'scheduled' as PostStatus, scheduledFor: date }
          : post
      ),
    })),

  publishPost: (id: string) =>
    set((state: ContentStore) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, status: 'published' as PostStatus } : post
      ),
    })),

  // Thread Actions
  createThread: (thread: Omit<Thread, 'id'>) =>
    set((state: ContentStore) => ({
      threads: [...state.threads, { ...thread, id: crypto.randomUUID() }],
    })),

  updateThread: (id: string, updates: Partial<Thread>) =>
    set((state: ContentStore) => ({
      threads: state.threads.map((thread) =>
        thread.id === id ? { ...thread, ...updates } : thread
      ),
    })),

  archiveThread: (id: string) =>
    set((state: ContentStore) => ({
      threads: state.threads.map((thread) =>
        thread.id === id ? { ...thread, isArchived: true } : thread
      ),
    })),

  // AI Call Actions
  scheduleAICall: (date: Date, notes?: string) =>
    set((state: ContentStore) => ({
      aiCalls: [
        ...state.aiCalls,
        {
          id: crypto.randomUUID(),
          scheduledFor: date,
          status: 'scheduled',
          notes,
        },
      ],
    })),

  cancelAICall: (id: string) =>
    set((state: ContentStore) => ({
      aiCalls: state.aiCalls.map((call) =>
        call.id === id ? { ...call, status: 'cancelled' } : call
      ),
    })),

  // Initial Filter and Sort State
  currentFilter: {},
  currentSort: { field: 'date', direction: 'desc' },
  currentLayout: 'detailed',
  savedFilters: [],

  // Filter and Sort Actions
  setFilter: (filter: PostFilter) =>
    set((state) => ({ currentFilter: filter })),
    
  setSort: (sort: PostSort) =>
    set((state) => ({ currentSort: sort })),
    
  setLayout: (layout: ViewLayout) =>
    set((state) => ({ currentLayout: layout })),
    
  saveFilter: (name: string, filter: PostFilter) =>
    set((state) => ({
      savedFilters: [
        ...state.savedFilters,
        { id: crypto.randomUUID(), name, filter },
      ],
    })),
    
  deleteSavedFilter: (id: string) =>
    set((state) => ({
      savedFilters: state.savedFilters.filter((f) => f.id !== id),
    })),
    
  // Bulk Actions
  bulkUpdateStatus: (ids: string[], status: PostStatus) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        ids.includes(post.id) ? { ...post, status } : post
      ),
    })),
    
  bulkAssignProject: (ids: string[], projectId: string) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        ids.includes(post.id) ? { ...post, projectId } : post
      ),
    })),
    
  bulkArchive: (ids: string[]) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        ids.includes(post.id) ? { ...post, archived: true } : post
      ),
    })),
    
  bulkDelete: (ids: string[]) =>
    set((state) => ({
      posts: state.posts.filter((post) => !ids.includes(post.id)),
    })),

  // Initial Calendar State
  calendarSettings: {
    firstDayOfWeek: 0,
    workingHours: {
      start: 9,
      end: 17,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    showWeekNumbers: false,
    defaultView: 'week',
  },
  calendarFilter: {},

  // Calendar Actions
  setCalendarSettings: (settings: Partial<CalendarSettings>) =>
    set((state) => ({
      calendarSettings: {
        ...state.calendarSettings,
        ...settings,
      },
    })),

  setCalendarFilter: (filter: CalendarFilter) =>
    set((state) => ({ calendarFilter: filter })),

  deleteThread: (id: string) =>
    set((state) => ({
      threads: state.threads.filter((thread) => thread.id !== id),
    })),
})

export const useContentStore = create<ContentStore>(createContentStore) 
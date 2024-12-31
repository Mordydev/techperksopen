import { addDays, addHours, subDays } from 'date-fns'
import { Post, Thread, AICall, PostStatus } from '../stores/useContentStore'

const postStatuses: PostStatus[] = ['pending', 'draft', 'needs-changes', 'scheduled', 'published']
const tags = ['marketing', 'product', 'announcement', 'feature', 'update', 'news']

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function getRandomTags(): string[] {
  const count = Math.floor(Math.random() * 3) + 1
  const selectedTags = new Set<string>()
  
  while (selectedTags.size < count) {
    selectedTags.add(getRandomItem(tags))
  }
  
  return Array.from(selectedTags)
}

function getRandomStats() {
  return {
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
  }
}

export function generatePlaceholderPosts(count = 10): Post[] {
  const now = new Date()
  const posts: Post[] = []

  for (let i = 0; i < count; i++) {
    const status = getRandomItem(postStatuses)
    const daysOffset = Math.floor(Math.random() * 14) - 7 // -7 to +7 days
    const hoursOffset = Math.floor(Math.random() * 24)
    const date = addHours(addDays(now, daysOffset), hoursOffset)

    posts.push({
      id: crypto.randomUUID(),
      title: `Sample Post ${i + 1}`,
      content: `This is a sample post content for testing purposes. It demonstrates how the post would look with some actual content.`,
      status,
      scheduledFor: status === 'scheduled' || status === 'published' ? date : undefined,
      tags: getRandomTags(),
      stats: status === 'published' ? getRandomStats() : undefined,
      revisionNotes: status === 'needs-changes' ? 'Please review and update the content.' : undefined,
    })
  }

  return posts
}

export function generatePlaceholderThreads(count = 5): Thread[] {
  const threads: Thread[] = []

  for (let i = 0; i < count; i++) {
    const type = Math.random() > 0.5 ? 'chat' : 'voice'
    const isArchived = Math.random() > 0.8

    if (type === 'chat') {
      threads.push({
        id: crypto.randomUUID(),
        title: `Chat Thread ${i + 1}`,
        type,
        content: [
          'Hi, I need help creating a post about our new feature.',
          'I can help you with that. What feature would you like to highlight?',
          'The new analytics dashboard we launched last week.',
          'Great choice! Let me help you draft that post.',
        ],
        tags: getRandomTags(),
        isArchived,
      })
    } else {
      threads.push({
        id: crypto.randomUUID(),
        title: `Voice Memo ${i + 1}`,
        type,
        content: ['Voice memo recording 1', 'Voice memo recording 2'],
        tags: getRandomTags(),
        isArchived,
      })
    }
  }

  return threads
}

export function generatePlaceholderAICalls(count = 3): AICall[] {
  const now = new Date()
  const calls: AICall[] = []

  for (let i = 0; i < count; i++) {
    const daysOffset = Math.floor(Math.random() * 7) // 0 to 7 days
    const hoursOffset = Math.floor(Math.random() * 24)
    const date = addHours(addDays(now, daysOffset), hoursOffset)

    calls.push({
      id: crypto.randomUUID(),
      scheduledFor: date,
      status: getRandomItem(['scheduled', 'completed', 'cancelled']),
      notes: Math.random() > 0.5 ? 'Discuss content strategy for next month' : undefined,
    })
  }

  return calls
}

export function initializePlaceholderData() {
  return {
    posts: generatePlaceholderPosts(),
    threads: generatePlaceholderThreads(),
    aiCalls: generatePlaceholderAICalls(),
  }
} 
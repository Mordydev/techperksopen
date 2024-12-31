'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ContentCalendar } from './ContentCalendar'
import { ListView } from './ListView'
import { ThreadsPanel } from './ThreadsPanel'
import { ProjectsPanel } from './ProjectsPanel'
import { ScheduleAICallModal } from './ScheduleAICallModal'
import { PostEditorModal } from './PostEditorModal'
import { ErrorBoundary } from '@/app/components/ErrorBoundary'
import { useContentStore } from '../stores/useContentStore'
import { initializePlaceholderData } from '../utils/placeholder-data'
import { Plus, Calendar as CalendarIcon } from 'lucide-react'

export function ContentHubClient() {
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const createPost = useContentStore((state) => state.createPost)
  const createThread = useContentStore((state) => state.createThread)
  const scheduleAICall = useContentStore((state) => state.scheduleAICall)

  // Initialize with placeholder data
  useEffect(() => {
    const data = initializePlaceholderData()
    
    // Add placeholder posts
    data.posts.forEach((post) => {
      createPost(post)
    })

    // Add placeholder threads
    data.threads.forEach((thread) => {
      createThread(thread)
    })

    // Add placeholder AI calls
    data.aiCalls.forEach((call) => {
      scheduleAICall(call.scheduledFor, call.notes)
    })
  }, [createPost, createThread, scheduleAICall])

  return (
    <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header - Responsive layout for mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Content Hub</h1>
        <div className="flex w-full sm:w-auto gap-2">
          {/* Mobile-optimized buttons */}
          <Button 
            variant="outline" 
            onClick={() => setShowScheduleModal(true)}
            className="flex-1 sm:flex-none justify-center"
          >
            <CalendarIcon className="h-4 w-4 mr-2 hidden sm:inline-block" />
            <span className="sm:inline">Schedule AI Call</span>
          </Button>
          <Button 
            onClick={() => setShowCreatePostModal(true)}
            className="flex-1 sm:flex-none justify-center"
          >
            <Plus className="h-4 w-4 mr-2 hidden sm:inline-block" />
            <span className="sm:inline">Create Post</span>
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-0">
          <ErrorBoundary>
            <ContentCalendar />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <ErrorBoundary>
            <ListView />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-0">
          <ErrorBoundary>
            <ProjectsPanel />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>

      {/* Threads Panel - Adjusted padding for mobile */}
      <div className="rounded-lg">
        <ErrorBoundary>
          <ThreadsPanel />
        </ErrorBoundary>
      </div>

      <ScheduleAICallModal 
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />

      <PostEditorModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
      />
    </div>
  )
} 
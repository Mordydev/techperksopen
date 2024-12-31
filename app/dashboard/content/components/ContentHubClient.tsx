'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ContentCalendar } from './ContentCalendar'
import { ListView } from './ListView'
import { ThreadsPanel } from './ThreadsPanel'
import { ProjectsPanel } from './ProjectsPanel'
import { PostEditorModal } from './PostEditorModal'
import { ScheduleAICallModal } from './ScheduleAICallModal'
import { ErrorBoundary } from '@/app/components/ErrorBoundary'
import { FilterProvider } from '../contexts/FilterContext'

export function ContentHubClient() {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  return (
    <FilterProvider>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center">
          <h1 className="text-2xl font-semibold">Content Hub</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreatePostModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
            <Button variant="outline" onClick={() => setShowScheduleModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule AI Call
            </Button>
          </div>
        </div>

        <Tabs defaultValue="calendar">
          <TabsList>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
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
    </FilterProvider>
  )
} 
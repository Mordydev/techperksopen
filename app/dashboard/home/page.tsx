"use client"

import { SmartHeader } from "../components/header/SmartHeader"
import { AIPartner } from "../components/ai-partner/AIPartner"
import { ContentCalendarPreview } from "./components/ContentCalendarPreview"
import { NetworkInsightsPreview } from "./components/NetworkInsightsPreview"
import { AICallSnippet } from "./components/AICallSnippet"
import { ActivityHub } from "../components/activity/ActivityHub"
import { CommunityTeaser } from "./components/CommunityTeaser"
import { PerformanceTeaser } from "./components/PerformanceTeaser"
import { OnboardingChecklist } from "./components/OnboardingChecklist"
import { useProfile } from "@/lib/supabase/hooks/use-profile"

const onboardingSteps = [
  {
    id: "profile",
    label: "Complete your profile",
    completed: false,
    href: "/dashboard/profile",
    description: "Add your professional details and experience",
  },
  {
    id: "linkedin",
    label: "Connect your LinkedIn account",
    completed: false,
    href: "/dashboard/settings",
    description: "Sync your LinkedIn profile for better insights",
  },
  {
    id: "goals",
    label: "Set your growth goals",
    completed: false,
    href: "/dashboard/content",
    description: "Define your professional growth objectives",
  },
  {
    id: "first-post",
    label: "Schedule your first post",
    completed: false,
    href: "/dashboard/content/new",
    description: "Create and schedule your first LinkedIn post",
  },
]

export default function HomePage() {
  const { profile, loading } = useProfile()

  if (loading) {
    return null
  }

  // Calculate onboarding progress
  const getOnboardingProgress = () => {
    if (!profile) return { steps: onboardingSteps, progress: 0 }

    const updatedSteps = onboardingSteps.map(step => ({
      ...step,
      completed: profile.completed_steps?.includes(step.id) || false,
    }))

    const completedSteps = updatedSteps.filter(step => step.completed).length
    const progress = Math.round((completedSteps / updatedSteps.length) * 100)

    return { steps: updatedSteps, progress }
  }

  const { steps, progress } = getOnboardingProgress()
  const showOnboarding = !profile?.onboarding_completed

  return (
    <div className="space-y-6 p-6">
      <SmartHeader />
      {showOnboarding && <OnboardingChecklist steps={steps} progress={progress} />}
      <div className="grid gap-6 md:grid-cols-2">
        <AIPartner />
        <div className="space-y-6">
          <AICallSnippet />
          <ActivityHub />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ContentCalendarPreview />
        <NetworkInsightsPreview />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <CommunityTeaser />
        <PerformanceTeaser />
      </div>
    </div>
  )
} 
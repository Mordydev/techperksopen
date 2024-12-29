"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Brain, Zap, ArrowRight, CheckCircle2, XCircle, Users, FileText, TrendingUp, Settings } from "lucide-react"
import Link from "next/link"
import { useProfile } from "@/lib/supabase/hooks/use-profile"
import { motion, AnimatePresence } from "framer-motion"

const getCategoryIcon = (category: AISuggestion['category']) => {
  switch (category) {
    case 'LinkedIn Post':
      return <FileText className="h-4 w-4" />
    case 'Networking':
      return <Users className="h-4 w-4" />
    case 'Content Strategy':
      return <TrendingUp className="h-4 w-4" />
    case 'Profile Optimization':
      return <Settings className="h-4 w-4" />
  }
}

const getCategoryColor = (category: AISuggestion['category']) => {
  switch (category) {
    case 'LinkedIn Post':
      return 'bg-blue-100 text-blue-700'
    case 'Networking':
      return 'bg-green-100 text-green-700'
    case 'Content Strategy':
      return 'bg-purple-100 text-purple-700'
    case 'Profile Optimization':
      return 'bg-orange-100 text-orange-700'
  }
}

interface AISuggestion {
  id: string
  type: 'content' | 'network' | 'growth'
  title: string
  description: string
  impact_score: number
  action_url: string
  action_text: string
  context: string
  evidence: string
  suggested_action: string
  category: 'LinkedIn Post' | 'Networking' | 'Content Strategy' | 'Profile Optimization'
  is_completed?: boolean
  is_dismissed?: boolean
}

const mockSuggestions: AISuggestion[] = [
  {
    id: '1',
    type: 'content',
    category: 'LinkedIn Post',
    title: 'Share AI Industry Insights',
    description: "Your expertise in AI trends could benefit your audience. We've drafted a thought leadership post for you.",
    impact_score: 85,
    action_url: '/dashboard/content',
    action_text: 'Create Post',
    context: 'Based on your recent engagement with AI-related content and your goal to establish thought leadership in the field',
    evidence: 'Posts about AI have generated 20% more engagement for you in the last month',
    suggested_action: 'Write a detailed post about recent AI developments in your industry'
  },
  {
    id: '2',
    type: 'network',
    category: 'Networking',
    title: 'Connect with AI Leaders',
    description: 'We found key AI professionals in your industry who could be valuable connections.',
    impact_score: 80,
    action_url: '/dashboard/network',
    action_text: 'View Connections',
    context: 'Your network analysis shows potential for expanding AI industry connections',
    evidence: '5 of your most engaged connections are AI professionals',
    suggested_action: 'Connect with 3 suggested AI leaders and engage with their content'
  },
  {
    id: '3',
    type: 'growth',
    category: 'Profile Optimization',
    title: 'Enhance AI Skills Section',
    description: 'Adding specific AI technologies to your skills could increase profile visibility.',
    impact_score: 75,
    action_url: '/dashboard/profile',
    action_text: 'Update Skills',
    context: 'Based on current job market trends and your experience',
    evidence: 'Profiles with specific AI skills get 40% more views',
    suggested_action: 'Add 3-4 specific AI technologies you work with to your skills section'
  },
  {
    id: '4',
    type: 'content',
    category: 'Content Strategy',
    title: 'Create AI Case Study',
    description: 'Share a success story from your recent AI project implementation.',
    impact_score: 90,
    action_url: '/dashboard/content',
    action_text: 'Start Writing',
    context: 'Your recent project completion provides valuable insights',
    evidence: 'Case studies receive 2x more shares than regular posts',
    suggested_action: 'Write a detailed case study about your recent AI project success'
  },
  {
    id: '5',
    type: 'growth',
    category: 'Profile Optimization',
    title: 'Update Profile Banner',
    description: 'A professional banner highlighting your AI expertise could attract more views.',
    impact_score: 65,
    action_url: '/dashboard/profile',
    action_text: 'Update Banner',
    context: 'Visual branding analysis of successful AI professionals',
    evidence: 'Profiles with professional banners get 30% more engagement',
    suggested_action: 'Create a banner highlighting your AI expertise and achievements'
  }
]

export function AIPartner() {
  const { profile } = useProfile()
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [displayedSuggestions, setDisplayedSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setSuggestions(mockSuggestions)
    // Randomly select 3 suggestions to display
    const shuffled = [...mockSuggestions].sort(() => 0.5 - Math.random())
    setDisplayedSuggestions(shuffled.slice(0, 3))
    setIsLoading(false)
  }, [])

  const handleComplete = (id: string) => {
    setSuggestions(prev => 
      prev.map(s => s.id === id ? { ...s, is_completed: true } : s)
    )
    setDisplayedSuggestions(prev =>
      prev.map(s => s.id === id ? { ...s, is_completed: true } : s)
    )
  }

  const handleDismiss = (id: string) => {
    setSuggestions(prev => 
      prev.map(s => s.id === id ? { ...s, is_dismissed: true } : s)
    )
    setDisplayedSuggestions(prev =>
      prev.filter(s => s.id !== id)
    )
  }

  if (isLoading) return null // Skeleton handled by parent

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-500" />
          <h2 className="text-lg font-semibold">AI Success Partner</h2>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">View All Suggestions</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>AI-Powered Growth Suggestions</DialogTitle>
              <DialogDescription>
                Personalized recommendations to boost your professional presence
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="all" className="mt-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="linkedin">Posts</TabsTrigger>
                <TabsTrigger value="networking">Network</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <div className="grid gap-4">
                  {suggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`bg-gray-50 p-4 rounded-lg ${suggestion.is_completed ? 'border-2 border-green-200' : ''} ${suggestion.is_dismissed ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getCategoryColor(suggestion.category)} flex items-center gap-1`}>
                            {getCategoryIcon(suggestion.category)}
                            {suggestion.category}
                          </Badge>
                          {suggestion.is_completed && (
                            <Badge variant="outline" className="bg-green-100 text-green-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <div className="w-24">
                              <Progress value={suggestion.impact_score} className="h-2" />
                            </div>
                            <span className="text-sm font-medium">{suggestion.impact_score}%</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg">{suggestion.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-gray-500">
                          <strong>Why:</strong> {suggestion.context}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Evidence:</strong> {suggestion.evidence}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Suggested Action:</strong> {suggestion.suggested_action}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleComplete(suggestion.id)}
                          disabled={suggestion.is_completed || suggestion.is_dismissed}
                          asChild
                        >
                          <Link href={suggestion.action_url}>
                            {suggestion.action_text}
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismiss(suggestion.id)}
                          disabled={suggestion.is_dismissed}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              {/* Add similar TabsContent for other categories */}
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {displayedSuggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors ${
                suggestion.is_completed ? 'border-2 border-green-200' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className={`${getCategoryColor(suggestion.category)} flex items-center gap-1`}>
                    {getCategoryIcon(suggestion.category)}
                    {suggestion.category}
                  </Badge>
                  {suggestion.is_completed && (
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <div className="w-24">
                    <Progress value={suggestion.impact_score} className="h-2" />
                  </div>
                  <span className="text-sm font-medium">{suggestion.impact_score}%</span>
                </div>
              </div>
              <h3 className="font-semibold text-purple-900">{suggestion.title}</h3>
              <p className="text-purple-800 text-sm">{suggestion.description}</p>
              <div className="mt-3">
                <p className="text-sm text-purple-700">{suggestion.evidence}</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center group"
                  onClick={() => handleComplete(suggestion.id)}
                  disabled={suggestion.is_completed}
                  asChild
                >
                  <Link href={suggestion.action_url}>
                    <span>{suggestion.action_text}</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(suggestion.id)}
                  disabled={suggestion.is_dismissed}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Weekly AI Call Reminder */}
      {profile?.next_ai_call && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold text-purple-900">Next AI Strategy Call</h3>
            </div>
            <Badge variant="outline" className="text-purple-700 bg-purple-100">
              {new Date(profile.next_ai_call).toLocaleDateString()}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 justify-center"
            asChild
          >
            <Link href="/dashboard/ai-calls">
              View Schedule
            </Link>
          </Button>
        </div>
      )}
    </Card>
  )
} 
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { Linkedin, User, Target, ArrowRight } from "lucide-react"

interface BaseField {
  name: string
  label: string
  type: string
}

interface TextField extends BaseField {
  type: "text" | "textarea"
  placeholder: string
}

interface SelectField extends BaseField {
  type: "select"
  options: string[]
}

type Field = TextField | SelectField

interface Step {
  id: string
  name: string
  icon: LucideIcon
  fields?: Field[]
  description?: string
}

const steps: Step[] = [
  {
    id: "profile",
    name: "Complete Profile",
    icon: User,
    fields: [
      {
        name: "headline",
        label: "Professional Headline",
        type: "text",
        placeholder: "e.g., Senior Software Engineer at Tech Corp",
      },
      {
        name: "bio",
        label: "Professional Bio",
        type: "textarea",
        placeholder: "Tell us about your professional journey and expertise...",
      },
      {
        name: "industry",
        label: "Industry",
        type: "text",
        placeholder: "e.g., Technology, Finance, Healthcare",
      },
    ],
  },
  {
    id: "linkedin",
    name: "Connect LinkedIn",
    icon: Linkedin,
    description:
      "Connect your LinkedIn account to enable automatic post scheduling and analytics tracking.",
  },
  {
    id: "goals",
    name: "Set Goals",
    icon: Target,
    fields: [
      {
        name: "primaryGoal",
        label: "Primary Goal",
        type: "select",
        options: [
          "Become a thought leader",
          "Generate leads",
          "Build professional network",
          "Find job opportunities",
        ],
      },
      {
        name: "postFrequency",
        label: "Desired Post Frequency",
        type: "select",
        options: ["Daily", "2-3 times per week", "Weekly", "Bi-weekly"],
      },
    ],
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    industry: "",
    primaryGoal: "",
    postFrequency: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLinkedInConnect = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?step=linkedin`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // Save all data and complete onboarding
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) throw new Error("No user found")

        const { error } = await supabase
          .from("profiles")
          .update({
            headline: formData.headline,
            bio: formData.bio,
            industry: formData.industry,
            primary_goal: formData.primaryGoal,
            post_frequency: formData.postFrequency,
            onboarding_completed: true,
          })
          .eq("email", user.email)

        if (error) throw error

        toast({
          title: "Success!",
          description: "Your profile has been set up successfully.",
        })

        router.push("/dashboard")
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < steps.length - 1
                    ? "flex-1"
                    : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index <= currentStep
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-500"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`text-sm font-medium ${
                  index <= currentStep ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {step.name}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">{currentStepData.name}</h2>
          
          {currentStepData.id === "linkedin" ? (
            <div className="space-y-4">
              <p className="text-gray-600">{currentStepData.description}</p>
              <Button onClick={handleLinkedInConnect} className="w-full">
                <Linkedin className="w-5 h-5 mr-2" />
                Connect LinkedIn Account
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {currentStepData.fields?.map((field) => (
                <div key={field.name}>
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center"
            >
              {currentStep === steps.length - 1 ? "Complete Setup" : "Next Step"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 
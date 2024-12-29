"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface OnboardingStep {
  id: string
  label: string
  description: string
  completed: boolean
  href: string
}

interface OnboardingChecklistProps {
  steps: OnboardingStep[]
  progress: number
}

export function OnboardingChecklist({ steps, progress }: OnboardingChecklistProps) {
  return (
    <Card className="p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Get Started with TechPerks
            </h2>
            <p className="text-sm text-muted-foreground">
              Complete these steps to get the most out of TechPerks
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-sm font-medium">{progress}% Complete</span>
              <p className="text-xs text-muted-foreground">
                {steps.filter(s => s.completed).length} of {steps.length} steps
              </p>
            </div>
            <div className="w-[100px] h-3 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-lg border ${
                step.completed
                  ? "bg-green-50/50 border-green-100"
                  : "bg-white/50 border-gray-100 hover:border-blue-100 hover:bg-blue-50/50"
              } transition-colors duration-200`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {step.completed ? (
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <Checkbox
                      id={step.id}
                      checked={step.completed}
                      className="mt-1"
                      disabled
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={step.id}
                    className="text-sm font-medium leading-none"
                  >
                    {step.label}
                  </label>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {step.description}
                  </p>
                  {!step.completed && (
                    <Button
                      asChild
                      variant="link"
                      className="h-auto p-0 text-xs text-blue-600 mt-2"
                    >
                      <Link href={step.href}>
                        Complete Now <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  )
} 
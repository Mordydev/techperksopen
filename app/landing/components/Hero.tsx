"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/auth/signup")
  }

  const handleLearnMore = () => {
    const element = document.getElementById('how-it-works')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section 
      className="relative overflow-hidden bg-background py-24 sm:py-32"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
        <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
            <svg
              aria-hidden="true"
              className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/5 stroke-black/5 dark:fill-white/5 dark:stroke-white/5"
            >
              <defs>
                <pattern id="pattern" width="72" height="56" patternUnits="userSpaceOnUse" x="50%" y="16">
                  <path d="M.5 56V.5H72" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" strokeWidth="0" fill="url(#pattern)" />
              <svg x="50%" y="16" className="overflow-visible">
                <rect strokeWidth="0" width="73" height="57" x="0" y="56" />
                <rect strokeWidth="0" width="73" height="57" x="72" y="168" />
              </svg>
            </svg>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 text-center relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-3xl"
        >
          <h1 
            id="hero-heading"
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
          >
            Work Smarter, Not Harder:{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Elevate Your LinkedIn Presence with AI
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Techperks helps you easily create high-quality LinkedIn content, identify strategic connections, and build your professional brand—without the hassle.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 h-12"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Start Your Free Trial
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              onClick={handleLearnMore}
              className="text-foreground h-12"
            >
              Learn more <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <div className="relative w-full max-w-[48rem]">
            <div className="aspect-[16/10] rounded-xl bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900 p-8 ring-1 ring-gray-900/10 dark:ring-gray-100/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 blur"></div>
                      <div className="relative rounded-lg bg-background p-4">
                        <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">AI-Powered LinkedIn Growth</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Coming soon: Interactive demo</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
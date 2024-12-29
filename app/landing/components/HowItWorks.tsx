"use client"

import { motion } from "framer-motion"
import { UserPlus, PenLine, LineChart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up in seconds and connect your LinkedIn profile to get started.",
    icon: UserPlus,
    color: "blue",
  },
  {
    title: "Generate Content",
    description: "Let our AI help you create engaging posts tailored to your industry and audience.",
    icon: PenLine,
    color: "purple",
  },
  {
    title: "Grow Your Presence",
    description: "Track your growth, engage with your network, and build your professional brand.",
    icon: LineChart,
    color: "green",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function HowItWorks() {
  const router = useRouter()

  return (
    <section 
      id="how-it-works" 
      className="py-24 bg-background relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-right skew-x-[-30deg] bg-muted shadow-xl shadow-blue-600/10 dark:shadow-blue-400/5 ring-1 ring-blue-100 dark:ring-blue-400/10 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20 dark:ring-blue-400/30 mb-4">
            How it works
          </span>
          <h2 
            id="how-it-works-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Start Growing Your LinkedIn Presence Today
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and transform your LinkedIn presence with our AI-powered platform
          </p>
        </div>

        <motion.div 
          className="relative"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Connection line */}
          <div 
            className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 dark:from-blue-800 dark:via-purple-800 dark:to-green-800 -translate-y-1/2 hidden lg:block" 
            aria-hidden="true"
          />
          
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={item}
                className={`
                  relative bg-card p-8 rounded-2xl shadow-sm 
                  hover:shadow-md transition-all duration-300
                  hover:scale-105 hover:-translate-y-1
                  ring-1 ring-border
                `}
              >
                <div 
                  className={`
                    absolute -top-6 left-1/2 -translate-x-1/2 rounded-full p-4
                    shadow-lg ring-1 ring-border
                    ${step.color === "blue" 
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400" 
                      : step.color === "purple" 
                      ? "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400" 
                      : "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400"}
                  `}
                  aria-hidden="true"
                >
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="pt-8 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <div 
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card shadow-lg ring-1 ring-border hidden lg:block"
                  aria-hidden="true"
                >
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-foreground">
                    {index + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Button
            onClick={() => router.push("/auth/signup")}
            size="lg"
            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
          >
            Start your journey <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
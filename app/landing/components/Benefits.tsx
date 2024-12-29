"use client"

import { Brain, Network, Rocket, Sparkles, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const benefits = [
  {
    title: "AI-Powered Content Creation",
    description: "Generate engaging LinkedIn posts with our advanced AI that understands your industry and voice.",
    icon: Brain,
    color: "blue",
  },
  {
    title: "Strategic Networking",
    description: "Identify and connect with the right professionals to grow your network meaningfully.",
    icon: Network,
    color: "purple",
  },
  {
    title: "Professional Brand Building",
    description: "Build a consistent and impactful professional brand that resonates with your audience.",
    icon: Sparkles,
    color: "pink",
  },
  {
    title: "Growth Analytics",
    description: "Track your LinkedIn growth and engagement with detailed analytics and insights.",
    icon: Rocket,
    color: "green",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function Benefits() {
  const router = useRouter()

  return (
    <section 
      className="py-24 bg-gradient-to-b from-background to-muted"
      aria-labelledby="benefits-heading"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20 dark:ring-blue-400/30 mb-4">
            Features
          </span>
          <h2 
            id="benefits-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Why Choose Techperks?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build a powerful LinkedIn presence, all in one place.
            Our AI-powered platform helps you grow your professional network effectively.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={item}
              className={`
                relative p-6 bg-card rounded-2xl shadow-sm 
                hover:shadow-md transition-all duration-300 
                hover:scale-105 hover:-translate-y-1
                ring-1 ring-border
              `}
            >
              <div className={`
                absolute top-6 left-6 rounded-lg p-3
                ${benefit.color === "blue" 
                  ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400" 
                  : benefit.color === "purple" 
                  ? "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400" 
                  : benefit.color === "pink" 
                  ? "bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400" 
                  : "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400"}
              `}>
                <benefit.icon className="h-6 w-6" />
              </div>
              <div className="pt-16">
                <h3 className="text-lg font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
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
            Get started now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
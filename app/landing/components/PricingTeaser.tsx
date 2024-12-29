"use client"

import { Check, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

const plans = [
  {
    name: "Free Trial",
    price: "0",
    description: "Perfect for trying out Techperks",
    features: [
      "AI-powered content suggestions",
      "Basic LinkedIn analytics",
      "Up to 5 scheduled posts",
      "Community access",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "100",
    description: "For professionals serious about growth",
    features: [
      "Unlimited AI content generation",
      "Advanced analytics & insights",
      "Unlimited scheduled posts",
      "Priority community access",
      "1-on-1 growth consultation",
      "Custom branding options",
    ],
    cta: "Get Pro Access",
    highlighted: true,
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

export function PricingTeaser() {
  const router = useRouter()

  return (
    <section 
      className="py-24 bg-gradient-to-b from-muted to-background relative overflow-hidden"
      aria-labelledby="pricing-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 flex justify-center">
        <div className="flex w-full">
          <div className="w-1/2 transform -skew-y-12 -translate-y-20 bg-gradient-to-r from-blue-50 dark:from-blue-950/20 to-transparent opacity-50" />
          <div className="w-1/2 transform skew-y-12 -translate-y-20 bg-gradient-to-l from-blue-50 dark:from-blue-950/20 to-transparent opacity-50" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20 dark:ring-blue-400/30 mb-4">
            Pricing
          </span>
          <h2 
            id="pricing-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your needs. Start with our free trial and upgrade anytime.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-5xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={item}
              className={`
                relative rounded-2xl p-8
                transition-all duration-300 hover:scale-105
                ${plan.highlighted
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white shadow-xl ring-1 ring-blue-500"
                  : "bg-card text-foreground shadow-sm ring-1 ring-border"
                }
              `}
            >
              {plan.highlighted && (
                <div 
                  className="absolute top-0 right-6 transform -translate-y-1/2"
                  aria-hidden="true"
                >
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900">
                    <Star className="h-4 w-4" />
                    Most Popular
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  {plan.name}
                  {plan.highlighted && <Sparkles className="h-5 w-5 text-blue-200" />}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">${plan.price}</span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </div>
                <p className={`mt-6 text-sm ${
                  plan.highlighted ? "text-blue-100" : "text-muted-foreground"
                }`}>
                  {plan.description}
                </p>
              </div>
              <ul className="mt-8 space-y-4" role="list">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className={`h-5 w-5 flex-shrink-0 ${
                      plan.highlighted ? "text-blue-200" : "text-blue-600 dark:text-blue-400"
                    }`} />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  onClick={() => router.push("/auth/signup")}
                  className={`w-full h-12 text-base font-medium ${
                    plan.highlighted
                      ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 shadow-sm"
                      : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          All plans include a 14-day money-back guarantee
        </motion.p>
      </div>
    </section>
  )
}
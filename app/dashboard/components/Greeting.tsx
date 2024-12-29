"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"

export function Greeting() {
  const { user } = useAuth()
  const email = user?.email || "Professional"
  const name = email.split('@')[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome back, {name}!
      </h1>
      <p className="text-muted-foreground">
        Let's accomplish something great today.
      </p>
    </motion.div>
  )
}
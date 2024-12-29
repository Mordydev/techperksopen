"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        console.error("Error in auth callback:", error.message)
        router.push("/auth/login?error=Unable to authenticate")
        return
      }

      if (!user) {
        router.push("/auth/login?error=No user found")
        return
      }

      // Check if user profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select()
        .eq("email", user.email)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error checking profile:", profileError.message)
        router.push("/auth/login?error=Profile check failed")
        return
      }

      // If no profile exists, create one
      if (!profile) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([
            {
              email: user.email,
              full_name: user.user_metadata.full_name || user.email?.split("@")[0],
              onboarding_completed: false,
            },
          ])

        if (insertError) {
          console.error("Error creating profile:", insertError.message)
          router.push("/auth/login?error=Profile creation failed")
          return
        }
      }

      // Redirect to dashboard or onboarding based on profile status
      if (profile?.onboarding_completed) {
        router.push("/dashboard")
      } else {
        router.push("/onboarding")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Setting up your account...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  )
} 
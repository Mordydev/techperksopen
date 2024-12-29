"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "../database.types"

export async function updateProfile({
  userId,
  data,
}: {
  userId: string
  data: Partial<Database["public"]["Tables"]["profiles"]["Update"]>
}) {
  const supabase = createServerActionClient<Database>({ cookies })
  
  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("user_id", userId)

  if (error) throw error
  return { success: true }
}

export async function createProfile({
  userId,
  email,
}: {
  userId: string
  email: string
}) {
  const supabase = createServerActionClient<Database>({ cookies })
  
  const { error } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
      email: email,
      created_at: new Date().toISOString(),
      onboarding_completed: false,
      linkedin_connected: false,
      completed_steps: [],
      points: 0,
      tier: 'bronze',
      next_tier_points: 100,
    })

  if (error) throw error
  return { success: true }
}
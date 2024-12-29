"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "../database.types"

export async function signOut() {
  const supabase = createServerActionClient<Database>({ cookies })
  await supabase.auth.signOut()
}

export async function getSession() {
  const supabase = createServerActionClient<Database>({ cookies })
  return await supabase.auth.getSession()
}
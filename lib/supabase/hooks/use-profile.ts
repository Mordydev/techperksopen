"use client"

import { useEffect, useState } from 'react'
import { useSupabase } from './use-supabase'
import { Database } from '../database.types'
import { toast } from 'sonner'
import { createProfile } from '../actions/profiles'

// Extend the base Profile type with additional fields
type BaseProfile = Database['public']['Tables']['profiles']['Row']

export interface Profile extends BaseProfile {
  onboarding_completed: boolean
  linkedin_connected: boolean
  company?: string
  title?: string
  bio?: string
  skills: string[]
  completed_steps: string[]
  preferences: {
    theme: "light" | "dark" | "system"
    notifications: boolean
    email_notifications: boolean
  }
}

export function useProfile() {
  const { user, supabase } = useSupabase()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        if (!user?.id) return

        const { data: initialData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        let data = initialData

        if (error) {
          if (error.code === 'PGRST116') { // Record not found
            // Create profile if it doesn't exist
            if (user.email) {
              await createProfile({ userId: user.id, email: user.email })
              // Retry loading the profile
              const { data: newData, error: newError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single()
              
              if (newError) throw newError
              data = newData
            } else {
              throw new Error('User email not found')
            }
          } else {
            throw error
          }
        }

        // Transform the data to include default values for new fields
        const enhancedProfile: Profile = {
          ...data,
          onboarding_completed: data.onboarding_completed ?? false,
          linkedin_connected: data.linkedin_connected ?? false,
          skills: data.skills ?? [],
          completed_steps: data.completed_steps ?? [],
          preferences: {
            theme: data.preferences?.theme ?? "system",
            notifications: data.preferences?.notifications ?? true,
            email_notifications: data.preferences?.email_notifications ?? true,
          }
        }

        setProfile(enhancedProfile)
      } catch (error) {
        console.error('Error loading profile:', error)
        setError(error instanceof Error ? error : new Error('Failed to load profile'))
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user, supabase])

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user?.id) throw new Error('No user logged in')

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)

      if (error) throw error

      setProfile(prev => prev ? { ...prev, ...updates } : null)
      toast.success('Profile updated successfully')
      return true
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update profile')
      setError(error)
      toast.error(error.message)
      return false
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
  }
}
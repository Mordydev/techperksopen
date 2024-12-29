export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          user_id: string
          full_name?: string
          avatar_url?: string
          headline?: string
          bio?: string
          industry?: string
          primary_goal?: string
          post_frequency?: string
          onboarding_completed?: boolean
          weekly_goal_progress?: number
          linkedin_connected?: boolean
          next_ai_call?: string
          points?: number
          tier?: string
          next_tier_points?: number
          completed_steps?: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          user_id: string
          full_name?: string
          avatar_url?: string
          headline?: string
          bio?: string
          industry?: string
          primary_goal?: string
          post_frequency?: string
          onboarding_completed?: boolean
          weekly_goal_progress?: number
          linkedin_connected?: boolean
          next_ai_call?: string
          points?: number
          tier?: string
          next_tier_points?: number
          completed_steps?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          user_id?: string
          full_name?: string
          avatar_url?: string
          headline?: string
          bio?: string
          industry?: string
          primary_goal?: string
          post_frequency?: string
          onboarding_completed?: boolean
          weekly_goal_progress?: number
          linkedin_connected?: boolean
          next_ai_call?: string
          points?: number
          tier?: string
          next_tier_points?: number
          completed_steps?: string[]
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export interface Notification {
  id: string
  user_id: string
  type: 'engagement' | 'connection' | 'milestone' | 'suggestion'
  title: string
  description: string
  timestamp: string
  read: boolean
  action_url?: string
  created_at: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          throw new Error("No authenticated user")
        }

        const { data, error: notificationsError } = await supabase
          .from("notifications")
          .select()
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10)

        if (notificationsError) {
          throw notificationsError
        }

        setNotifications(data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch notifications"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          setNotifications(current => [payload.new as Notification, ...current])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)

      if (error) {
        throw error
      }

      setNotifications(current =>
        current.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to mark notification as read"))
      throw err
    }
  }

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("No authenticated user")
      }

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false)

      if (error) {
        throw error
      }

      setNotifications(current =>
        current.map(n => ({ ...n, read: true }))
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to mark all notifications as read"))
      throw err
    }
  }

  return {
    notifications,
    isLoading,
    error,
    markAsRead,
    markAllAsRead
  }
} 
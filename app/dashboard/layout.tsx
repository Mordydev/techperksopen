"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "./components/layout/Sidebar"
import Topbar from "./components/layout/Topbar"
import { useProfile } from "@/lib/supabase/hooks/use-profile"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showSidebar, setShowSidebar] = useState(true)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const { loading } = useProfile()
  const router = useRouter()

  if (loading) {
    return <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Topbar 
        showSidebar={showSidebar} 
        setShowSidebar={setShowSidebar}
        setIsOverlayVisible={setIsOverlayVisible}
      />
      <Sidebar 
        showSidebar={showSidebar} 
        setShowSidebar={setShowSidebar}
        isOverlayVisible={isOverlayVisible}
      />
      <main className={`
        pt-[70px] min-h-screen
        transition-all duration-300 ease-in-out
        ${showSidebar ? "pl-[250px]" : "pl-[100px]"}
        ${isOverlayVisible ? 'pointer-events-none' : ''}
      `}>
        <div className="container mx-auto py-8 px-6">
          {children}
        </div>
      </main>
    </div>
  )
}
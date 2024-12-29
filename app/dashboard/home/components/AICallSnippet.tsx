"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import Link from "next/link"

interface AICallData {
  next_call?: {
    date: string
    time: string
  }
}

export function AICallSnippet() {
  // TODO: Replace with actual data fetching
  const mockData: AICallData = {
    next_call: {
      date: "2024-01-15",
      time: "14:00",
    },
  }

  if (!mockData.next_call) {
    return (
      <Card className="bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">AI Strategy Call</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            No upcoming calls scheduled. Book your next strategy session to stay on track.
          </p>
          <Button asChild>
            <Link href="/dashboard/content-and-calendar">Schedule Now</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { date, time } = mockData.next_call
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Next AI Strategy Call</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/content-and-calendar">
              View or Reschedule
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 
import { type NextRequest, NextResponse } from "next/server"
import { recommendationEngine } from "@/lib/recommendation-engine"

export async function GET() {
  try {
    const analytics = recommendationEngine.getAnalytics()
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, tourId } = body

    if (action === "click") {
      recommendationEngine.trackClick(userId, tourId)
    } else if (action === "booking") {
      recommendationEngine.trackBooking(userId, tourId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking analytics:", error)
    return NextResponse.json({ error: "Failed to track analytics" }, { status: 500 })
  }
}

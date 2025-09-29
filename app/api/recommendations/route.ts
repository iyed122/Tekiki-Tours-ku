import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import type { RecommendationRequest } from "@/lib/types"
import { recommendationEngine } from "@/lib/recommendation-engine"

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json()

    // Get all necessary data
    const customers = db.customers.getAll()
    const bookings = db.bookings.getAll()
    const tours = db.tourPackages.getAll()

    // Generate recommendations using the enhanced engine
    const recommendations = recommendationEngine.generateRecommendations(body, customers, bookings, tours)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}

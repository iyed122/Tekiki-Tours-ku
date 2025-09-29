import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let tours = db.tourPackages.getAll()

    if (category) {
      tours = db.tourPackages.findByCategory(category)
    }

    if (search) {
      tours = db.tourPackages.search(search)
    }

    return NextResponse.json(tours)
  } catch (error) {
    console.error("Error fetching tours:", error)
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 })
  }
}

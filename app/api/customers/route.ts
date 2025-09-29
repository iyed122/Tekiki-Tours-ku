import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, preferences } = body

    // Check if customer already exists
    const existingCustomer = db.customers.findByEmail(email)
    if (existingCustomer) {
      return NextResponse.json(existingCustomer)
    }

    // Create new customer
    const customer = db.customers.create({
      name,
      email,
      phone,
      preferences,
      pastBookings: [],
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const customers = db.customers.getAll()
    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

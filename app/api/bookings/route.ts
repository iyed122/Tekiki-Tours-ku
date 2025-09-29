import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, tourPackageId, travelDate, numberOfPeople, specialRequests } = body

    // Validate tour package exists
    const tourPackage = db.tourPackages.findById(tourPackageId)
    if (!tourPackage) {
      return NextResponse.json({ error: "Tour package not found" }, { status: 404 })
    }

    // Calculate total price
    const totalPrice = tourPackage.price * numberOfPeople

    // Create booking
    const booking = db.bookings.create({
      customerId,
      tourPackageId,
      status: "pending",
      bookingDate: new Date(),
      travelDate: new Date(travelDate),
      numberOfPeople,
      totalPrice,
      currency: tourPackage.currency,
      specialRequests: specialRequests || "",
      paymentStatus: "pending",
    })

    // Update customer's past bookings
    const customer = db.customers.findById(customerId)
    if (customer) {
      db.customers.update(customerId, {
        pastBookings: [...customer.pastBookings, booking.id],
      })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")

    let bookings = db.bookings.getAll()

    if (customerId) {
      bookings = db.bookings.findByCustomerId(customerId)
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Customer, Booking, TourPackage } from "@/lib/types"
import { Users, Calendar, MapPin, DollarSign, Star } from "lucide-react"

export default function AdminDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [tours, setTours] = useState<TourPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [customersRes, bookingsRes, toursRes] = await Promise.all([
        fetch("/api/customers"),
        fetch("/api/bookings"),
        fetch("/api/tours"),
      ])

      const [customersData, bookingsData, toursData] = await Promise.all([
        customersRes.json(),
        bookingsRes.json(),
        toursRes.json(),
      ])

      setCustomers(customersData)
      setBookings(bookingsData)
      setTours(toursData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error("Error updating booking:", error)
    }
  }

  // Calculate statistics
  const stats = {
    totalCustomers: customers.length,
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, booking) => sum + booking.totalPrice, 0),
    averageRating: tours.reduce((sum, tour) => sum + tour.rating, 0) / tours.length || 0,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredBookings = bookings.filter((booking) => {
    const customer = customers.find((c) => c.id === booking.customerId)
    const tour = tours.find((t) => t.id === booking.tourPackageId)
    return (
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-rose-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tekiki Tours Admin</h1>
          <p className="text-gray-600">Manage your travel agency operations</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingBookings} pending, {stats.confirmedBookings} confirmed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(0)} TND</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search customers, bookings, or tours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="tours">Tours</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Manage customer bookings and reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBookings.map((booking) => {
                    const customer = customers.find((c) => c.id === booking.customerId)
                    const tour = tours.find((t) => t.id === booking.tourPackageId)

                    return (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{customer?.name || "Unknown Customer"}</h3>
                            <Badge
                              variant={
                                booking.status === "confirmed"
                                  ? "default"
                                  : booking.status === "pending"
                                    ? "secondary"
                                    : booking.status === "cancelled"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            {tour?.name || "Unknown Tour"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Travel Date: {new Date(booking.travelDate).toLocaleDateString()} •{booking.numberOfPeople}{" "}
                            people • {booking.totalPrice} TND
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {booking.status === "pending" && (
                            <>
                              <Button size="sm" onClick={() => updateBookingStatus(booking.id, "confirmed")}>
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, "cancelled")}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {filteredBookings.length === 0 && <p className="text-center text-gray-500 py-8">No bookings found</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Database</CardTitle>
                <CardDescription>View and manage customer information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{customer.name}</h3>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                          <p className="text-sm text-gray-500">{customer.phone}</p>
                        </div>
                        <Badge variant="outline">{customer.pastBookings.length} bookings</Badge>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-1">Preferences:</p>
                        <div className="flex flex-wrap gap-1">
                          {customer.preferences.interests.map((interest) => (
                            <Badge key={interest} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Budget: {customer.preferences.budget} TND • Duration: {customer.preferences.duration} days •
                          Group: {customer.preferences.groupSize} people
                        </p>
                      </div>
                    </div>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No customers found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tours Tab */}
          <TabsContent value="tours" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tour Packages</CardTitle>
                <CardDescription>Manage available tour packages and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tours.map((tour) => (
                    <div key={tour.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm">{tour.name}</h3>
                        <Badge variant={tour.availability ? "default" : "secondary"}>
                          {tour.availability ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{tour.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">{tour.price} TND</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">
                            {tour.rating} ({tour.reviewCount})
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {tour.category}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">
                          {tour.duration} day{tour.duration !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

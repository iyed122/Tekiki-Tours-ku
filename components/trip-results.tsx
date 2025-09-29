"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Heart, Share2, Calendar, Users } from "./icons"
import type { TourPackage } from "@/lib/types"

interface TripResultsProps {
  recommendations?: {
    customer: any
    recommendations: {
      recommendations: TourPackage[]
      reasoning: string
      confidence: number
    }
  }
  isVisible?: boolean
}

export function TripResults({ recommendations, isVisible = false }: TripResultsProps) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [bookingLoading, setBookingLoading] = useState<string | null>(null)

  const toggleFavorite = (tripId: string) => {
    setFavorites((prev) => (prev.includes(tripId) ? prev.filter((id) => id !== tripId) : [...prev, tripId]))
  }

  const handleBooking = async (tour: TourPackage) => {
    if (!recommendations?.customer) return

    setBookingLoading(tour.id)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: recommendations.customer.id,
          tourPackageId: tour.id,
          travelDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          numberOfPeople: recommendations.customer.preferences.groupSize,
          specialRequests: "",
        }),
      })

      if (response.ok) {
        const booking = await response.json()
        alert(`Booking created successfully! Booking ID: ${booking.id}`)

        // Track booking analytics
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "booking",
            userId: recommendations.customer.id,
            tourId: tour.id,
          }),
        })
      } else {
        throw new Error("Failed to create booking")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("Failed to create booking. Please try again.")
    } finally {
      setBookingLoading(null)
    }
  }

  const handleViewDetails = async (tour: TourPackage) => {
    if (recommendations?.customer) {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "click",
          userId: recommendations.customer.id,
          tourId: tour.id,
        }),
      })
    }
    // In a real app, this would navigate to a detailed tour page
    alert(`Viewing details for ${tour.name}`)
  }

  if (!isVisible || !recommendations?.recommendations?.recommendations) {
    return null
  }

  const { recommendations: tours, reasoning, confidence } = recommendations.recommendations

  return (
    <section id="results" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            Your <span className="text-primary">Perfect Tunisia Adventures</span>
          </h2>
          <div className="max-w-3xl mx-auto mb-6">
            <p className="text-lg text-muted-foreground text-pretty mb-4">{reasoning}</p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-sm">
                AI Confidence: {confidence}%
              </Badge>
              <Badge variant="outline" className="text-sm">
                {tours.length} Recommendations
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <Card
              key={tour.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 200}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={tour.images[0] || "/placeholder.svg"}
                  alt={tour.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                    onClick={() => toggleFavorite(tour.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(tour.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                  <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{tour.rating}</span>
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-1">{tour.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {tour.destinations.join(", ")}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {tour.price} {tour.currency}
                    </div>
                    <div className="text-xs text-muted-foreground">per person</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{tour.description}</p>

                <div className="flex flex-wrap gap-1">
                  {tour.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Duration: {tour.duration} day{tour.duration !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Group: {tour.groupSize.min}-{tour.groupSize.max} people
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Available: {tour.seasonality.join(", ")}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Highlights:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {tour.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Includes:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {tour.includes.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full" onClick={() => handleViewDetails(tour)}>
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleBooking(tour)}
                    disabled={bookingLoading === tour.id}
                  >
                    {bookingLoading === tour.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                        Booking...
                      </>
                    ) : (
                      "Book Now"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-secondary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Hello {recommendations.customer.name}!</h3>
              <p className="text-muted-foreground mb-4">
                We've sent these recommendations to {recommendations.customer.email}. Our team will contact you within
                24 hours to help plan your perfect Tunisia adventure.
              </p>
              <Button variant="outline" onClick={() => (window.location.href = "/admin")}>
                View Admin Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}

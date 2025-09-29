import type { Customer, TourPackage, Booking, RecommendationRequest, RecommendationResponse } from "./types"

export interface RecommendationAnalytics {
  userId?: string
  recommendedTours: string[]
  clickedTours: string[]
  bookedTours: string[]
  timestamp: Date
  confidence: number
  algorithm: string
}

// Advanced recommendation algorithms
export class RecommendationEngine {
  private analytics: RecommendationAnalytics[] = []

  // Content-based filtering
  private contentBasedRecommendation(
    preferences: RecommendationRequest["preferences"],
    tours: TourPackage[],
    pastBookings: string[] = [],
  ): { tour: TourPackage; score: number; reasons: string[] }[] {
    return tours.map((tour) => {
      let score = 0
      const reasons: string[] = []

      // Avoid already booked tours
      if (pastBookings.includes(tour.id)) {
        return { tour, score: -100, reasons: ["Already experienced"] }
      }

      // Budget scoring (35% weight)
      const budgetPerDay = preferences.budget / preferences.duration
      const tourPriceRatio = tour.price / budgetPerDay

      if (tourPriceRatio <= 1) {
        score += 35
        reasons.push("Perfect budget match")
      } else if (tourPriceRatio <= 1.2) {
        score += 25
        reasons.push("Within budget range")
      } else if (tourPriceRatio <= 1.5) {
        score += 10
        reasons.push("Slightly above budget but great value")
      }

      // Duration matching (25% weight)
      if (tour.duration <= preferences.duration) {
        const durationScore = 25 * (1 - Math.abs(tour.duration - preferences.duration) / preferences.duration)
        score += Math.max(durationScore, 10)
        reasons.push("Fits your schedule")
      }

      // Interest matching (30% weight)
      const interestMatches = preferences.interests.filter(
        (interest) =>
          tour.tags.some((tag) => tag.toLowerCase().includes(interest.toLowerCase())) ||
          tour.category.toLowerCase().includes(interest.toLowerCase()) ||
          tour.name.toLowerCase().includes(interest.toLowerCase()),
      )

      const interestScore = (interestMatches.length / Math.max(preferences.interests.length, 1)) * 30
      score += interestScore

      if (interestMatches.length > 0) {
        reasons.push(`Matches your interests: ${interestMatches.join(", ")}`)
      }

      // Group size compatibility (10% weight)
      if (preferences.groupSize >= tour.groupSize.min && preferences.groupSize <= tour.groupSize.max) {
        score += 10
        reasons.push("Perfect for your group size")
      } else if (preferences.groupSize < tour.groupSize.min) {
        score += 5
        reasons.push("You can join other travelers")
      }

      // Quality bonus
      if (tour.rating >= 4.5) {
        score += 5
        reasons.push(`Highly rated (${tour.rating}★)`)
      }

      // Popularity bonus
      if (tour.reviewCount > 50) {
        score += 3
        reasons.push("Popular choice")
      }

      // Seasonal relevance
      const currentMonth = new Date().getMonth()
      const currentSeason = this.getCurrentSeason(currentMonth)
      if (tour.seasonality.includes(currentSeason) || tour.seasonality.includes("all")) {
        score += 5
        reasons.push("Perfect season to visit")
      }

      return { tour, score, reasons }
    })
  }

  // Collaborative filtering (simplified)
  private collaborativeFiltering(
    customerId: string,
    customers: Customer[],
    bookings: Booking[],
    tours: TourPackage[],
  ): { tour: TourPackage; score: number; reasons: string[] }[] {
    const currentCustomer = customers.find((c) => c.id === customerId)
    if (!currentCustomer) return []

    // Find similar customers based on preferences
    const similarCustomers = customers.filter((customer) => {
      if (customer.id === customerId) return false

      const similarity = this.calculateCustomerSimilarity(currentCustomer.preferences, customer.preferences)

      return similarity > 0.6 // 60% similarity threshold
    })

    // Get tours booked by similar customers
    const recommendedTours = new Map<string, { count: number; reasons: string[] }>()

    similarCustomers.forEach((customer) => {
      customer.pastBookings.forEach((bookingId) => {
        const booking = bookings.find((b) => b.id === bookingId)
        if (booking && !currentCustomer.pastBookings.includes(bookingId)) {
          const existing = recommendedTours.get(booking.tourPackageId) || { count: 0, reasons: [] }
          recommendedTours.set(booking.tourPackageId, {
            count: existing.count + 1,
            reasons: [...existing.reasons, "Loved by similar travelers"],
          })
        }
      })
    })

    // Convert to tour recommendations
    return Array.from(recommendedTours.entries())
      .map(([tourId, data]) => {
        const tour = tours.find((t) => t.id === tourId)
        if (!tour) return null

        return {
          tour,
          score: data.count * 20, // 20 points per similar customer
          reasons: [...new Set(data.reasons)],
        }
      })
      .filter(Boolean) as { tour: TourPackage; score: number; reasons: string[] }[]
  }

  // Hybrid recommendation combining multiple approaches
  public generateRecommendations(
    request: RecommendationRequest,
    customers: Customer[],
    bookings: Booking[],
    tours: TourPackage[],
  ): RecommendationResponse {
    const { preferences, customerId } = request

    // Get customer's past bookings
    let pastBookings: string[] = []
    if (customerId) {
      const customer = customers.find((c) => c.id === customerId)
      pastBookings = customer?.pastBookings || []
    }

    // Content-based recommendations (70% weight)
    const contentBased = this.contentBasedRecommendation(preferences, tours, pastBookings)

    // Collaborative filtering (30% weight) - only if customer exists
    let collaborative: { tour: TourPackage; score: number; reasons: string[] }[] = []
    if (customerId) {
      collaborative = this.collaborativeFiltering(customerId, customers, bookings, tours)
    }

    // Combine recommendations
    const combinedScores = new Map<string, { tour: TourPackage; score: number; reasons: string[] }>()

    // Add content-based scores
    contentBased.forEach((item) => {
      combinedScores.set(item.tour.id, {
        tour: item.tour,
        score: item.score * 0.7, // 70% weight
        reasons: item.reasons,
      })
    })

    // Add collaborative scores
    collaborative.forEach((item) => {
      const existing = combinedScores.get(item.tour.id)
      if (existing) {
        existing.score += item.score * 0.3 // 30% weight
        existing.reasons = [...existing.reasons, ...item.reasons]
      } else {
        combinedScores.set(item.tour.id, {
          tour: item.tour,
          score: item.score * 0.3,
          reasons: item.reasons,
        })
      }
    })

    // Sort and get top 3
    const sortedRecommendations = Array.from(combinedScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    const recommendations = sortedRecommendations.map((item) => item.tour)
    const confidence = Math.min(95, Math.max(60, sortedRecommendations[0]?.score || 0))

    // Track analytics
    this.trackRecommendation({
      userId: customerId,
      recommendedTours: recommendations.map((t) => t.id),
      clickedTours: [],
      bookedTours: [],
      timestamp: new Date(),
      confidence,
      algorithm: "hybrid",
    })

    const reasoning = this.generateReasoning(preferences, sortedRecommendations)

    return {
      recommendations,
      reasoning,
      confidence,
    }
  }

  private calculateCustomerSimilarity(prefs1: Customer["preferences"], prefs2: Customer["preferences"]): number {
    let similarity = 0
    let factors = 0

    // Budget similarity (30% weight)
    const budgetDiff = Math.abs(prefs1.budget - prefs2.budget) / Math.max(prefs1.budget, prefs2.budget)
    similarity += (1 - budgetDiff) * 0.3
    factors += 0.3

    // Duration similarity (20% weight)
    const durationDiff = Math.abs(prefs1.duration - prefs2.duration) / Math.max(prefs1.duration, prefs2.duration)
    similarity += (1 - durationDiff) * 0.2
    factors += 0.2

    // Interest overlap (40% weight)
    const commonInterests = prefs1.interests.filter((interest) => prefs2.interests.includes(interest)).length
    const totalInterests = new Set([...prefs1.interests, ...prefs2.interests]).size
    const interestSimilarity = commonInterests / totalInterests
    similarity += interestSimilarity * 0.4
    factors += 0.4

    // Travel style similarity (10% weight)
    if (prefs1.travelStyle === prefs2.travelStyle) {
      similarity += 0.1
    }
    factors += 0.1

    return similarity / factors
  }

  private getCurrentSeason(month: number): string {
    if (month >= 2 && month <= 4) return "spring"
    if (month >= 5 && month <= 7) return "summer"
    if (month >= 8 && month <= 10) return "autumn"
    return "winter"
  }

  private generateReasoning(
    preferences: RecommendationRequest["preferences"],
    recommendations: { tour: TourPackage; score: number; reasons: string[] }[],
  ): string {
    const topReasons = recommendations[0]?.reasons.slice(0, 3) || []
    const interestsList = preferences.interests.join(", ")

    return `Based on your ${preferences.budget} TND budget for ${preferences.duration} days and interest in ${interestsList}, we've selected these tours using our AI recommendation engine. ${topReasons.join(", ")}.`
  }

  private trackRecommendation(analytics: RecommendationAnalytics): void {
    this.analytics.push(analytics)
    // In a real app, this would be saved to database
    console.log("[v0] Recommendation tracked:", analytics)
  }

  public getAnalytics(): RecommendationAnalytics[] {
    return this.analytics
  }

  // Track user interactions
  public trackClick(userId: string, tourId: string): void {
    const recent = this.analytics
      .filter((a) => a.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]

    if (recent && !recent.clickedTours.includes(tourId)) {
      recent.clickedTours.push(tourId)
    }
  }

  public trackBooking(userId: string, tourId: string): void {
    const recent = this.analytics
      .filter((a) => a.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]

    if (recent && !recent.bookedTours.includes(tourId)) {
      recent.bookedTours.push(tourId)
    }
  }
}

// Export singleton instance
export const recommendationEngine = new RecommendationEngine()

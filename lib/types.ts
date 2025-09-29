// Database Models and Types for Tekiki Tours

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  preferences: {
    budget: number
    duration: number
    interests: string[]
    travelStyle: string
    groupSize: number
  }
  pastBookings: string[] // booking IDs
  createdAt: Date
  updatedAt: Date
}

export interface TourPackage {
  id: string
  name: string
  description: string
  destinations: string[]
  duration: number
  price: number
  currency: string
  category: string
  difficulty: "easy" | "moderate" | "challenging"
  groupSize: {
    min: number
    max: number
  }
  includes: string[]
  highlights: string[]
  images: string[]
  rating: number
  reviewCount: number
  availability: boolean
  seasonality: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  customerId: string
  tourPackageId: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  bookingDate: Date
  travelDate: Date
  numberOfPeople: number
  totalPrice: number
  currency: string
  specialRequests: string
  paymentStatus: "pending" | "paid" | "refunded"
  createdAt: Date
  updatedAt: Date
}

export interface RecommendationRequest {
  customerId?: string
  preferences: {
    budget: number
    duration: number
    interests: string[]
    travelStyle: string
    groupSize: number
  }
}

export interface RecommendationResponse {
  recommendations: TourPackage[]
  reasoning: string
  confidence: number
}

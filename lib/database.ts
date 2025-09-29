// In-memory database simulation (can be easily replaced with MongoDB)
import type { Customer, TourPackage, Booking } from "./types"

// Sample data for Tunisian tours
export const sampleTourPackages: TourPackage[] = [
  {
    id: "1",
    name: "Sidi Bou Said & Carthage Discovery",
    description: "Explore the iconic blue and white village of Sidi Bou Said and the ancient ruins of Carthage",
    destinations: ["Sidi Bou Said", "Carthage", "Tunis"],
    duration: 1,
    price: 120,
    currency: "TND",
    category: "Cultural",
    difficulty: "easy",
    groupSize: { min: 2, max: 15 },
    includes: ["Transportation", "Guide", "Entry fees", "Traditional tea"],
    highlights: ["Blue and white architecture", "Ancient Carthage ruins", "Mediterranean views"],
    images: ["/sidi-bou-said-blue-white-buildings-mediterranean-t.jpg"],
    rating: 4.8,
    reviewCount: 124,
    availability: true,
    seasonality: ["spring", "summer", "autumn"],
    tags: ["culture", "history", "photography", "architecture"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Sahara Desert Adventure",
    description: "3-day desert expedition with camel trekking and overnight camping under the stars",
    destinations: ["Douz", "Sahara Desert", "Tozeur"],
    duration: 3,
    price: 450,
    currency: "TND",
    category: "Adventure",
    difficulty: "moderate",
    groupSize: { min: 4, max: 12 },
    includes: ["4WD transport", "Camel trekking", "Desert camping", "All meals", "Berber guide"],
    highlights: ["Camel trekking", "Desert camping", "Sunrise/sunset views", "Berber culture"],
    images: ["/sahara-desert-tunisia-camels-sand-dunes-sunset.jpg"],
    rating: 4.9,
    reviewCount: 89,
    availability: true,
    seasonality: ["autumn", "winter", "spring"],
    tags: ["adventure", "desert", "camping", "culture"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Tunis Medina Cultural Walk",
    description: "Guided walking tour through the UNESCO World Heritage Tunis Medina",
    destinations: ["Tunis Medina", "Zitouna Mosque", "Souk"],
    duration: 0.5,
    price: 60,
    currency: "TND",
    category: "Cultural",
    difficulty: "easy",
    groupSize: { min: 1, max: 20 },
    includes: ["Professional guide", "Entry fees", "Traditional mint tea"],
    highlights: ["UNESCO World Heritage site", "Traditional souks", "Islamic architecture"],
    images: ["/tunis-medina-traditional-souk-market-tunisia-histo.jpg"],
    rating: 4.6,
    reviewCount: 156,
    availability: true,
    seasonality: ["all"],
    tags: ["culture", "history", "walking", "shopping"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Hammamet Beach & Spa Retreat",
    description: "Relaxing beach day with traditional hammam spa experience",
    destinations: ["Hammamet", "Nabeul"],
    duration: 1,
    price: 180,
    currency: "TND",
    category: "Beach",
    difficulty: "easy",
    groupSize: { min: 2, max: 10 },
    includes: ["Beach access", "Hammam session", "Lunch", "Transportation"],
    highlights: ["Mediterranean beaches", "Traditional spa", "Local pottery visit"],
    images: ["/hammamet-beach-tunisia-mediterranean-coast.jpg"],
    rating: 4.7,
    reviewCount: 92,
    availability: true,
    seasonality: ["spring", "summer", "autumn"],
    tags: ["beach", "relaxation", "spa", "wellness"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Kairouan Holy City Pilgrimage",
    description: "Spiritual journey to the fourth holiest city in Islam",
    destinations: ["Kairouan", "Great Mosque", "Aghlabid Basins"],
    duration: 1,
    price: 100,
    currency: "TND",
    category: "Cultural",
    difficulty: "easy",
    groupSize: { min: 3, max: 25 },
    includes: ["Transportation", "Guide", "Entry fees", "Traditional lunch"],
    highlights: ["Great Mosque of Kairouan", "Islamic architecture", "Carpet weaving"],
    images: ["/kairouan-great-mosque-tunisia-islamic-architecture.jpg"],
    rating: 4.5,
    reviewCount: 78,
    availability: true,
    seasonality: ["all"],
    tags: ["culture", "religion", "history", "architecture"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// In-memory storage
const customers: Customer[] = []
const bookings: Booking[] = []
const tourPackages: TourPackage[] = [...sampleTourPackages]

// Database operations
export const db = {
  // Customer operations
  customers: {
    create: (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">): Customer => {
      const newCustomer: Customer = {
        ...customer,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      customers.push(newCustomer)
      return newCustomer
    },
    findById: (id: string): Customer | undefined => {
      return customers.find((c) => c.id === id)
    },
    findByEmail: (email: string): Customer | undefined => {
      return customers.find((c) => c.email === email)
    },
    update: (id: string, updates: Partial<Customer>): Customer | null => {
      const index = customers.findIndex((c) => c.id === id)
      if (index === -1) return null
      customers[index] = { ...customers[index], ...updates, updatedAt: new Date() }
      return customers[index]
    },
    getAll: (): Customer[] => customers,
  },

  // Tour package operations
  tourPackages: {
    getAll: (): TourPackage[] => tourPackages,
    findById: (id: string): TourPackage | undefined => {
      return tourPackages.find((t) => t.id === id)
    },
    findByCategory: (category: string): TourPackage[] => {
      return tourPackages.filter((t) => t.category.toLowerCase() === category.toLowerCase())
    },
    search: (query: string): TourPackage[] => {
      const lowerQuery = query.toLowerCase()
      return tourPackages.filter(
        (t) =>
          t.name.toLowerCase().includes(lowerQuery) ||
          t.description.toLowerCase().includes(lowerQuery) ||
          t.destinations.some((d) => d.toLowerCase().includes(lowerQuery)) ||
          t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
      )
    },
  },

  // Booking operations
  bookings: {
    create: (booking: Omit<Booking, "id" | "createdAt" | "updatedAt">): Booking => {
      const newBooking: Booking = {
        ...booking,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      bookings.push(newBooking)
      return newBooking
    },
    findById: (id: string): Booking | undefined => {
      return bookings.find((b) => b.id === id)
    },
    findByCustomerId: (customerId: string): Booking[] => {
      return bookings.filter((b) => b.customerId === customerId)
    },
    update: (id: string, updates: Partial<Booking>): Booking | null => {
      const index = bookings.findIndex((b) => b.id === id)
      if (index === -1) return null
      bookings[index] = { ...bookings[index], ...updates, updatedAt: new Date() }
      return bookings[index]
    },
    getAll: (): Booking[] => bookings,
  },
}

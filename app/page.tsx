"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { RecommendationForm } from "@/components/recommendation-form"
import { TripResults } from "@/components/trip-results"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [recommendations, setRecommendations] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)

  const handleFormSubmit = (formData: any, recommendationData: any) => {
    console.log("[v0] Form submitted with data:", formData)
    console.log("[v0] Received recommendations:", recommendationData)
    setRecommendations(recommendationData)
    setShowResults(true)
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <RecommendationForm onSubmit={handleFormSubmit} />
      <TripResults recommendations={recommendations} isVisible={showResults} />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </main>
  )
}

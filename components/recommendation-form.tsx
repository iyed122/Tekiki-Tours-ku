"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sparkles, Search } from "./icons"

interface FormData {
  budget: number[]
  duration: string
  interests: string[]
  travelStyle: string
  groupSize: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

interface RecommendationFormProps {
  onSubmit?: (data: FormData, recommendations: any) => void
}

export function RecommendationForm({ onSubmit }: RecommendationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    budget: [2000],
    duration: "",
    interests: [],
    travelStyle: "",
    groupSize: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const interests = [
    { id: "beach", label: "Beach & Relaxation" },
    { id: "culture", label: "Culture & History" },
    { id: "adventure", label: "Adventure & Sports" },
    { id: "nature", label: "Nature & Wildlife" },
    { id: "food", label: "Food & Cuisine" },
    { id: "nightlife", label: "Nightlife & Entertainment" },
    { id: "photography", label: "Photography" },
    { id: "wellness", label: "Wellness & Spa" },
  ]

  const handleInterestChange = (interestId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked ? [...prev.interests, interestId] : prev.interests.filter((id) => id !== interestId),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const customerResponse = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          preferences: {
            budget: formData.budget[0],
            duration: Number.parseInt(formData.duration.split("-")[0]) || 1,
            interests: formData.interests,
            travelStyle: formData.travelStyle,
            groupSize: getGroupSizeNumber(formData.groupSize),
          },
        }),
      })

      if (!customerResponse.ok) {
        throw new Error("Failed to create customer profile")
      }

      const customer = await customerResponse.json()

      const recommendationResponse = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          preferences: {
            budget: formData.budget[0],
            duration: Number.parseInt(formData.duration.split("-")[0]) || 1,
            interests: formData.interests,
            travelStyle: formData.travelStyle,
            groupSize: getGroupSizeNumber(formData.groupSize),
          },
        }),
      })

      if (!recommendationResponse.ok) {
        throw new Error("Failed to get recommendations")
      }

      const recommendations = await recommendationResponse.json()

      onSubmit?.(formData, { customer, recommendations })

      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
    } catch (err) {
      console.error("Error submitting form:", err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getGroupSizeNumber = (groupSize: string): number => {
    switch (groupSize) {
      case "Solo":
        return 1
      case "Couple":
        return 2
      case "Family":
        return 4
      case "Group (4+)":
        return 6
      default:
        return 2
    }
  }

  return (
    <section id="discover" className="py-20 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            Tell Us About Your <span className="text-primary">Dream Trip</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Our AI will analyze your preferences and recommend the perfect destinations just for you
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              AI Travel Planner
            </CardTitle>
            <CardDescription className="text-base">
              Fill out your preferences and let our AI create personalized recommendations
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information Section */}
              <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
                <Label className="text-lg font-semibold">Your Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                </div>
              </div>

              {/* Budget Section */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">What's your budget? (TND)</Label>
                <div className="px-4">
                  <Slider
                    value={formData.budget}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}
                    max={5000}
                    min={100}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>100 TND</span>
                    <span className="font-semibold text-primary">{formData.budget[0]} TND</span>
                    <span>5,000+ TND</span>
                  </div>
                </div>
              </div>

              {/* Duration Section */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">How long is your trip?</Label>
                <RadioGroup
                  value={formData.duration}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {["1-3 days", "4-7 days", "1-2 weeks", "2+ weeks"].map((duration) => (
                    <div key={duration} className="flex items-center space-x-2">
                      <RadioGroupItem value={duration} id={duration} />
                      <Label htmlFor={duration} className="cursor-pointer">
                        {duration}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Interests Section */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">What interests you? (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {interests.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest.id}
                        checked={formData.interests.includes(interest.id)}
                        onCheckedChange={(checked) => handleInterestChange(interest.id, checked as boolean)}
                      />
                      <Label htmlFor={interest.id} className="cursor-pointer text-sm">
                        {interest.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Style Section */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">What's your travel style?</Label>
                <RadioGroup
                  value={formData.travelStyle}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, travelStyle: value }))}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {["Budget-friendly", "Mid-range comfort", "Luxury experience"].map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <RadioGroupItem value={style} id={style} />
                      <Label htmlFor={style} className="cursor-pointer">
                        {style}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Group Size Section */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Group size</Label>
                <RadioGroup
                  value={formData.groupSize}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, groupSize: value }))}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {["Solo", "Couple", "Family", "Group (4+)"].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <RadioGroupItem value={size} id={size} />
                      <Label htmlFor={size} className="cursor-pointer">
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Error Message Section */}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg py-6"
                  disabled={
                    isLoading ||
                    !formData.duration ||
                    !formData.travelStyle ||
                    !formData.groupSize ||
                    !formData.customerName ||
                    !formData.customerEmail
                  }
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />
                      AI is finding your perfect trips...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Find My Perfect Trip
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

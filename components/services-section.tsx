import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  MapPin,
  Calendar,
  Car,
  Hotel,
  Compass,
  Camera,
  Utensils,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: Sparkles,
      title: "AI Tunisia Planning",
      description:
        "Personalized Tunisian itineraries created by AI that understands local culture, weather, and hidden gems.",
      features: ["Instant recommendations", "Local pricing", "Cultural matching", "Seasonal optimization"],
      price: "Free",
      popular: true,
    },
    {
      icon: MapPin,
      title: "Hidden Tunisia Discovery",
      description:
        "Uncover secret spots from Sidi Bou Said to Chott el Djerid with insider knowledge from Nabeul locals.",
      features: ["Secret locations", "Local insider tips", "Cultural guides", "Best visiting times"],
      price: "Free",
      popular: false,
    },
    {
      icon: Calendar,
      title: "Smart Tunisia Itinerary",
      description: "Detailed day-by-day plans optimized for Tunisian distances, traffic, and local schedules.",
      features: ["Day-by-day planning", "Route optimization", "Local timing", "Activity coordination"],
      price: "50 TND/trip",
      popular: false,
    },
    {
      icon: Car,
      title: "Tunisia Transport & Booking",
      description: "Local transport solutions, accommodation booking, and activity reservations across Tunisia.",
      features: ["Local transport", "Hotel booking", "Activity reservations", "Group discounts"],
      price: "Commission-based",
      popular: false,
    },
    {
      icon: Hotel,
      title: "Authentic Accommodation",
      description:
        "From traditional riads to beachfront hotels, find accommodations that match your Tunisian adventure.",
      features: ["Authentic stays", "Budget matching", "Location scoring", "Local reviews"],
      price: "Free",
      popular: false,
    },
    {
      icon: Compass,
      title: "Tunisia Navigation",
      description:
        "Complete navigation support including car rentals, public transport guides, and local transfer services.",
      features: ["Car rental deals", "Public transport", "Local transfers", "Desert navigation"],
      price: "Free",
      popular: false,
    },
  ]

  const additionalServices = [
    {
      icon: Camera,
      title: "Tunisia Photography Tours",
      description: "Capture Tunisia's beauty with local photographers who know the best angles and golden hour spots.",
    },
    {
      icon: Utensils,
      title: "Tunisian Culinary Journey",
      description:
        "Authentic food tours, cooking classes, and restaurant recommendations from Nabeul's culinary experts.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
            Our Services
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            Everything You Need for <span className="text-primary">Perfect Tunisia Travel</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
            From AI-powered planning to local booking assistance, we provide comprehensive services to make your
            Tunisian journey seamless and authentically unforgettable.
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`relative border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 ${
                service.popular ? "ring-2 ring-primary/20" : ""
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">{service.price}</span>
                  </div>
                  <Button className="w-full" variant={service.popular ? "default" : "outline"}>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="border-t border-border/50 pt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Authentic Tunisian Experiences</h3>
            <p className="text-lg text-muted-foreground">
              Unique cultural experiences curated by Nabeul locals and Tunisian cultural ambassadors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {additionalServices.map((service, index) => (
              <Card
                key={index}
                className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                      <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="max-w-4xl mx-auto border-border/50 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-3xl font-bold mb-4">Ready to Explore Tunisia?</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of travelers who have discovered authentic Tunisia with Tekiki Tours
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8">
                  Plan My Tunisia Trip
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  View Tunisia Itineraries
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

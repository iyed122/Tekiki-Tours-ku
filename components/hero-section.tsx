import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Calendar, DollarSign } from "./icons"

export function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/20 to-secondary/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-balance mb-8 leading-tight">
            <span className="text-foreground">Discover</span>
            <br />
            <span className="text-primary">Tunisia's Hidden Treasures</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground text-pretty mb-12 leading-relaxed">
            Experience authentic Tunisian adventures with AI-powered recommendations from local experts. From the
            ancient medinas to pristine beaches, discover the magic of Tunisia with personalized tours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Planning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              Explore Tunisia
            </Button>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Local Pricing</h3>
              <p className="text-muted-foreground text-sm">Authentic Tunisian experiences at local prices</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Local Expertise</h3>
              <p className="text-muted-foreground text-sm">Born in Nabeul, we know Tunisia's best-kept secrets</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible</h3>
              <p className="text-muted-foreground text-sm">From desert adventures to coastal relaxation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

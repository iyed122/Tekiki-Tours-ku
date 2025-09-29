import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, Award, MapPin, Zap, Shield } from "lucide-react"

export function AboutSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description:
        "Our advanced AI combines local knowledge with smart recommendations to create perfectly personalized Tunisian adventures.",
    },
    {
      icon: Users,
      title: "Local Expertise",
      description:
        "Born and raised in Nabeul, our team knows every corner of Tunisia - from bustling souks to hidden oases.",
    },
    {
      icon: Award,
      title: "Award-Winning Service",
      description:
        "Recognized for excellence in Tunisian tourism with over 5,000 satisfied travelers exploring our homeland.",
    },
    {
      icon: MapPin,
      title: "Tunisia Specialists",
      description:
        "Deep connections across all 24 governorates of Tunisia with authentic local partnerships and experiences.",
    },
    {
      icon: Zap,
      title: "Instant Planning",
      description:
        "Get personalized Tunisian recommendations in seconds. Plan your perfect Tunisia trip faster than ever before.",
    },
    {
      icon: Shield,
      title: "Trusted & Secure",
      description: "Your data is protected and your safety ensured. Travel Tunisia with confidence and local support.",
    },
  ]

  const stats = [
    { number: "5K+", label: "Happy Travelers" },
    { number: "24", label: "Governorates" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Local Support" },
  ]

  return (
    <section id="about" className="py-20 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
            About Tekiki Tours
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            Your Gateway to <span className="text-primary">Authentic Tunisia</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
            Based in the heart of Nabeul, we combine cutting-edge AI technology with deep local knowledge to create
            unforgettable Tunisian experiences. From the Sahara to the Mediterranean, discover Tunisia like a local.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <Card className="max-w-4xl mx-auto border-border/50 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To share the authentic beauty of Tunisia with the world through personalized, intelligent travel
                experiences. We're not just tour guides – we're cultural ambassadors crafting memories that showcase the
                true spirit of Tunisia, powered by local expertise and cutting-edge technology.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

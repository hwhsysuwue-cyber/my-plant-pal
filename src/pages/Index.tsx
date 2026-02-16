import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Droplets, Sun, Sprout, ArrowRight, Truck, ShieldCheck, HeadphonesIcon, CreditCard, Star, Users, BarChart3 } from 'lucide-react';

export default function Index() {
  const { user, isAdmin } = useAuth();
  useKeyboardNavigation({ isAdmin });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

        <div className="container relative px-4 sm:px-6 py-20 md:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8">
                <Leaf className="h-4 w-4" />
                Breathe life into your space
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
                Discover beautiful{' '}
                <span className="text-gradient italic">indoor plants</span>{' '}
                for every corner
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed font-light">
                From indoor greens to outdoor blooms — track care schedules, get expert guidance, and build your personal garden collection.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                {user ? (
                  isAdmin ? (
                    <Button asChild size="lg" className="h-13 px-8 text-base rounded-full shadow-glow hover:shadow-glow-lg transition-all font-semibold">
                      <Link to="/admin">
                        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild size="lg" className="h-13 px-8 text-base rounded-full shadow-glow hover:shadow-glow-lg transition-all font-semibold">
                        <Link to="/search">
                          <Search className="mr-2 h-4 w-4" /> Explore Plants
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="h-13 px-8 text-base rounded-full border-2 font-semibold">
                        <Link to="/my-garden">
                          <Leaf className="mr-2 h-4 w-4" /> My Garden
                        </Link>
                      </Button>
                    </>
                  )
                ) : (
                  <>
                    <Button asChild size="lg" className="h-13 px-8 text-base rounded-full shadow-glow hover:shadow-glow-lg transition-all font-semibold">
                      <Link to="/auth?mode=signup">
                        Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-13 px-8 text-base rounded-full border-2 font-semibold">
                      <Link to="/search">Browse Plants</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Hero image area */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-accent/50 border border-border">
                <img
                  src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=1000&fit=crop"
                  alt="Beautiful indoor plants"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-4 shadow-medium">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display">10k+</p>
                    <p className="text-xs text-muted-foreground">Happy Plant Lovers</p>
                  </div>
                </div>
              </div>
              {/* Floating rating card */}
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-2xl p-4 shadow-medium">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-sun fill-sun" />
                  <span className="text-lg font-bold font-display">4.9</span>
                  <span className="text-xs text-muted-foreground">Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Users, value: '1,900+', label: 'Happy Plant Lovers' },
              { icon: Leaf, value: '8,000+', label: 'Thriving Plants' },
              { icon: Star, value: '520+', label: 'Great Reviews' },
              { icon: BarChart3, value: '4.9★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card flex flex-col items-center gap-1">
                <stat.icon className="h-5 w-5 text-primary mb-1" />
                <p className="text-xl font-bold font-display text-foreground">{stat.value}</p>
                <p className="text-2xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-card border-y border-border">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="section-label">Why PlantCare</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Why shop with PlantCare?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We make plant parenting easy, reliable, and fun.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Truck, title: 'Free & Fast Delivery', desc: 'Free delivery on all orders. Get your plants at your doorstep fast.' },
              { icon: HeadphonesIcon, title: '24/7 Customer Support', desc: 'Our plant experts are always ready to help you with any care questions.' },
              { icon: ShieldCheck, title: 'Hassle-Free Returns', desc: 'Changed your mind? Return within 30 days, no questions asked.' },
              { icon: CreditCard, title: 'Secure Payments', desc: 'Pay safely with encrypted payment methods you trust.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="icon-container icon-container-lg bg-accent mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section relative">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="container px-4 sm:px-6 relative">
          <div className="text-center mb-14">
            <p className="section-label">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Everything you need for plant care</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Simple, powerful tools designed to help your plants thrive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Droplets,
                title: 'Smart Watering',
                desc: 'Precise watering schedules tailored to each plant\'s unique needs and seasonal changes.',
              },
              {
                icon: Sun,
                title: 'Light Guidance',
                desc: 'Find the perfect spot for each plant based on detailed sunlight requirement analysis.',
              },
              {
                icon: Sprout,
                title: 'Expert Tips',
                desc: 'Curated care guides for soil, fertilizing, pruning, and everything in between.',
              },
            ].map((feature) => (
              <div key={feature.title} className="feature-card">
                <div className="icon-container icon-container-lg bg-accent mb-5">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 font-display">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="section relative overflow-hidden bg-primary text-primary-foreground">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-[20%] w-64 h-64 bg-white rounded-full blur-[100px]" />
            <div className="absolute bottom-10 right-[20%] w-48 h-48 bg-white rounded-full blur-[80px]" />
          </div>
          <div className="container px-4 sm:px-6 relative">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-foreground/20 backdrop-blur mb-6">
                <Leaf className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight font-display">Start your plant journey today</h2>
              <p className="text-primary-foreground/80 mb-8 text-lg max-w-md mx-auto font-light">
                Join thousands of plant enthusiasts who trust PlantCare for healthier, happier plants.
              </p>
              <Button asChild size="lg" variant="secondary" className="h-13 px-10 text-base rounded-full font-semibold shadow-strong">
                <Link to="/auth?mode=signup">
                  Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

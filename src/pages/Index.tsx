import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Droplets, Sun, Sprout, ArrowRight, Star, Users, Clock } from 'lucide-react';

export default function Index() {
  const { user, isAdmin } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 pattern-dots opacity-40" />
        
        <div className="container relative px-4 sm:px-6 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Leaf className="h-4 w-4" />
              <span>Your Plant Care Companion</span>
            </div>
            
            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground mb-6 animate-fade-in-up text-balance">
              Grow Healthier Plants with{' '}
              <span className="text-gradient">Expert Care</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-1 text-balance">
              Discover personalized care routines, track your garden, and get expert guidance for every plant you own.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2">
              {user ? (
                isAdmin ? (
                  <Button asChild size="lg" className="h-12 px-8 text-base rounded-xl">
                    <Link to="/admin">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="h-12 px-8 text-base rounded-xl">
                      <Link to="/search">
                        <Search className="mr-2 h-4 w-4" />
                        Explore Plants
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl">
                      <Link to="/my-garden">
                        <Leaf className="mr-2 h-4 w-4" />
                        My Garden
                      </Link>
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button asChild size="lg" className="h-12 px-8 text-base rounded-xl shadow-soft hover:shadow-card transition-shadow">
                    <Link to="/auth?mode=signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fade-in-up stagger-3">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-semibold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Plants</div>
              </div>
              <div className="text-center border-x border-border">
                <div className="text-2xl md:text-3xl font-display font-semibold text-foreground">10k+</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-semibold text-foreground">4.9</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Star className="h-3 w-3 fill-sun text-sun" /> Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-primary font-medium mb-3 tracking-wide uppercase text-sm">Features</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 text-balance">
              Everything for Plant Care
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From watering schedules to sunlight requirements, we've got your plants covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature Card 1 */}
            <div className="group bg-card p-8 rounded-2xl border border-border/50 shadow-soft hover:shadow-card transition-all duration-300">
              <div className="h-14 w-14 rounded-xl bg-water/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Droplets className="h-7 w-7 text-water" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Smart Watering</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get precise watering schedules tailored to each plant's needs and your local climate.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group bg-card p-8 rounded-2xl border border-border/50 shadow-soft hover:shadow-card transition-all duration-300">
              <div className="h-14 w-14 rounded-xl bg-sun/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sun className="h-7 w-7 text-sun" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Light Guidance</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find the perfect spot for your plants based on their unique sunlight requirements.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group bg-card p-8 rounded-2xl border border-border/50 shadow-soft hover:shadow-card transition-all duration-300">
              <div className="h-14 w-14 rounded-xl bg-soil/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sprout className="h-7 w-7 text-soil" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Care Tips</h3>
              <p className="text-muted-foreground leading-relaxed">
                Expert recommendations for soil, fertilizing, and essential care routines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-28">
        <div className="container px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-primary font-medium mb-3 tracking-wide uppercase text-sm">Why PlantCare</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6 text-balance">
                The smarter way to care for your plants
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Whether you're a beginner or an experienced gardener, our platform makes plant care effortless and enjoyable.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Smart Reminders</h4>
                    <p className="text-muted-foreground text-sm">Never miss a watering or care task with personalized notifications.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Expert Knowledge</h4>
                    <p className="text-muted-foreground text-sm">Access curated care guides written by botanical experts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Personal Garden</h4>
                    <p className="text-muted-foreground text-sm">Build and manage your own virtual garden collection.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-leaf-light via-mint to-secondary overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary/20 animate-pulse-soft" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="h-24 w-24 text-primary animate-float" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-terracotta/20 -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-water/20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 md:py-28">
          <div className="container px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 bg-primary text-primary-foreground">
              <div className="absolute inset-0 pattern-dots opacity-10" />
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 text-balance">
                  Start Your Plant Journey Today
                </h2>
                <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                  Join thousands of plant lovers who trust PlantCare for their gardening needs.
                </p>
                <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base rounded-xl">
                  <Link to="/auth?mode=signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

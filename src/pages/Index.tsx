import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Droplets, Sun, Sprout, ArrowRight, Star, Users, Clock, Shield, Heart, Sparkles } from 'lucide-react';

export default function Index() {
  const { user, isAdmin } = useAuth();

  // Enable keyboard navigation (Alt + Arrow keys)
  useKeyboardNavigation({ isAdmin });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 pattern-dots" />
        
        <div className="container relative px-4 sm:px-6 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>Your Personal Plant Care Companion</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 animate-fade-in-up text-balance leading-[1.1]">
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
                  <Button asChild size="lg" className="h-12 px-8 text-base rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300">
                    <Link to="/admin">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="h-12 px-8 text-base rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300">
                      <Link to="/search">
                        <Search className="mr-2 h-5 w-5" />
                        Explore Plants
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl hover:bg-secondary transition-all duration-300">
                      <Link to="/my-garden">
                        <Leaf className="mr-2 h-5 w-5" />
                        My Garden
                      </Link>
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button asChild size="lg" className="h-12 px-8 text-base rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300">
                    <Link to="/auth?mode=signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl hover:bg-secondary transition-all duration-300">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto animate-fade-in-up stagger-3">
              <div className="stat-card px-2 sm:px-4 py-3 sm:py-4">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">500+</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Plants</div>
              </div>
              <div className="stat-card px-2 sm:px-4 py-3 sm:py-4">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">10k+</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Users</div>
              </div>
              <div className="stat-card px-2 sm:px-4 py-3 sm:py-4">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-1">
                  4.9
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-sun text-sun" />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-secondary/30">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Everything You Need for Plant Care
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From watering schedules to sunlight requirements, we've got your plants covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="feature-card group animate-fade-in-up stagger-1">
              <div className="icon-container-lg bg-water/10 mb-5 group-hover:bg-water/15 transition-colors">
                <Droplets className="h-7 w-7 text-water" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Smart Watering</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get precise watering schedules tailored to each plant's needs and your local climate.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card group animate-fade-in-up stagger-2">
              <div className="icon-container-lg bg-sun/10 mb-5 group-hover:bg-sun/15 transition-colors">
                <Sun className="h-7 w-7 text-sun" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Light Guidance</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find the perfect spot for your plants based on their unique sunlight requirements.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card group animate-fade-in-up stagger-3">
              <div className="icon-container-lg bg-leaf/10 mb-5 group-hover:bg-leaf/15 transition-colors">
                <Sprout className="h-7 w-7 text-leaf" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Expert Care Tips</h3>
              <p className="text-muted-foreground leading-relaxed">
                Expert recommendations for soil, fertilizing, and essential care routines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section">
        <div className="container px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="animate-fade-in">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Why PlantCare</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance leading-tight">
                The smarter way to care for your plants
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                Whether you're a beginner or an experienced gardener, our platform makes plant care effortless and enjoyable.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="icon-container-md bg-primary/10 flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Smart Reminders</h4>
                    <p className="text-muted-foreground text-sm">Never miss a watering or care task with personalized notifications.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="icon-container-md bg-primary/10 flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Expert Knowledge</h4>
                    <p className="text-muted-foreground text-sm">Access curated care guides written by botanical experts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="icon-container-md bg-primary/10 flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Personal Garden</h4>
                    <p className="text-muted-foreground text-sm">Build and manage your own virtual garden collection with ease.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual */}
            <div className="relative animate-fade-in-up hidden lg:block">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-leaf-light via-mint to-secondary flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-primary/10 animate-pulse-soft" />
                </div>
                <Leaf className="h-32 w-32 text-primary animate-float" />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -right-4 top-1/4 bg-card rounded-2xl p-4 shadow-medium border border-border animate-float stagger-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-water/10 flex items-center justify-center">
                    <Droplets className="h-5 w-5 text-water" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Water in</p>
                    <p className="font-semibold text-sm">2 days</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-4 bottom-1/4 bg-card rounded-2xl p-4 shadow-medium border border-border animate-float stagger-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sun/10 flex items-center justify-center">
                    <Sun className="h-5 w-5 text-sun" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Light level</p>
                    <p className="font-semibold text-sm">Perfect</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="section">
          <div className="container px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 gradient-cta text-white animate-fade-in-up">
              <div className="absolute inset-0 pattern-dots opacity-10" />
              
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Join 10,000+ plant lovers
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance">
                  Start Your Plant Journey Today
                </h2>
                <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                  Join thousands of plant enthusiasts who trust PlantCare for their gardening needs.
                </p>
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/auth?mode=signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
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

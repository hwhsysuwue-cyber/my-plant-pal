import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Droplets, Sun, Sprout, ArrowRight, Star, Users, Clock, Sparkles, Shield, Heart } from 'lucide-react';

export default function Index() {
  const { user, isAdmin } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 pattern-dots opacity-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="container relative px-4 sm:px-6 py-20 md:py-28 lg:py-40">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-sm font-medium mb-8 animate-fade-in shadow-soft backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Your Personal Plant Care Companion</span>
            </div>
            
            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground mb-8 animate-fade-in-up text-balance leading-[1.1]">
              Grow Healthier Plants with{' '}
              <span className="text-gradient relative">
                Expert Care
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-1 text-balance">
              Discover personalized care routines, track your garden, and get expert guidance for every plant you own.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2">
              {user ? (
                isAdmin ? (
                  <Button asChild size="lg" className="h-14 px-10 text-base rounded-2xl shadow-colored hover:shadow-glow transition-all duration-300 group">
                    <Link to="/admin">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="h-14 px-10 text-base rounded-2xl shadow-colored hover:shadow-glow transition-all duration-300 group">
                      <Link to="/search">
                        <Search className="mr-2 h-5 w-5" />
                        Explore Plants
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-14 px-10 text-base rounded-2xl bg-background/50 backdrop-blur-sm hover:bg-background transition-all duration-300 group">
                      <Link to="/my-garden">
                        <Leaf className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                        My Garden
                      </Link>
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button asChild size="lg" className="h-14 px-10 text-base rounded-2xl shadow-colored hover:shadow-glow transition-all duration-300 group">
                    <Link to="/auth?mode=signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-14 px-10 text-base rounded-2xl bg-background/50 backdrop-blur-sm hover:bg-background transition-all duration-300">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-3 gap-6 max-w-xl mx-auto animate-fade-in-up stagger-3">
              <div className="stat-card text-center py-6">
                <div className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-1">500+</div>
                <div className="text-sm text-muted-foreground font-medium">Plants</div>
              </div>
              <div className="stat-card text-center py-6">
                <div className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-1">10k+</div>
                <div className="text-sm text-muted-foreground font-medium">Happy Users</div>
              </div>
              <div className="stat-card text-center py-6">
                <div className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-1 flex items-center justify-center gap-1">
                  4.9
                  <Star className="h-5 w-5 fill-sun text-sun" />
                </div>
                <div className="text-sm text-muted-foreground font-medium">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="page-section relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-30" />
        
        <div className="container px-4 sm:px-6 relative">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-flex items-center gap-2 text-primary font-medium mb-4 tracking-wide uppercase text-sm">
              <div className="h-px w-8 bg-primary/40" />
              Features
              <div className="h-px w-8 bg-primary/40" />
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-5 text-balance">
              Everything for Plant Care
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              From watering schedules to sunlight requirements, we've got your plants covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature Card 1 */}
            <div className="feature-card group animate-fade-in-up stagger-1">
              <div className="icon-container-lg bg-water/10 mb-6 group-hover:scale-110 group-hover:bg-water/15 transition-all duration-400">
                <Droplets className="h-7 w-7 text-water" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Smart Watering</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get precise watering schedules tailored to each plant's needs and your local climate conditions.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="feature-card group animate-fade-in-up stagger-2">
              <div className="icon-container-lg bg-sun/10 mb-6 group-hover:scale-110 group-hover:bg-sun/15 transition-all duration-400">
                <Sun className="h-7 w-7 text-sun" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Light Guidance</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find the perfect spot for your plants based on their unique sunlight requirements.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="feature-card group animate-fade-in-up stagger-3">
              <div className="icon-container-lg bg-soil/10 mb-6 group-hover:scale-110 group-hover:bg-soil/15 transition-all duration-400">
                <Sprout className="h-7 w-7 text-soil" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Care Tips</h3>
              <p className="text-muted-foreground leading-relaxed">
                Expert recommendations for soil, fertilizing, and essential care routines for thriving plants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="page-section bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 pattern-diagonal opacity-50" />
        
        <div className="container px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="animate-fade-in-left">
              <span className="inline-flex items-center gap-2 text-primary font-medium mb-4 tracking-wide uppercase text-sm">
                <div className="h-px w-8 bg-primary/40" />
                Why PlantCare
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 text-balance leading-tight">
                The smarter way to care for your plants
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                Whether you're a beginner or an experienced gardener, our platform makes plant care effortless and enjoyable.
              </p>
              
              <div className="space-y-5">
                <div className="flex items-start gap-5 group">
                  <div className="icon-container-md bg-primary/10 flex-shrink-0 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 text-lg">Smart Reminders</h4>
                    <p className="text-muted-foreground">Never miss a watering or care task with personalized notifications.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 group">
                  <div className="icon-container-md bg-primary/10 flex-shrink-0 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 text-lg">Expert Knowledge</h4>
                    <p className="text-muted-foreground">Access curated care guides written by botanical experts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 group">
                  <div className="icon-container-md bg-primary/10 flex-shrink-0 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 text-lg">Personal Garden</h4>
                    <p className="text-muted-foreground">Build and manage your own virtual garden collection with ease.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in-right">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-leaf-light via-mint to-secondary overflow-hidden relative shadow-float">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-primary/15 animate-pulse-soft" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-primary/20 animate-pulse-soft stagger-2" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="h-28 w-28 text-primary animate-float drop-shadow-lg" />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-3xl bg-terracotta/15 -z-10 animate-float-slow stagger-3" />
              <div className="absolute -top-6 -left-6 w-28 h-28 rounded-3xl bg-water/15 -z-10 animate-float-slow stagger-5" />
              
              {/* Floating badges */}
              <div className="absolute -right-4 top-1/4 bg-card rounded-2xl p-4 shadow-elevated border border-border/30 animate-float stagger-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-water/15 flex items-center justify-center">
                    <Droplets className="h-5 w-5 text-water" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Water in</p>
                    <p className="font-semibold">2 days</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-4 bottom-1/4 bg-card rounded-2xl p-4 shadow-elevated border border-border/30 animate-float stagger-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sun/15 flex items-center justify-center">
                    <Sun className="h-5 w-5 text-sun" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Light level</p>
                    <p className="font-semibold">Perfect</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="page-section">
          <div className="container px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-[2rem] p-12 md:p-20 gradient-forest text-primary-foreground shadow-hero animate-fade-in-up">
              <div className="absolute inset-0 pattern-dots opacity-10" />
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-3xl translate-y-1/2 -translate-x-1/4" />
              
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium mb-8 backdrop-blur-sm border border-white/10">
                  <Users className="h-4 w-4" />
                  Join 10,000+ plant lovers
                </div>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 text-balance leading-tight">
                  Start Your Plant Journey Today
                </h2>
                <p className="text-primary-foreground/85 text-lg md:text-xl mb-10 leading-relaxed">
                  Join thousands of plant enthusiasts who trust PlantCare for their gardening needs.
                </p>
                <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Link to="/auth?mode=signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
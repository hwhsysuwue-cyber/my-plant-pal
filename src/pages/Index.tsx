import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Droplets, Sun, Sprout, ArrowRight, Sparkles, Heart, Shield } from 'lucide-react';

export default function Index() {
  const { user, isAdmin } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 pattern-dots opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-glow pointer-events-none" />
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 left-[10%] w-20 h-20 rounded-full bg-leaf/10 blur-2xl animate-float" />
        <div className="absolute top-40 right-[15%] w-32 h-32 rounded-full bg-terracotta/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-[20%] w-24 h-24 rounded-full bg-water/10 blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-[10%] w-16 h-16 rounded-full bg-sun/15 blur-xl animate-float" style={{ animationDelay: '0.5s' }} />

        <div className="container relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border/50 shadow-soft text-sm font-medium mb-8 animate-fade-in-down">
              <Sparkles className="h-4 w-4 text-terracotta" />
              <span className="text-muted-foreground">Your Personal Plant Care Companion</span>
            </div>
            
            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-foreground mb-8 animate-fade-in-up text-balance" style={{ animationDelay: '0.1s' }}>
              Nurture Your Green
              <span className="block mt-2 text-gradient-forest">Companions with Care</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up text-balance" style={{ animationDelay: '0.2s' }}>
              Discover the perfect care routines for your plants. Build your personal garden collection and access expert guidance for every leaf and bloom.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {user ? (
                isAdmin ? (
                  <Button asChild size="lg" className="text-base h-14 px-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300">
                    <Link to="/admin">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="text-base h-14 px-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300">
                      <Link to="/search">
                        <Search className="mr-2 h-5 w-5" />
                        Explore Plants
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="text-base h-14 px-8 rounded-2xl bg-card hover:bg-secondary transition-all duration-300">
                      <Link to="/my-garden">
                        <Leaf className="mr-2 h-5 w-5" />
                        My Garden
                      </Link>
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button asChild size="lg" className="text-base h-14 px-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300">
                    <Link to="/auth?mode=signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-base h-14 px-8 rounded-2xl bg-card hover:bg-secondary transition-all duration-300">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4 text-terracotta" />
                <span>Loved by plant parents</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-leaf" />
                <span>Expert-backed guidance</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-sun" />
                <span>Personalized care</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-secondary/40" />
        <div className="absolute inset-0 pattern-grid" />
        
        <div className="container relative">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-primary mb-4 tracking-wide uppercase">Features</span>
            <h2 className="font-display text-4xl md:text-5xl font-normal mb-6 text-balance">
              Everything You Need for
              <span className="block text-gradient-forest">Happy, Thriving Plants</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From watering schedules to sunlight requirements, we've got your plant care covered with expert guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {/* Feature Card 1 */}
            <div className="group relative bg-card p-8 lg:p-10 rounded-3xl shadow-card border border-border/50 transition-all duration-500 hover:shadow-elevated hover:-translate-y-1">
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 gradient-glow" />
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-water/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Droplets className="h-8 w-8 text-water" />
                </div>
                <h3 className="font-display text-2xl font-normal mb-4">Watering Guidance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Know exactly when and how much to water each plant in your collection for optimal growth.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative bg-card p-8 lg:p-10 rounded-3xl shadow-card border border-border/50 transition-all duration-500 hover:shadow-elevated hover:-translate-y-1">
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 gradient-glow" />
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-sun/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sun className="h-8 w-8 text-sun" />
                </div>
                <h3 className="font-display text-2xl font-normal mb-4">Light Requirements</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find the perfect spot for your plants based on their unique sunlight needs and preferences.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative bg-card p-8 lg:p-10 rounded-3xl shadow-card border border-border/50 transition-all duration-500 hover:shadow-elevated hover:-translate-y-1">
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 gradient-glow" />
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-soil/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sprout className="h-8 w-8 text-soil" />
                </div>
                <h3 className="font-display text-2xl font-normal mb-4">Soil & Care Tips</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get tailored recommendations for soil types and essential care routines for each plant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-24 lg:py-32">
          <div className="container">
            <div className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 lg:p-20">
              {/* Background */}
              <div className="absolute inset-0 gradient-forest" />
              <div className="absolute inset-0 pattern-dots opacity-10" />
              
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/10 blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h2 className="font-display text-4xl md:text-5xl font-normal text-primary-foreground mb-6 text-balance">
                  Start Your Plant Journey Today
                </h2>
                <p className="text-primary-foreground/80 text-lg mb-10 leading-relaxed">
                  Join thousands of plant enthusiasts who trust PlantCare for their gardening needs. It's free to get started.
                </p>
                <Button asChild size="lg" variant="secondary" className="text-base h-14 px-10 rounded-2xl shadow-elevated hover:scale-105 transition-all duration-300">
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

      {/* Footer Section */}
      <footer className="py-12 border-t border-border/50">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-forest">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-normal text-foreground">PlantCare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PlantCare. Nurturing plants, one leaf at a time.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
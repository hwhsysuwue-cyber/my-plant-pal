import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Droplets, Sun, Sprout, ArrowRight } from 'lucide-react';

export default function Index() {
  const { user, isAdmin } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-leaf-light/30" />
        <div className="container relative py-12 sm:py-24 lg:py-32 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Leaf className="h-4 w-4" />
              Your Personal Plant Care Companion
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Nurture Your Green
              <span className="text-gradient-forest block">Companions with Care</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Discover the perfect care routines for your plants. Build your personal garden collection and access expert guidance for every leaf and bloom.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {user ? (
                isAdmin ? (
                  <Button asChild size="lg" className="text-base">
                    <Link to="/admin">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="text-base">
                      <Link to="/search">
                        <Search className="mr-2 h-5 w-5" />
                        Explore Plants
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="text-base">
                      <Link to="/my-garden">
                        <Leaf className="mr-2 h-5 w-5" />
                        My Garden
                      </Link>
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button asChild size="lg" className="text-base">
                    <Link to="/auth?mode=signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-base">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements - hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-20 left-10 h-32 w-32 rounded-full bg-leaf/10 blur-3xl" />
        <div className="hidden sm:block absolute bottom-20 right-10 h-40 w-40 rounded-full bg-terracotta/10 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold mb-4">
              Everything You Need for Happy Plants
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From watering schedules to sunlight requirements, we've got your plant care covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-card border border-border/50 text-center group hover:shadow-elevated transition-shadow">
              <div className="h-16 w-16 rounded-2xl bg-water/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Droplets className="h-8 w-8 text-water" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Watering Guidance</h3>
              <p className="text-muted-foreground">
                Know exactly when and how much to water each plant in your collection.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-card border border-border/50 text-center group hover:shadow-elevated transition-shadow">
              <div className="h-16 w-16 rounded-2xl bg-sun/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sun className="h-8 w-8 text-sun" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Light Requirements</h3>
              <p className="text-muted-foreground">
                Find the perfect spot for your plants based on their sunlight needs.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-card border border-border/50 text-center group hover:shadow-elevated transition-shadow">
              <div className="h-16 w-16 rounded-2xl bg-soil/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sprout className="h-8 w-8 text-soil" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Soil & Care Tips</h3>
              <p className="text-muted-foreground">
                Get recommendations for soil types and essential care routines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl gradient-forest p-6 sm:p-12 text-center">
              <div className="relative z-10">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                  Start Your Plant Journey Today
                </h2>
                <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                  Join thousands of plant enthusiasts who trust PlantCare for their gardening needs.
                </p>
                <Button asChild size="lg" variant="secondary" className="text-base">
                  <Link to="/auth?mode=signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary-foreground/10 blur-3xl" />
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Droplets, Sun, Sprout, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Index() {
  const { user, isAdmin } = useAuth();
  useKeyboardNavigation({ isAdmin });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 gradient-hero" />
        <div className="container relative px-4 sm:px-6 py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6">
              <Leaf className="h-3 w-3" />
              Plant Care Made Simple
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-5 text-balance leading-[1.1]">
              Your plants deserve{' '}
              <span className="text-gradient">better care</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed text-balance">
              Track watering schedules, get expert guidance, and build your personal garden collection — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {user ? (
                isAdmin ? (
                  <Button asChild size="lg">
                    <Link to="/admin">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link to="/search">
                        <Search className="mr-2 h-4 w-4" /> Explore Plants
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/my-garden">
                        <Leaf className="mr-2 h-4 w-4" /> My Garden
                      </Link>
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link to="/auth?mode=signup">
                      Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/search">Browse Plants</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats row */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div><span className="font-semibold text-foreground">500+</span> Plants</div>
              <div className="h-4 w-px bg-border" />
              <div><span className="font-semibold text-foreground">10k+</span> Users</div>
              <div className="h-4 w-px bg-border" />
              <div><span className="font-semibold text-foreground">4.9</span> Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section border-t border-border">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest text-primary mb-2">Features</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Everything you need for plant care</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Simple tools to help your plants thrive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="feature-card">
              <div className="icon-container icon-container-md bg-water/10 mb-4">
                <Droplets className="h-5 w-5 text-water" />
              </div>
              <h3 className="font-semibold mb-1.5">Smart Watering</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Precise watering schedules tailored to each plant's needs.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-container icon-container-md bg-sun/10 mb-4">
                <Sun className="h-5 w-5 text-sun" />
              </div>
              <h3 className="font-semibold mb-1.5">Light Guidance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Find the perfect spot based on sunlight requirements.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-container icon-container-md bg-leaf/10 mb-4">
                <Sprout className="h-5 w-5 text-leaf" />
              </div>
              <h3 className="font-semibold mb-1.5">Expert Tips</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Curated care guides for soil, fertilizing, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="container px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-medium uppercase tracking-widest text-primary mb-2">Why PlantCare</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-8">The smarter way to care for your plants</h2>
            
            <div className="space-y-4">
              {[
                { title: 'Smart Reminders', desc: 'Never miss a watering or care task with personalized notifications.' },
                { title: 'Expert Knowledge', desc: 'Access curated care guides written by botanical experts.' },
                { title: 'Personal Garden', desc: 'Build and manage your own virtual garden collection.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm mb-0.5">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="section border-t border-border">
          <div className="container px-4 sm:px-6">
            <div className="max-w-lg mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Start your plant journey today</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of plant enthusiasts who trust PlantCare.
              </p>
              <Button asChild size="lg">
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

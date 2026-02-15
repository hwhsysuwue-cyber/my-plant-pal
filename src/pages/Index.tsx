import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Droplets, Sun, Sprout, ArrowRight, CheckCircle2, Zap, Shield, BarChart3 } from 'lucide-react';

export default function Index() {
  const { user, isAdmin } = useAuth();
  useKeyboardNavigation({ isAdmin });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 pattern-dots opacity-40" />
        
        {/* Decorative orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[15%] w-96 h-96 bg-water/5 rounded-full blur-3xl" />

        <div className="container relative px-4 sm:px-6 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8 shadow-soft">
              <Zap className="h-3.5 w-3.5" />
              Plant Care Made Simple
              <ArrowRight className="h-3.5 w-3.5" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance leading-[1.08]">
              Your plants deserve{' '}
              <span className="text-gradient">better care</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed text-balance">
              Track watering schedules, get expert guidance, and build your personal garden collection — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {user ? (
                isAdmin ? (
                  <Button asChild size="lg" className="h-12 px-8 text-base rounded-xl shadow-glow hover:shadow-glow-lg transition-all">
                    <Link to="/admin">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="h-12 px-8 text-base rounded-xl shadow-glow hover:shadow-glow-lg transition-all">
                      <Link to="/search">
                        <Search className="mr-2 h-4 w-4" /> Explore Plants
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl border-2">
                      <Link to="/my-garden">
                        <Leaf className="mr-2 h-4 w-4" /> My Garden
                      </Link>
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button asChild size="lg" className="h-12 px-8 text-base rounded-xl shadow-glow hover:shadow-glow-lg transition-all">
                    <Link to="/auth?mode=signup">
                      Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl border-2">
                    <Link to="/search">Browse Plants</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats row */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { value: '500+', label: 'Plants' },
                { value: '10k+', label: 'Users' },
                { value: '4.9', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label} className="stat-card">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
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
            <p className="text-muted-foreground max-w-lg mx-auto text-base">
              Simple, powerful tools designed to help your plants thrive — from watering to sunlight guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Droplets,
                color: 'text-water',
                bg: 'bg-water/10',
                title: 'Smart Watering',
                desc: 'Precise watering schedules tailored to each plant\'s unique needs and seasonal changes.',
              },
              {
                icon: Sun,
                color: 'text-sun',
                bg: 'bg-sun/10',
                title: 'Light Guidance',
                desc: 'Find the perfect spot for each plant based on detailed sunlight requirement analysis.',
              },
              {
                icon: Sprout,
                color: 'text-leaf',
                bg: 'bg-leaf/10',
                title: 'Expert Tips',
                desc: 'Curated care guides for soil, fertilizing, pruning, and everything in between.',
              },
            ].map((feature) => (
              <div key={feature.title} className="feature-card">
                <div className={`icon-container icon-container-lg ${feature.bg} mb-5`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-card border-y border-border">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="section-label">Why PlantCare</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The smarter way to care for your plants</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: Zap, title: 'Smart Reminders', desc: 'Never miss a watering or care task with personalized notifications that adapt to your schedule.' },
                { icon: Shield, title: 'Expert Knowledge', desc: 'Access curated care guides written by botanical experts, tailored to your specific plants.' },
                { icon: BarChart3, title: 'Personal Garden', desc: 'Build and manage your own virtual garden collection with detailed tracking and insights.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-5 rounded-xl border border-border bg-background hover:border-primary/20 hover:shadow-soft transition-all duration-300">
                  <div className="icon-container icon-container-md bg-primary/10 flex-shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="section relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh" />
          <div className="container px-4 sm:px-6 relative">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl gradient-primary mb-6 shadow-glow">
                <Leaf className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Start your plant journey today</h2>
              <p className="text-muted-foreground mb-8 text-base max-w-md mx-auto">
                Join thousands of plant enthusiasts who trust PlantCare for healthier, happier plants.
              </p>
              <Button asChild size="lg" className="h-12 px-8 text-base rounded-xl shadow-glow hover:shadow-glow-lg transition-all">
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

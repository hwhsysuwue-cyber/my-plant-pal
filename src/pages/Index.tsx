import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-botanical.png';
import {
  Leaf, Droplets, Sun, Wind, ArrowRight,
  Star, ChevronRight, Quote
} from 'lucide-react';

export default function Index() {
  const { user, isAdmin } = useAuth();
  useKeyboardNavigation({ isAdmin });

  const features = [
    {
      icon: Droplets,
      title: 'Precise Watering',
      desc: 'Learn the exact watering schedules for each species to keep roots healthy and foliage thriving.',
    },
    {
      icon: Sun,
      title: 'Light Optimization',
      desc: 'Position your plants for ideal light exposure, from bright indirect to gentle shade lovers.',
    },
    {
      icon: Wind,
      title: 'Climate Control',
      desc: 'Master humidity and temperature to recreate the natural habitats your plants crave.',
    },
  ];

  const collection = [
    {
      name: 'Fiddle Leaf Fig',
      latin: 'Ficus lyrata',
      care: 'Bright indirect light · Water weekly',
      img: 'https://images.unsplash.com/photo-1545165375-7c3b2fb18b1e?w=500&h=600&fit=crop',
    },
    {
      name: 'Snake Plant',
      latin: 'Sansevieria trifasciata',
      care: 'Low to bright light · Water bi-weekly',
      img: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=500&h=600&fit=crop',
    },
    {
      name: 'Philodendron',
      latin: 'Philodendron hederaceum',
      care: 'Medium indirect light · Keep soil moist',
      img: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=500&h=600&fit=crop',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Plant Enthusiast',
      text: 'Absolutely love this plant shop! Beautiful, healthy plants and a great selection. The staff was super helpful in recommending the perfect plant for my home.',
      rating: 5,
    },
    {
      name: 'Emily R.',
      role: 'Interior Designer',
      text: "The atmosphere is so calming — I'll definitely be back! Beautiful, healthy plants and a great selection. The staff was super helpful in recommending the perfect plant.",
      rating: 5,
    },
    {
      name: 'David K.',
      role: 'Garden Hobbyist',
      text: "Best online plant store I've used. Everything arrives healthy and well-packaged. Their care guides are incredibly helpful for a beginner like me.",
      rating: 5,
    },
  ];

  return (
    <Layout>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col bg-background">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Botanical plant background"
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/95" />
        </div>

        <div className="container relative px-6 lg:px-8 pt-36 pb-28 flex-1 flex flex-col justify-center max-w-[680px]">
          <p className="text-foreground/35 text-[10px] tracking-[0.45em] uppercase font-medium mb-6">
            Premium Plant Care
          </p>

          <h1 className="font-display font-bold leading-[1] tracking-tight mb-6">
            <span className="block text-[clamp(38px,6vw,68px)] text-primary">PLANT</span>
            <span className="block text-[clamp(38px,6vw,68px)] text-foreground">CARE</span>
          </h1>

          <p className="text-foreground/50 text-[15px] leading-[1.75] mb-9 max-w-[400px]">
            Nurture your green companions with expert guidance. Discover the art of plant care that transforms any space into a living sanctuary.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            {user ? (
              isAdmin ? (
                <Button asChild className="rounded-none h-11 px-9 text-[11px] font-bold tracking-[0.18em] uppercase bg-primary hover:bg-primary/90 text-primary-foreground shadow-none">
                  <Link to="/admin">DASHBOARD <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
                </Button>
              ) : (
                <>
                  <Button asChild className="rounded-none h-11 px-9 text-[11px] font-bold tracking-[0.18em] uppercase bg-primary hover:bg-primary/90 text-primary-foreground shadow-none">
                    <Link to="/search">EXPLORE</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-none h-11 px-9 text-[11px] font-bold tracking-[0.18em] uppercase border-foreground/20 text-foreground hover:bg-foreground/5 bg-transparent shadow-none">
                    <Link to="/my-garden">MY GARDEN</Link>
                  </Button>
                </>
              )
            ) : (
              <>
                <Button asChild className="rounded-none h-11 px-9 text-[11px] font-bold tracking-[0.18em] uppercase bg-primary hover:bg-primary/90 text-primary-foreground shadow-none">
                  <Link to="/search">EXPLORE</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-none h-11 px-9 text-[11px] font-bold tracking-[0.18em] uppercase border-foreground/20 text-foreground hover:bg-foreground/5 bg-transparent shadow-none">
                  <Link to="/auth?mode=signup">GET STARTED</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== PHILOSOPHY ===== */}
      <section className="bg-card py-24 md:py-32">
        <div className="container px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 mb-18">
            <div>
              <p className="text-primary text-[10px] tracking-[0.35em] uppercase font-medium mb-7">Our Philosophy</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1]">
                The art of{' '}
                <em className="not-italic text-[hsl(var(--gold))]">nurturing</em>
                {' '}green life
              </h2>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <p className="text-foreground/50 text-sm leading-[1.8]">
                Every plant tells a story. We combine botanical science with intuitive care practices to help you build a deeper connection with your indoor garden.
              </p>
              <p className="text-foreground/50 text-sm leading-[1.8]">
                From tropical monstera to resilient succulents, our premium care guides ensure your plants don't just survive — they flourish.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="rounded-xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&h=600&fit=crop"
                alt="Plant leaves close up"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-8">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-5">
                  <div className="h-10 w-10 rounded-lg bg-foreground/5 border border-border flex items-center justify-center flex-shrink-0">
                    <f.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold text-sm mb-1.5 tracking-wide">{f.title}</h3>
                    <p className="text-foreground/40 text-sm leading-[1.7]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED COLLECTION ===== */}
      <section className="bg-background py-24 md:py-32">
        <div className="container px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary text-[10px] tracking-[0.35em] uppercase font-medium mb-5">Featured Collection</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              Become a{' '}
              <em className="not-italic text-[hsl(var(--gold))]">favorite</em>
              {' '}of your guests
            </h2>
            <p className="text-foreground/40 text-sm max-w-sm mx-auto leading-[1.8]">
              Curated selection of indoor plants perfect for any living space, with complete care guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {collection.map((plant) => (
              <Link
                key={plant.name}
                to="/search"
                className="group block border border-border rounded-xl overflow-hidden hover:border-foreground/20 transition-colors duration-300 bg-card"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={plant.img}
                    alt={plant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-foreground font-bold text-base mb-1 font-display">{plant.name}</h3>
                  <p className="text-primary text-xs italic mb-2">{plant.latin}</p>
                  <p className="text-foreground/35 text-xs">{plant.care}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" className="rounded-none h-11 px-10 text-[11px] font-bold tracking-[0.18em] uppercase border-foreground/20 text-foreground hover:bg-foreground/5 bg-transparent">
              <Link to="/search">VIEW ALL PLANTS <ChevronRight className="ml-2 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-card py-24 md:py-32">
        <div className="container px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary text-[10px] tracking-[0.35em] uppercase font-medium mb-5">Testimonials</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">What our community says</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, idx) => (
              <div
                key={t.name}
                className={`p-7 border border-border rounded-xl bg-background ${idx === 1 ? 'md:-translate-y-3' : ''}`}
              >
                <Quote className="h-6 w-6 text-primary/25 mb-5" />
                <p className="text-foreground/50 text-sm leading-[1.8] mb-7">{t.text}</p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-[hsl(var(--gold))] fill-[hsl(var(--gold))]" />
                  ))}
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm">{t.name}</p>
                  <p className="text-foreground/30 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="relative overflow-hidden bg-background py-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1470058869958-2a77e919a0d0?w=1400&h=500&fit=crop"
            alt="Plants"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-background/75" />
        </div>
        <div className="container relative px-6 lg:px-8 text-center">
          <p className="text-primary text-[10px] tracking-[0.35em] uppercase font-medium mb-5">Stay in the Loop</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Get the green in your inbox</h2>
          <p className="text-foreground/40 text-sm mb-9 max-w-xs mx-auto leading-[1.8]">
            Subscribe for exclusive plant care tips, new arrivals and fresh deals.
          </p>
          <div className="flex items-center gap-0 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 h-11 px-5 text-sm bg-foreground/8 text-foreground placeholder:text-foreground/25 border border-foreground/15 border-r-0 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <Button className="rounded-none h-11 px-7 text-[11px] font-bold tracking-[0.18em] uppercase bg-primary hover:bg-primary/90 text-primary-foreground shadow-none">
              SUBSCRIBE
            </Button>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      {!user && (
        <section className="bg-card py-20 border-t border-border">
          <div className="container px-6 lg:px-8 text-center">
            <Leaf className="h-8 w-8 text-primary mx-auto mb-5" />
            <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4">Start your plant journey today</h2>
            <p className="text-foreground/35 text-sm mb-9 max-w-xs mx-auto leading-[1.8]">
              Join thousands of plant enthusiasts who trust PlantCare for healthier, happier plants.
            </p>
            <Button asChild className="rounded-none h-11 px-12 text-[11px] font-bold tracking-[0.18em] uppercase bg-primary hover:bg-primary/90 text-primary-foreground shadow-none">
              <Link to="/auth?mode=signup">CREATE FREE ACCOUNT <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </section>
      )}
    </Layout>
  );
}

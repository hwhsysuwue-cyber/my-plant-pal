import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-botanical.png';
import {
  Leaf, Search, Droplets, Sun, Sprout, ArrowRight, Truck, ShieldCheck,
  HeadphonesIcon, CreditCard, Star, Users, BarChart3, Play, Quote, Mail,
  ChevronRight, Heart, Eye
} from 'lucide-react';

export default function Index() {
  const { user, isAdmin } = useAuth();
  useKeyboardNavigation({ isAdmin });

  const stats = [
    { label: 'Trusted by', value: '1,900+', sub: 'Happy Plant Lovers', icon: Heart },
    { label: 'Explore', value: '8,000+', sub: 'Unique Green Beauties', icon: Eye },
    { label: 'Backed by', value: '520+', sub: 'Local Greenhouses', icon: Users },
    { label: 'Rated', value: '4.9', sub: 'by Our Customers', star: true, icon: Star },
  ];

  const whyFeatures = [
    { icon: Truck, title: 'Free & Fast Delivery', desc: 'Plants delivered fresh to your door — free on orders over $50.' },
    { icon: HeadphonesIcon, title: '24/7 Customer Support', desc: "We're here whenever you need us — day or night." },
    { icon: ShieldCheck, title: 'Hassle-Free Returns', desc: 'Changed your mind? Return it within 30 days, no stress.' },
    { icon: CreditCard, title: 'Secure Payments', desc: 'Pay safely with 100% encrypted checkout.' },
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
      text: 'Best online plant store I\'ve used. Everything arrives healthy and well-packaged. Their care guides are incredibly helpful for a beginner like me.',
      rating: 5,
    },
  ];

  const blogPosts = [
    { title: '5 Easy Plants For Beginners', desc: 'Just getting started with plants? These five low-maintenance beauties are perfect for beginners.', date: '08/04/2025', tag: 'Beginner' },
    { title: 'Top 5 Air-Purifying Plants', desc: 'Breathe easy with these leafy friends known for their indoor air benefits.', date: '08/04/2025', tag: 'Health' },
    { title: 'Watering Basics For Houseplants', desc: 'Confused about how often to water? Learn the simple signs and best routines.', date: '08/04/2025', tag: 'Care Tips' },
    { title: 'Low-Light Plants That Thrive', desc: 'Just getting started with plants? These low-maintenance beauties are perfect for beginners.', date: '08/04/2025', tag: 'Indoor' },
  ];

  return (
    <Layout>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[hsl(var(--forest))] min-h-[85vh] flex flex-col">
        {/* Background plant image */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Indoor plants background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--forest))]/90 via-[hsl(var(--forest))]/70 to-[hsl(var(--forest))]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--forest))]/60 to-transparent" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-48 h-48 bg-[hsl(var(--sun))]/5 rounded-full blur-3xl" />

        <div className="container relative px-4 sm:px-6 py-24 md:py-32 lg:py-40 flex-1 flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-primary-foreground/10">
              <Sprout className="h-3.5 w-3.5 text-[hsl(var(--sun))]" />
              <span className="text-primary-foreground/80 text-xs font-medium tracking-wide">Breathe life into your space</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-foreground mb-6 leading-[1.05]">
              Discover beautiful <span className="italic text-[hsl(var(--sun))]">indoor</span> plants for every corner
            </h1>

            <p className="text-primary-foreground/65 mb-10 max-w-lg leading-relaxed text-base md:text-lg">
              From indoor greens to outdoor blooms — track care schedules, get expert guidance, and build your personal garden collection.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              {user ? (
                isAdmin ? (
                  <Button asChild size="lg" className="h-13 px-10 text-sm rounded-full font-semibold bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow">
                    <Link to="/admin">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="h-13 px-10 text-sm rounded-full font-semibold bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow">
                      <Link to="/search"><Search className="mr-2 h-4 w-4" /> Explore Plants</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-13 px-10 text-sm rounded-full font-semibold border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm">
                      <Link to="/my-garden"><Leaf className="mr-2 h-4 w-4" /> My Garden</Link>
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button asChild size="lg" className="h-13 px-10 text-sm rounded-full font-semibold bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow">
                    <Link to="/auth?mode=signup">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <button className="flex items-center gap-3 text-primary-foreground/75 hover:text-primary-foreground transition-colors group">
                    <div className="h-12 w-12 rounded-full border-2 border-primary-foreground/25 flex items-center justify-center group-hover:bg-primary-foreground/10 group-hover:border-primary-foreground/40 transition-all backdrop-blur-sm">
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    </div>
                    <span className="text-sm font-medium">Watch how it works</span>
                  </button>
                </>
              )}
            </div>

            {!user && (
              <p className="text-primary-foreground/40 text-xs flex items-center gap-2">
                <span className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-6 w-6 rounded-full bg-primary-foreground/20 border-2 border-[hsl(var(--forest))]" />
                  ))}
                </span>
                Join 8,000+ plant lovers growing their dream spaces
              </p>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="container px-4 sm:px-6 pb-10 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
            {stats.map((stat) => (
              <div key={stat.sub} className="bg-background/95 backdrop-blur-md rounded-2xl p-5 text-center border border-border/40 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                    <stat.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold font-display text-foreground flex items-center justify-center gap-1">
                  {stat.value}
                  {stat.star && <Star className="h-4 w-4 text-[hsl(var(--sun))] fill-[hsl(var(--sun))]" />}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY SHOP ===== */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="container px-4 sm:px-6 relative">
          <div className="text-center mb-16">
            <span className="section-label">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight font-display">Why Shop with PlantCare?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
              From your screen to your space — we're here to make plant shopping smooth and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto items-center">
            {/* Left features */}
            <div className="space-y-12">
              {whyFeatures.slice(0, 2).map((f) => (
                <div key={f.title} className="flex flex-col items-start md:items-end md:text-right gap-3 group">
                  <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <f.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1.5 font-display">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Center image */}
            <div className="flex justify-center">
              <div className="rounded-3xl overflow-hidden aspect-[3/4] w-full max-w-[300px] bg-accent/30 border border-border shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=530&fit=crop"
                  alt="Beautiful plant"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md rounded-xl p-3 border border-border/50 shadow-lg">
                  <p className="text-xs font-semibold text-foreground">🌿 Monstera Deliciosa</p>
                  <p className="text-[10px] text-muted-foreground">Best seller · Easy care</p>
                </div>
              </div>
            </div>

            {/* Right features */}
            <div className="space-y-12">
              {whyFeatures.slice(2, 4).map((f) => (
                <div key={f.title} className="flex flex-col items-start gap-3 group">
                  <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <f.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1.5 font-display">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES (Indoor / Outdoor) ===== */}
      <section className="py-6 px-4 sm:px-6">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                tag: 'Indoors',
                title: 'Low-Maintenance Greens',
                desc: 'Elevate your interior with easy-care indoor plants. These beauties purify the air, add a calming vibe, and grow beautifully in low to medium light.',
                img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
              },
              {
                tag: 'Outdoors',
                title: 'Garden-Ready Plants',
                desc: 'Bring life to your outdoor space with vibrant, sun-loving plants. Perfect for patios, balconies, and home gardens.',
                img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop',
              },
            ].map((cat) => (
              <div key={cat.title} className="relative rounded-3xl overflow-hidden group h-[320px] shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-[11px] bg-primary/90 text-primary-foreground px-3.5 py-1 rounded-full w-fit mb-3 font-semibold uppercase tracking-wider">{cat.tag}</span>
                  <h3 className="text-2xl font-bold text-white font-display mb-2">{cat.title}</h3>
                  <p className="text-white/65 text-sm leading-relaxed max-w-sm mb-5">{cat.desc}</p>
                  <Button asChild size="sm" className="w-fit rounded-full h-9 px-6 text-xs font-semibold bg-white text-foreground hover:bg-white/90 shadow-md">
                    <Link to="/search">Explore Now <ChevronRight className="ml-1 h-3.5 w-3.5" /></Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES (Plant Care Tools) ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="section-label">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight font-display">Our Favorite Features</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
              Take advantage of our top features — easy to use, hard not to love.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Droplets, title: 'Smart Watering', desc: 'Precise watering schedules tailored to each plant\'s unique needs and seasonal changes.', color: 'text-[hsl(var(--water))]', bg: 'bg-[hsl(var(--water))]/10' },
              { icon: Sun, title: 'Light Guidance', desc: 'Find the perfect spot for each plant based on detailed sunlight requirement analysis.', color: 'text-[hsl(var(--sun))]', bg: 'bg-[hsl(var(--sun))]/10' },
              { icon: Sprout, title: 'Expert Tips', desc: 'Curated care guides for soil, fertilizing, pruning, and everything in between.', color: 'text-primary', bg: 'bg-accent' },
            ].map((f) => (
              <div key={f.title} className="group relative p-8 rounded-3xl bg-card border border-border overflow-hidden text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-[hsl(var(--sun))] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`icon-container icon-container-lg ${f.bg} mx-auto mb-6 rounded-2xl`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2.5 font-display">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="mx-4 sm:mx-6 lg:mx-auto lg:max-w-6xl mb-20">
        <div className="relative rounded-3xl overflow-hidden h-[280px] md:h-[340px] shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=1200&h=400&fit=crop"
            alt="Spring plant sale"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--forest))]/95 via-[hsl(var(--forest))]/70 to-transparent" />
          <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-center max-w-lg">
            <div className="inline-flex items-center gap-2 bg-[hsl(var(--sun))]/20 rounded-full px-3 py-1 w-fit mb-4">
              <span className="text-[hsl(var(--sun))] text-xs font-bold">🔥 Limited Time</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-3 leading-tight">
              Spring into Green — <span className="text-[hsl(var(--sun))]">25% Off</span>
            </h2>
            <p className="text-white/65 text-sm mb-6 leading-relaxed">Bring life to your home with vibrant, easy-care greens — now at a special spring discount.</p>
            <Button asChild size="sm" className="w-fit rounded-full h-11 px-8 text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow">
              <Link to="/search">Shop the Sale <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 md:py-28 bg-[hsl(var(--cream))]">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="section-label">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-display mb-4">Our Happy Customers Say It Best</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">Real reviews from real plant lovers — see why they keep coming back.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, idx) => (
              <div key={t.name} className={`flex flex-col p-7 bg-background rounded-3xl border border-border shadow-sm hover:shadow-lg transition-shadow duration-300 ${idx === 1 ? 'md:-translate-y-4' : ''}`}>
                <Quote className="h-8 w-8 text-primary/15 mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{t.text}</p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-[hsl(var(--sun))] fill-[hsl(var(--sun))]" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full overflow-hidden bg-accent ring-2 ring-border">
                    <img
                      src={`https://images.unsplash.com/photo-${
                        t.name === 'Sarah M.' ? '1494790108377-be9c29b29330' :
                        t.name === 'Emily R.' ? '1438761681033-6461ffad8d80' :
                        '1507003211169-0a1dd7228f2d'
                      }?w=100&h=100&fit=crop&crop=face`}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1470058869958-2a77e919a0d0?w=1400&h=400&fit=crop"
            alt="Plants background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[hsl(var(--forest))]/90" />
        </div>
        <div className="container relative px-4 sm:px-6 py-20 md:py-24 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-5 backdrop-blur-sm border border-primary-foreground/10">
            <Mail className="h-6 w-6 text-primary-foreground/70" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-3">Get the Green in Your Inbox</h2>
          <p className="text-white/55 text-sm mb-8 max-w-md mx-auto leading-relaxed">Subscribe for exclusive plant care tips, new arrivals and fresh deals.</p>
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 h-12 rounded-full px-6 text-sm bg-white/95 text-foreground placeholder:text-muted-foreground border-0 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
            />
            <Button className="rounded-full h-12 px-7 text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="section-label">Our Blog</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight font-display">From the PlantCare Blog</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
              Grow your plant knowledge with expert tips, care guides, and a little leafy inspiration.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <div key={post.title} className="group bg-card rounded-3xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="aspect-[4/3] bg-accent overflow-hidden relative">
                  <img
                    src={`https://images.unsplash.com/photo-${
                      post.title.includes('Beginner') ? '1459411552884-841db9b3cc2a' :
                      post.title.includes('Air') ? '1416879595882-3373a0480b5b' :
                      post.title.includes('Watering') ? '1585320806297-9794b3e4eeae' :
                      '1509423350716-97f9360b4e09'
                    }?w=400&h=300&fit=crop`}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] bg-background/90 backdrop-blur-sm text-foreground px-2.5 py-1 rounded-full font-semibold">{post.tag}</span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[11px] text-muted-foreground mb-2">{post.date}</p>
                  <h3 className="text-sm font-semibold mb-2 font-display leading-snug">{post.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">{post.desc}</p>
                  <Link to="/search" className="text-xs font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
                    Read More <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      {!user && (
        <section className="py-20 md:py-28 gradient-cta text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-10" />
          <div className="container px-4 sm:px-6 relative">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-foreground/10 mb-6 backdrop-blur-sm border border-primary-foreground/10">
                <Leaf className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight font-display leading-tight">Start your plant journey today</h2>
              <p className="text-primary-foreground/60 mb-10 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                Join thousands of plant enthusiasts who trust PlantCare for healthier, happier plants.
              </p>
              <Button asChild size="lg" variant="secondary" className="h-13 px-12 text-sm rounded-full font-semibold shadow-xl hover:shadow-2xl transition-shadow">
                <Link to="/auth?mode=signup">Create Free Account <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Leaf, Search, Droplets, Sun, Sprout, ArrowRight, Truck, ShieldCheck,
  HeadphonesIcon, CreditCard, Star, Users, BarChart3, Play, Quote, Mail
} from 'lucide-react';

export default function Index() {
  const { user, isAdmin } = useAuth();
  useKeyboardNavigation({ isAdmin });

  const stats = [
    { label: 'Trusted by', value: '1,900+', sub: 'Happy Plant Lovers' },
    { label: 'Explore', value: '8,000+', sub: 'Unique Green Beauties' },
    { label: 'Backed by', value: '520+', sub: 'Local Greenhouses' },
    { label: 'Rated', value: '4.9', sub: 'by Our Customers', star: true },
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
      role: 'plant lover',
      text: 'Absolutely love this plant shop! Beautiful, healthy plants and a great selection. The staff was super helpful in recommending the perfect plant for my home.',
      rating: 5,
    },
    {
      name: 'Emily R.',
      role: 'plant lover',
      text: "The atmosphere is so calming — I'll definitely be back! Beautiful, healthy plants and a great selection. The staff was super helpful in recommending the perfect plant.",
      rating: 5,
    },
  ];

  const blogPosts = [
    { title: '5 Easy Plants For Beginners', desc: 'Just getting started with plants? These five low-maintenance beauties are perfect for beginners.', date: '08/04/2025' },
    { title: 'Top 5 Air-Purifying Plants', desc: 'Breathe easy with these leafy friends known for their indoor air benefits.', date: '08/04/2025' },
    { title: 'Watering Basics For Houseplants', desc: 'Confused about how often to water? Learn the simple signs and best routines.', date: '08/04/2025' },
    { title: 'Low-Light Plants That Thrive', desc: 'Just getting started with plants? These low-maintenance beauties are perfect for beginners.', date: '08/04/2025' },
  ];

  return (
    <Layout>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[hsl(var(--forest))]">
        {/* Background plant image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1600&h=900&fit=crop"
            alt="Indoor plants background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--forest))]/90 via-[hsl(var(--forest))]/70 to-transparent" />
        </div>

        <div className="container relative px-4 sm:px-6 py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl">
            <p className="text-primary-foreground/60 text-sm mb-4 tracking-wide">Breathe life into your space</p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary-foreground mb-6 leading-[1.1]">
              Discover beautiful indoor plants for every corner of your home
            </h1>

            <p className="text-primary-foreground/70 mb-8 max-w-md leading-relaxed text-base">
              From indoor greens to outdoor blooms — track care schedules, get expert guidance, and build your personal garden collection.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              {user ? (
                isAdmin ? (
                  <Button asChild size="lg" className="h-12 px-8 text-sm rounded-full font-semibold bg-primary text-primary-foreground">
                    <Link to="/admin">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="h-12 px-8 text-sm rounded-full font-semibold bg-primary text-primary-foreground">
                      <Link to="/search"><Search className="mr-2 h-4 w-4" /> Explore Plants</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-12 px-8 text-sm rounded-full font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                      <Link to="/my-garden"><Leaf className="mr-2 h-4 w-4" /> My Garden</Link>
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button asChild size="lg" className="h-12 px-8 text-sm rounded-full font-semibold bg-primary text-primary-foreground">
                    <Link to="/auth?mode=signup">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <button className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors group">
                    <div className="h-10 w-10 rounded-full border border-primary-foreground/30 flex items-center justify-center group-hover:bg-primary-foreground/10 transition-colors">
                      <Play className="h-4 w-4 fill-current" />
                    </div>
                    <span className="text-sm font-medium">Watch how PlantCare works</span>
                  </button>
                </>
              )}
            </div>

            {!user && (
              <p className="text-primary-foreground/50 text-xs">Join 8,000+ plant lovers growing their dream spaces.</p>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="container px-4 sm:px-6 pb-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
            {stats.map((stat) => (
              <div key={stat.sub} className="bg-background/95 backdrop-blur rounded-xl p-4 text-center border border-border/50">
                <p className="text-xs text-muted-foreground mb-0.5">{stat.label}</p>
                <p className="text-2xl font-bold font-display text-foreground flex items-center justify-center gap-1">
                  {stat.value}
                  {stat.star && <Star className="h-4 w-4 text-sun fill-sun" />}
                </p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY SHOP ===== */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight font-display">Why Shop with PlantCare?</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              From your screen to your space — we're here to make plant shopping smooth and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Left features */}
            <div className="space-y-10">
              {whyFeatures.slice(0, 2).map((f) => (
                <div key={f.title} className="flex flex-col items-start md:items-end md:text-right gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1 font-display">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Center image */}
            <div className="flex justify-center">
              <div className="rounded-3xl overflow-hidden aspect-[3/4] w-full max-w-[280px] bg-accent/30 border border-border">
                <img
                  src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=530&fit=crop"
                  alt="Beautiful plant"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right features */}
            <div className="space-y-10">
              {whyFeatures.slice(2, 4).map((f) => (
                <div key={f.title} className="flex flex-col items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1 font-display">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES (Indoor / Outdoor) ===== */}
      <section className="py-4 px-4 sm:px-6">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-4">
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
                desc: 'Bring life to your outdoor space with vibrant, sun-loving plants. Perfect for patios, balconies, and home gardens. Built to thrive in natural light and fresh air.',
                img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop',
              },
            ].map((cat) => (
              <div key={cat.title} className="relative rounded-2xl overflow-hidden group h-[280px]">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full w-fit mb-3 font-medium">{cat.tag}</span>
                  <h3 className="text-xl font-bold text-white font-display mb-1">{cat.title}</h3>
                  <p className="text-white/70 text-xs leading-relaxed max-w-sm mb-4">{cat.desc}</p>
                  <Button asChild size="sm" variant="outline" className="w-fit rounded-full border-white/30 text-white hover:bg-white/10 text-xs h-8 px-4">
                    <Link to="/search">Explore Now</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES (Plant Care Tools) ===== */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight font-display">Our Favorite Features</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Take advantage of our top features — easy to use, hard not to love.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Droplets, title: 'Smart Watering', desc: 'Precise watering schedules tailored to each plant\'s unique needs and seasonal changes.' },
              { icon: Sun, title: 'Light Guidance', desc: 'Find the perfect spot for each plant based on detailed sunlight requirement analysis.' },
              { icon: Sprout, title: 'Expert Tips', desc: 'Curated care guides for soil, fertilizing, pruning, and everything in between.' },
            ].map((f) => (
              <div key={f.title} className="feature-card text-center">
                <div className="icon-container icon-container-lg bg-accent mx-auto mb-5">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2 font-display">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="mx-4 sm:mx-6 lg:mx-auto lg:max-w-6xl mb-16">
        <div className="relative rounded-2xl overflow-hidden h-[260px] md:h-[300px]">
          <img
            src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=1200&h=400&fit=crop"
            alt="Spring plant sale"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--forest))]/90 to-transparent" />
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-display mb-2">
              Spring into Green — <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground text-sm font-bold">25%</span> Off All Indoor Plants!
            </h2>
            <p className="text-white/70 text-sm mb-5">"Bring life to your home with vibrant, easy-care greens — now at a special spring discount."</p>
            <Button asChild size="sm" className="w-fit rounded-full h-10 px-6 text-sm font-semibold">
              <Link to="/search">Shop the Sale</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 md:py-24 bg-card border-y border-border">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-display">Our Happy Customers Say It Best</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.name} className="flex gap-4 p-6 bg-background rounded-2xl border border-border">
                <div className="shrink-0">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden bg-accent">
                    <img
                      src={`https://images.unsplash.com/photo-${t.name === 'Sarah M.' ? '1494790108377-be9c29b29330' : '1438761681033-6461ffad8d80'}?w=100&h=100&fit=crop&crop=face`}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Quote className="h-4 w-4 text-primary/40" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.text}</p>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-sun fill-sun" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
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
          <div className="absolute inset-0 bg-[hsl(var(--forest))]/85" />
        </div>
        <div className="container relative px-4 sm:px-6 py-16 md:py-20 text-center">
          <Mail className="h-8 w-8 text-primary-foreground/60 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white font-display mb-2">Get the Green in Your Inbox</h2>
          <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">Subscribe for exclusive plant care tips, new arrivals and fresh deals.</p>
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 h-11 rounded-full px-5 text-sm bg-white/95 text-foreground placeholder:text-muted-foreground border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="rounded-full h-11 px-6 text-sm font-semibold">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight font-display">From the PlantCare Blog</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Grow your plant knowledge with expert tips, care guides, and a little leafy inspiration.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <div key={post.title} className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] bg-accent overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${
                      post.title.includes('Beginner') ? '1459411552884-841db9b3cc2a' :
                      post.title.includes('Air') ? '1416879595882-3373a0480b5b' :
                      post.title.includes('Watering') ? '1585320806297-9794b3e4eeae' :
                      '1509423350716-97f9360b4e09'
                    }?w=400&h=300&fit=crop`}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-2">{post.date}</p>
                  <h3 className="text-sm font-semibold mb-1.5 font-display">{post.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">{post.desc}</p>
                  <Button asChild size="sm" className="rounded-full h-8 px-4 text-xs font-semibold">
                    <Link to="/search">Read More</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      {!user && (
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary-foreground/15 mb-5">
                <Leaf className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight font-display">Start your plant journey today</h2>
              <p className="text-primary-foreground/70 mb-8 text-base max-w-md mx-auto">
                Join thousands of plant enthusiasts who trust PlantCare for healthier, happier plants.
              </p>
              <Button asChild size="lg" variant="secondary" className="h-12 px-10 text-sm rounded-full font-semibold">
                <Link to="/auth?mode=signup">Create Free Account <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

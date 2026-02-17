import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Leaf, Search, ShoppingCart, ArrowRight } from 'lucide-react';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return null;

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Plants', path: '/search' },
    { label: 'Plant Care', path: '/search' },
    { label: 'About', path: '/' },
    { label: 'Contact', path: '/feedback' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/30 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight font-display text-foreground">PlantCare</span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
                location.pathname === item.path && item.label === 'Home'
                  ? 'text-primary bg-accent font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-accent" onClick={() => navigate('/search')}>
            <Search className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="rounded-full px-6 h-9 text-sm font-semibold hidden sm:flex shadow-md hover:shadow-lg transition-shadow"
            onClick={() => navigate('/auth?mode=signup')}
          >
            Get Started <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

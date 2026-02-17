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
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border/40">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight font-display">PlantCare</span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-0.5 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                location.pathname === item.path && item.label === 'Home'
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" onClick={() => navigate('/search')}>
            <Search className="h-4.5 w-4.5" />
          </Button>
          <Button
            size="sm"
            className="rounded-full px-5 h-9 text-sm font-semibold hidden sm:flex"
            onClick={() => navigate('/auth?mode=signup')}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}

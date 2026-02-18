import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return null;

  const navItems = [
    { label: 'COLLECTION', path: '/search' },
    { label: 'CARE GUIDES', path: '/search' },
    { label: 'ABOUT', path: '/' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full border-b border-white/10">
      <div className="container flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold tracking-[0.15em] uppercase text-white font-display">PlantCare</span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[11px]">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-200 font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign In */}
        <Button
          size="sm"
          className="rounded-none px-7 h-9 text-xs font-bold tracking-[0.15em] uppercase bg-primary text-white hover:bg-primary/90 shadow-none border-0"
          onClick={() => navigate('/auth')}
        >
          SIGN IN
        </Button>
      </div>
    </header>
  );
}

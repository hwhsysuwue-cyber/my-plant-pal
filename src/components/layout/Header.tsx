import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Leaf, ArrowRight } from 'lucide-react';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
            <Leaf className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">PlantCare</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {[
            { label: 'Home', path: '/' },
            { label: 'Plants', path: '/search' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'text-foreground font-semibold bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-sm rounded-lg" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
          <Button size="sm" className="text-sm rounded-xl shadow-glow hover:shadow-glow-lg transition-all" onClick={() => navigate('/auth?mode=signup')}>
            Get Started
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

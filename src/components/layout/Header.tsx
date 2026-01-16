import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Home, LogOut, User, MessageSquare, Bell, Users, Menu, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
    const baseClass = mobile
      ? "flex items-center gap-3 px-4 py-3 text-foreground rounded-xl transition-all duration-200"
      : "flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200";
    
    const activeClass = mobile
      ? "bg-primary/10 text-primary font-medium"
      : "text-primary bg-primary/10";
    
    const inactiveClass = mobile
      ? "hover:bg-secondary hover:translate-x-1"
      : "text-muted-foreground hover:text-foreground hover:bg-secondary";

    const getLinkClass = (path: string) => 
      `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;

    return (
      <>
        <Link
          to="/"
          className={getLinkClass('/')}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span>Home</span>
        </Link>
        <Link
          to="/search"
          className={getLinkClass('/search')}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span>Search</span>
        </Link>
        {user && !isAdmin && (
          <>
            <Link
              to="/my-garden"
              className={getLinkClass('/my-garden')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Leaf className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>My Garden</span>
            </Link>
            <Link
              to="/reminders"
              className={getLinkClass('/reminders')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Bell className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Reminders</span>
            </Link>
            <Link
              to="/feedback"
              className={getLinkClass('/feedback')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Feedback</span>
            </Link>
          </>
        )}
        {isAdmin && (
          <>
            <Link
              to="/admin"
              className={getLinkClass('/admin')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Settings className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Plants</span>
            </Link>
            <Link
              to="/admin/users"
              className={getLinkClass('/admin/users')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Users className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Users</span>
            </Link>
            <Link
              to="/admin/reminders"
              className={getLinkClass('/admin/reminders')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Bell className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Reminders</span>
            </Link>
            <Link
              to="/admin/feedback"
              className={getLinkClass('/admin/feedback')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Feedback</span>
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 animate-slide-in-down">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 transition-all duration-200 hover:opacity-80 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary transition-transform duration-200 group-hover:scale-105">
            <Leaf className="h-5 w-5 text-white transition-transform duration-200 group-hover:rotate-12" />
          </div>
          <span className="text-lg font-bold text-foreground">
            PlantCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLinks />
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9 transition-all duration-200 hover:scale-105 hover:shadow-soft">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 animate-scale-in">
                  <div className="px-3 py-2.5 bg-secondary/50 rounded-lg mb-2">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">
                      {isAdmin ? 'Administrator' : 'Member'}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="my-1" />
                  {!isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/my-garden')} className="rounded-lg cursor-pointer transition-colors">
                        <Leaf className="mr-2 h-4 w-4" />
                        My Garden
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/reminders')} className="rounded-lg cursor-pointer transition-colors">
                        <Bell className="mr-2 h-4 w-4" />
                        Reminders
                      </DropdownMenuItem>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="rounded-lg cursor-pointer transition-colors">
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Plants
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/users')} className="rounded-lg cursor-pointer transition-colors">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Users
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg transition-transform hover:scale-105">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 p-0">
                  <SheetHeader className="p-5 border-b border-border">
                    <SheetTitle className="flex items-center gap-2.5 text-left">
                      <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center">
                        <Leaf className="h-4 w-4 text-white" />
                      </div>
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 p-4">
                    <NavLinks mobile />
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              {/* Auth buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" className="h-9 px-4 rounded-lg press-effect" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button className="h-9 px-4 rounded-lg shadow-glow hover:shadow-glow-lg transition-all press-effect" onClick={() => navigate('/auth?mode=signup')}>
                  Get Started
                </Button>
              </div>

              {/* Mobile auth buttons */}
              <div className="flex sm:hidden items-center gap-2">
                <Button variant="ghost" size="sm" className="rounded-lg press-effect" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button size="sm" className="rounded-lg press-effect" onClick={() => navigate('/auth?mode=signup')}>
                  Sign Up
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

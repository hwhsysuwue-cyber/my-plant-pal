import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Home, LogOut, Settings, User, MessageSquare, Bell, Users, Menu } from 'lucide-react';
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
      ? "flex items-center gap-3 px-4 py-3 text-foreground rounded-xl transition-colors"
      : "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors";
    
    const activeClass = mobile
      ? "bg-primary/10 text-primary"
      : "text-primary bg-primary/5";
    
    const inactiveClass = mobile
      ? "hover:bg-secondary"
      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50";

    const getLinkClass = (path: string) => 
      `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;

    return (
      <>
        <Link
          to="/"
          className={getLinkClass('/')}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link
          to="/search"
          className={getLinkClass('/search')}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </Link>
        {user && !isAdmin && (
          <>
            <Link
              to="/my-garden"
              className={getLinkClass('/my-garden')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Leaf className="h-4 w-4" />
              <span>My Garden</span>
            </Link>
            <Link
              to="/reminders"
              className={getLinkClass('/reminders')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Bell className="h-4 w-4" />
              <span>Reminders</span>
            </Link>
            <Link
              to="/feedback"
              className={getLinkClass('/feedback')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4" />
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
              <Settings className="h-4 w-4" />
              <span>Plants</span>
            </Link>
            <Link
              to="/admin/users"
              className={getLinkClass('/admin/users')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
            </Link>
            <Link
              to="/admin/reminders"
              className={getLinkClass('/admin/reminders')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Bell className="h-4 w-4" />
              <span>Reminders</span>
            </Link>
            <Link
              to="/admin/feedback"
              className={getLinkClass('/admin/feedback')}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Feedback</span>
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-soft">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-medium text-foreground">
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
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">
                      {isAdmin ? 'Administrator' : 'Member'}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  {!isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/my-garden')}>
                        <Leaf className="mr-2 h-4 w-4" />
                        My Garden
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/reminders')}>
                        <Bell className="mr-2 h-4 w-4" />
                        Reminders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/feedback')}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Feedback
                      </DropdownMenuItem>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Plants
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                        <Users className="mr-2 h-4 w-4" />
                        Manage Users
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/reminders')}>
                        <Bell className="mr-2 h-4 w-4" />
                        Manage Reminders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/feedback')}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Manage Feedback
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 p-0">
                  <SheetHeader className="p-6 pb-4 border-b border-border">
                    <SheetTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-primary" />
                      Navigation
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
              {/* Auth buttons - Desktop */}
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/auth?mode=signup')}>
                  Get Started
                </Button>
              </div>

              {/* Auth buttons - Mobile */}
              <div className="flex sm:hidden items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/auth?mode=signup')}>
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

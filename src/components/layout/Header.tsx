import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Home, LogOut, Settings, User, MessageSquare, Bell, Users, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
    const linkClass = mobile
      ? "flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors"
      : "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors";

    return (
      <>
        <Link
          to="/"
          className={linkClass}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
        <Link
          to="/search"
          className={linkClass}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          <Search className="h-4 w-4" />
          Search Plants
        </Link>
        {user && !isAdmin && (
          <>
            <Link
              to="/my-garden"
              className={linkClass}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Leaf className="h-4 w-4" />
              My Garden
            </Link>
            <Link
              to="/reminders"
              className={linkClass}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Bell className="h-4 w-4" />
              Reminders
            </Link>
            <Link
              to="/feedback"
              className={linkClass}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </Link>
          </>
        )}
        {isAdmin && (
          <>
            <Link
              to="/admin"
              className={linkClass}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Plants
            </Link>
            <Link
              to="/admin/users"
              className={linkClass}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link
              to="/admin/reminders"
              className={linkClass}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <Bell className="h-4 w-4" />
              Reminders
            </Link>
            <Link
              to="/admin/feedback"
              className={linkClass}
              onClick={() => mobile && setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-forest">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            PlantCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* User Dropdown - visible on all screen sizes */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium truncate">
                    {user.email}
                  </div>
                  <div className="px-2 pb-1.5 text-xs text-muted-foreground capitalize">
                    {isAdmin ? 'Administrator' : 'User'}
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
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-primary" />
                      Navigation
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 mt-6">
                    <NavLinks mobile />
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              {/* Auth buttons - responsive */}
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth?mode=signup')}>
                  Get Started
                </Button>
              </div>

              {/* Mobile: Compact auth buttons only (no hamburger menu) */}
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

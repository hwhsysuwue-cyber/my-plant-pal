import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Leaf, Search, Home, LogOut, Settings, User, MessageSquare, Bell, Users, Menu, ChevronRight } from 'lucide-react';
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
      ? "flex items-center gap-3 px-4 py-3.5 text-foreground rounded-xl transition-all duration-200"
      : "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200";
    
    const activeClass = mobile
      ? "bg-primary/10 text-primary font-medium"
      : "text-primary bg-primary/8";
    
    const inactiveClass = mobile
      ? "hover:bg-secondary/80"
      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60";

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
    <header className="sticky top-0 z-50 w-full border-b border-border/30 glass">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-forest shadow-soft">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            PlantCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-secondary/40 rounded-2xl p-1.5 backdrop-blur-sm border border-border/30">
          <NavLinks />
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background hover:border-primary/20 transition-all duration-200">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl shadow-elevated border-border/50">
                  <div className="px-3 py-3 mb-2 bg-secondary/50 rounded-xl">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5 flex items-center gap-1">
                      {isAdmin ? (
                        <>
                          <Settings className="h-3 w-3" />
                          Administrator
                        </>
                      ) : (
                        <>
                          <Leaf className="h-3 w-3" />
                          Member
                        </>
                      )}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="my-2" />
                  {!isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/my-garden')} className="rounded-xl py-2.5 cursor-pointer">
                        <Leaf className="mr-3 h-4 w-4" />
                        My Garden
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/reminders')} className="rounded-xl py-2.5 cursor-pointer">
                        <Bell className="mr-3 h-4 w-4" />
                        Reminders
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/feedback')} className="rounded-xl py-2.5 cursor-pointer">
                        <MessageSquare className="mr-3 h-4 w-4" />
                        Feedback
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </DropdownMenuItem>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="rounded-xl py-2.5 cursor-pointer">
                        <Settings className="mr-3 h-4 w-4" />
                        Manage Plants
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/users')} className="rounded-xl py-2.5 cursor-pointer">
                        <Users className="mr-3 h-4 w-4" />
                        Manage Users
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/reminders')} className="rounded-xl py-2.5 cursor-pointer">
                        <Bell className="mr-3 h-4 w-4" />
                        Manage Reminders
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/feedback')} className="rounded-xl py-2.5 cursor-pointer">
                        <MessageSquare className="mr-3 h-4 w-4" />
                        Manage Feedback
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-xl py-2.5 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary/60">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0 rounded-l-3xl">
                  <SheetHeader className="p-6 pb-4 border-b border-border/40">
                    <SheetTitle className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl gradient-forest flex items-center justify-center">
                        <Leaf className="h-4 w-4 text-primary-foreground" />
                      </div>
                      Navigation
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 p-4">
                    <NavLinks mobile />
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              {/* Auth buttons - Desktop */}
              <div className="hidden sm:flex items-center gap-3">
                <Button variant="ghost" className="h-10 px-5 rounded-xl hover:bg-secondary/60" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button className="h-10 px-5 rounded-xl shadow-colored hover:shadow-glow transition-all duration-300" onClick={() => navigate('/auth?mode=signup')}>
                  Get Started
                </Button>
              </div>

              {/* Auth buttons - Mobile */}
              <div className="flex sm:hidden items-center gap-2">
                <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button size="sm" className="rounded-xl shadow-soft" onClick={() => navigate('/auth?mode=signup')}>
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
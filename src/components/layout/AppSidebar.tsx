import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NavLink } from '@/components/NavLink';
import {
  Search, Leaf, Bell, MessageSquare, Settings, Users, LogOut, Home,
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const userItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Search', url: '/search', icon: Search },
  { title: 'My Garden', url: '/my-garden', icon: Leaf },
  { title: 'Reminders', url: '/reminders', icon: Bell },
  { title: 'Feedback', url: '/feedback', icon: MessageSquare },
];

const adminItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Search', url: '/search', icon: Search },
  { title: 'Plants', url: '/admin', icon: Settings },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Reminders', url: '/admin/reminders', icon: Bell },
  { title: 'Feedback', url: '/admin/feedback', icon: MessageSquare },
];

export function AppSidebar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const items = isAdmin ? adminItems : userItems;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-base font-bold text-sidebar-foreground tracking-tight font-display">PlantCare</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/40 font-semibold px-3">
            {isAdmin ? 'Admin' : 'Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/' || item.url === '/admin'}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Separator className="mb-3 bg-sidebar-border" />
        {user && (
          <div className="space-y-2">
            {!collapsed && (
              <div className="px-3 py-2 rounded-xl bg-sidebar-accent/50">
                <p className="text-xs font-semibold truncate text-sidebar-foreground">{user.email}</p>
                <p className="text-[10px] text-sidebar-foreground/50 capitalize font-medium">{isAdmin ? 'Admin' : 'Member'}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2.5 text-sidebar-foreground/50 hover:text-destructive hover:bg-sidebar-accent rounded-xl"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar" style={{ '--sidebar-width': '220px' } as React.CSSProperties}>
      <SidebarHeader className="p-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold text-sidebar-foreground tracking-[0.08em] uppercase font-display">PlantCare</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[9px] uppercase tracking-[0.2em] text-sidebar-foreground/35 font-semibold px-3 mb-1">
            {isAdmin ? 'Admin' : 'Menu'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/' || item.url === '/admin'}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-150"
                      activeClassName="bg-sidebar-accent text-sidebar-foreground font-semibold"
                    >
                      <item.icon className="h-[15px] w-[15px] flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 pt-0">
        <Separator className="mb-3 bg-sidebar-border" />
        {user && (
          <div className="space-y-1.5">
            {!collapsed && (
              <div className="px-3 py-2 rounded-lg bg-sidebar-accent/40">
                <p className="text-[11px] font-medium truncate text-sidebar-foreground/80">{user.email}</p>
                <p className="text-[10px] text-sidebar-foreground/40 capitalize mt-0.5">{isAdmin ? 'Admin' : 'Member'}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-[12px] text-sidebar-foreground/40 hover:text-destructive hover:bg-sidebar-accent rounded-lg h-8"
              onClick={handleSignOut}
            >
              <LogOut className="h-[14px] w-[14px] flex-shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const userRoutes = ['/', '/search', '/my-garden', '/reminders', '/feedback'];
const adminRoutes = ['/', '/search', '/admin', '/admin/users', '/admin/reminders', '/admin/feedback'];

interface UseKeyboardNavigationOptions {
  isAdmin?: boolean;
  enabled?: boolean;
}

export function useKeyboardNavigation({ isAdmin = false, enabled = true }: UseKeyboardNavigationOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = isAdmin ? adminRoutes : userRoutes;
  const currentIndex = routes.indexOf(location.pathname);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    // Don't navigate if user is typing in an input
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Alt + Arrow keys for navigation
    if (event.altKey) {
      if (event.key === 'ArrowLeft' && currentIndex > 0) {
        event.preventDefault();
        navigate(routes[currentIndex - 1]);
      } else if (event.key === 'ArrowRight' && currentIndex < routes.length - 1 && currentIndex !== -1) {
        event.preventDefault();
        navigate(routes[currentIndex + 1]);
      }
    }
  }, [enabled, currentIndex, navigate, routes]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

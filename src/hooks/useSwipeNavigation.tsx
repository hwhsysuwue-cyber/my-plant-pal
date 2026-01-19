import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

// Define navigation order for swipe gestures
const userRoutes = ['/', '/search', '/my-garden', '/reminders', '/feedback'];
const adminRoutes = ['/', '/search', '/admin', '/admin/users', '/admin/reminders', '/admin/feedback'];

interface UseSwipeNavigationOptions {
  isAdmin?: boolean;
  enabled?: boolean;
}

export function useSwipeNavigation({ isAdmin = false, enabled = true }: UseSwipeNavigationOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = isAdmin ? adminRoutes : userRoutes;
  const currentIndex = routes.indexOf(location.pathname);

  const canSwipeLeft = enabled && currentIndex < routes.length - 1 && currentIndex !== -1;
  const canSwipeRight = enabled && currentIndex > 0;

  const handleSwipeLeft = useCallback(() => {
    if (canSwipeLeft) {
      navigate(routes[currentIndex + 1]);
    }
  }, [canSwipeLeft, currentIndex, navigate, routes]);

  const handleSwipeRight = useCallback(() => {
    if (canSwipeRight) {
      navigate(routes[currentIndex - 1]);
    }
  }, [canSwipeRight, currentIndex, navigate, routes]);

  return {
    handleSwipeLeft,
    handleSwipeRight,
    canSwipeLeft,
    canSwipeRight,
    currentIndex,
    totalRoutes: routes.length,
  };
}

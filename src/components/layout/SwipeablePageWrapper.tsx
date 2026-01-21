import { motion, PanInfo } from "framer-motion";
import { ReactNode, useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SwipeablePageWrapperProps {
  children: ReactNode;
  isAdmin?: boolean;
  className?: string;
}

export function SwipeablePageWrapper({
  children,
  isAdmin = false,
  className,
}: SwipeablePageWrapperProps) {
  const location = useLocation();
  const { handleSwipeLeft, handleSwipeRight, canSwipeLeft, canSwipeRight, currentIndex } =
    useSwipeNavigation({ isAdmin });

  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Reset swipe state when route changes to prevent stale gesture state
  useEffect(() => {
    setSwipeDirection(null);
    setSwipeProgress(0);
    setDragOffset(0);
  }, [location.pathname]);

  const handleDrag = useCallback((_: any, info: PanInfo) => {
    const progress = Math.min(Math.abs(info.offset.x) / 150, 1);
    setSwipeProgress(progress);
    setDragOffset(info.offset.x);

    if (info.offset.x < -30) {
      setSwipeDirection("left");
    } else if (info.offset.x > 30) {
      setSwipeDirection("right");
    } else {
      setSwipeDirection(null);
    }
  }, []);

  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      const threshold = 100;
      const velocity = Math.abs(info.velocity.x);

      if ((info.offset.x < -threshold || velocity > 500) && canSwipeLeft && info.offset.x < 0) {
        handleSwipeLeft();
      } else if ((info.offset.x > threshold || velocity > 500) && canSwipeRight && info.offset.x > 0) {
        handleSwipeRight();
      }

      setSwipeDirection(null);
      setSwipeProgress(0);
      setDragOffset(0);
    },
    [canSwipeLeft, canSwipeRight, handleSwipeLeft, handleSwipeRight]
  );

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Left edge indicator with enhanced visuals */}
      {canSwipeRight && (
        <motion.div
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-10 h-20 bg-gradient-to-r from-primary/20 to-transparent rounded-r-full pointer-events-none backdrop-blur-sm"
          animate={{
            opacity: swipeDirection === "right" ? 0.4 + swipeProgress * 0.6 : 0.2,
            scale: swipeDirection === "right" ? 1 + swipeProgress * 0.3 : 1,
            x: swipeDirection === "right" ? swipeProgress * 10 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <motion.div
            animate={{ x: swipeDirection === "right" ? swipeProgress * 5 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </motion.div>
        </motion.div>
      )}

      {/* Right edge indicator with enhanced visuals */}
      {canSwipeLeft && (
        <motion.div
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-10 h-20 bg-gradient-to-l from-primary/20 to-transparent rounded-l-full pointer-events-none backdrop-blur-sm"
          animate={{
            opacity: swipeDirection === "left" ? 0.4 + swipeProgress * 0.6 : 0.2,
            scale: swipeDirection === "left" ? 1 + swipeProgress * 0.3 : 1,
            x: swipeDirection === "left" ? -swipeProgress * 10 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <motion.div
            animate={{ x: swipeDirection === "left" ? -swipeProgress * 5 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </motion.div>
        </motion.div>
      )}

      {/* Main content (route transitions are handled by PageTransition in App.tsx) */}
      <motion.div
        key={location.pathname}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="touch-pan-y"
        style={{
          touchAction: "pan-y",
          // subtle tilt feedback during drag (kept independent from route animations)
          rotateY: dragOffset * 0.02,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

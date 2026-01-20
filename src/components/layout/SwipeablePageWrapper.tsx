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
  const { handleSwipeLeft, handleSwipeRight, canSwipeLeft, canSwipeRight } =
    useSwipeNavigation({ isAdmin });

  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);

  // Reset swipe state when route changes to prevent stale gesture state
  useEffect(() => {
    setSwipeDirection(null);
    setSwipeProgress(0);
  }, [location.pathname]);

  const handleDrag = useCallback((_: any, info: PanInfo) => {
    const progress = Math.min(Math.abs(info.offset.x) / 150, 1);
    setSwipeProgress(progress);

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
    },
    [canSwipeLeft, canSwipeRight, handleSwipeLeft, handleSwipeRight]
  );

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Left edge indicator */}
      {canSwipeRight && (
        <motion.div
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-8 h-16 bg-primary/10 rounded-r-full pointer-events-none"
          animate={{
            opacity: swipeDirection === "right" ? swipeProgress : 0.3,
            scale: swipeDirection === "right" ? 1 + swipeProgress * 0.2 : 1,
          }}
        >
          <ChevronLeft className="h-5 w-5 text-primary" />
        </motion.div>
      )}

      {/* Right edge indicator */}
      {canSwipeLeft && (
        <motion.div
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-8 h-16 bg-primary/10 rounded-l-full pointer-events-none"
          animate={{
            opacity: swipeDirection === "left" ? swipeProgress : 0.3,
            scale: swipeDirection === "left" ? 1 + swipeProgress * 0.2 : 1,
          }}
        >
          <ChevronRight className="h-5 w-5 text-primary" />
        </motion.div>
      )}

      {/* Main content - key forces remount on route change to reset drag state */}
      <motion.div
        key={location.pathname}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="touch-pan-y"
        style={{ touchAction: "pan-y" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

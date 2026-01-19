import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ReactNode, useState } from "react";
import { Check, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: "delete" | "complete" | "custom";
  rightAction?: "delete" | "complete" | "custom";
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = "delete",
  rightAction = "complete",
  leftLabel,
  rightLabel,
  className,
  style,
  disabled = false,
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  // Transform for background opacity based on swipe distance
  const leftBgOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const rightBgOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1]);
  const scale = useTransform(x, [-150, 0, 150], [0.95, 1, 0.95]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 100;

    if (info.offset.x < -threshold && onSwipeLeft) {
      onSwipeLeft();
    } else if (info.offset.x > threshold && onSwipeRight) {
      onSwipeRight();
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "delete":
        return <Trash2 className="h-5 w-5" />;
      case "complete":
        return <Check className="h-5 w-5" />;
      default:
        return <X className="h-5 w-5" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "delete":
        return "bg-destructive";
      case "complete":
        return "bg-primary";
      default:
        return "bg-muted";
    }
  };

  if (disabled) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)} style={style}>
      {/* Left action background */}
      {onSwipeLeft && (
        <motion.div
          style={{ opacity: leftBgOpacity }}
          className={cn(
            "absolute inset-y-0 right-0 w-24 flex items-center justify-center text-white",
            getActionColor(leftAction)
          )}
        >
          <div className="flex flex-col items-center gap-1">
            {getActionIcon(leftAction)}
            {leftLabel && <span className="text-xs font-medium">{leftLabel}</span>}
          </div>
        </motion.div>
      )}

      {/* Right action background */}
      {onSwipeRight && (
        <motion.div
          style={{ opacity: rightBgOpacity }}
          className={cn(
            "absolute inset-y-0 left-0 w-24 flex items-center justify-center text-white",
            getActionColor(rightAction)
          )}
        >
          <div className="flex flex-col items-center gap-1">
            {getActionIcon(rightAction)}
            {rightLabel && <span className="text-xs font-medium">{rightLabel}</span>}
          </div>
        </motion.div>
      )}

      {/* Swipeable content */}
      <motion.div
        style={{ x, scale }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className={cn(
          "relative bg-card touch-pan-y cursor-grab active:cursor-grabbing",
          isDragging && "z-10"
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}

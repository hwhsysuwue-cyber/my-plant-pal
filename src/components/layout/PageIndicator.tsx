import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageIndicatorProps {
  routes: string[];
  className?: string;
}

export function PageIndicator({ routes, className }: PageIndicatorProps) {
  const location = useLocation();
  const currentIndex = routes.indexOf(location.pathname);

  if (currentIndex === -1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)}>
      {routes.map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            index === currentIndex
              ? "w-6 bg-primary"
              : "w-1.5 bg-muted-foreground/30"
          )}
          initial={{ scale: 0.8 }}
          animate={{ scale: index === currentIndex ? 1 : 0.8 }}
        />
      ))}
    </div>
  );
}

import { Link } from "react-router-dom";
import { Leaf, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="text-center max-w-sm">
      <div className="h-14 w-14 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-6">
        <Leaf className="h-7 w-7 text-muted-foreground" />
      </div>
      <h1 className="text-5xl font-bold text-foreground mb-3">404</h1>
      <p className="text-muted-foreground mb-6">This page doesn't exist.</p>
      <Button asChild size="sm">
        <Link to="/"><ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Home</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;

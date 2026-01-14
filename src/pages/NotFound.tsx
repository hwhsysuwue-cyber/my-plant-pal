import { Link } from "react-router-dom";
import { Leaf, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <div className="text-center max-w-md">
        <div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-8">
          <Leaf className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! This page doesn't exist.
        </p>
        <Button asChild size="lg" className="h-12 px-8">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

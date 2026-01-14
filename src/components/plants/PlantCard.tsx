import { Droplets, Sun, Sprout, Plus, Check, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface PlantCardProps {
  id: string;
  name: string;
  category: string;
  type: string;
  wateringSchedule: string;
  sunlightRequirement: string;
  soilType: string;
  description?: string;
  imageUrl?: string;
  isInGarden?: boolean;
  showGardenActions?: boolean;
  onAddToGarden?: () => void;
  onRemoveFromGarden?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export function PlantCard({
  id,
  name,
  category,
  type,
  wateringSchedule,
  sunlightRequirement,
  soilType,
  description,
  imageUrl,
  isInGarden,
  showGardenActions = true,
  onAddToGarden,
  onRemoveFromGarden,
  onEdit,
  onDelete,
  isAdmin,
}: PlantCardProps) {
  const defaultImage = 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop';

  return (
    <Card className="group overflow-hidden border-border bg-card hover:border-primary/20 hover:shadow-medium transition-all duration-300 rounded-2xl">
      {/* Image */}
      <Link to={`/plants/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <img
            src={imageUrl || defaultImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium">
              {category}
            </Badge>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-5">
        <div className="mb-4">
          <Link to={`/plants/${id}`}>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
        
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-sm">
            <div className="h-8 w-8 rounded-lg bg-water/10 flex items-center justify-center flex-shrink-0">
              <Droplets className="h-4 w-4 text-water" />
            </div>
            <span className="text-muted-foreground">{wateringSchedule}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="h-8 w-8 rounded-lg bg-sun/10 flex items-center justify-center flex-shrink-0">
              <Sun className="h-4 w-4 text-sun" />
            </div>
            <span className="text-muted-foreground">{sunlightRequirement}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="h-8 w-8 rounded-lg bg-leaf/10 flex items-center justify-center flex-shrink-0">
              <Sprout className="h-4 w-4 text-leaf" />
            </div>
            <span className="text-muted-foreground">{soilType}</span>
          </div>
        </div>

        {description && (
          <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="px-5 pb-5 pt-0 flex gap-2">
        {isAdmin ? (
          <>
            <Button variant="outline" size="sm" className="flex-1 h-9 rounded-xl" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : showGardenActions && (
          isInGarden ? (
            <Button variant="secondary" size="sm" className="w-full h-9 rounded-xl group/btn" onClick={onRemoveFromGarden}>
              <Check className="mr-2 h-4 w-4 group-hover/btn:hidden" />
              <Trash2 className="mr-2 h-4 w-4 hidden group-hover/btn:block text-destructive" />
              <span className="group-hover/btn:hidden">In Garden</span>
              <span className="hidden group-hover/btn:block text-destructive">Remove</span>
            </Button>
          ) : (
            <Button size="sm" className="w-full h-9 rounded-xl shadow-glow hover:shadow-glow-lg transition-all" onClick={onAddToGarden}>
              <Plus className="mr-2 h-4 w-4" />
              Add to Garden
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}

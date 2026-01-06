import { Droplets, Sun, Sprout, Plus, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <Card className="group overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border-border/50 animate-fade-in">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl || defaultImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground">
            {category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{type}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Droplets className="h-4 w-4 text-water" />
            <span>{wateringSchedule}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sun className="h-4 w-4 text-sun" />
            <span>{sunlightRequirement}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sprout className="h-4 w-4 text-soil" />
            <span>{soilType}</span>
          </div>
        </div>

        {description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {isAdmin ? (
          <>
            <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : showGardenActions && (
          isInGarden ? (
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={onRemoveFromGarden}
            >
              <Check className="mr-2 h-4 w-4" />
              In My Garden
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={onAddToGarden}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Garden
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}

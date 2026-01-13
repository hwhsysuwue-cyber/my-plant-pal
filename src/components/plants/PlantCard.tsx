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
    <Card className="group overflow-hidden border-border/40 bg-card shadow-soft hover:shadow-elevated transition-all duration-400 animate-fade-in rounded-2xl">
      {/* Image Section */}
      <Link to={`/plants/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <img
            src={imageUrl || defaultImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
          
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-md text-foreground font-medium text-xs shadow-sm border-0 px-3 py-1">
              {category}
            </Badge>
          </div>

          {/* View prompt on hover */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
              View Details
            </span>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-5">
        {/* Title and type */}
        <div className="mb-4">
          <Link to={`/plants/${id}`}>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
              {name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
        
        {/* Care info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm group/item">
            <div className="h-8 w-8 rounded-lg bg-water/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-water/15 transition-colors">
              <Droplets className="h-4 w-4 text-water" />
            </div>
            <span className="text-muted-foreground">{wateringSchedule}</span>
          </div>
          <div className="flex items-center gap-3 text-sm group/item">
            <div className="h-8 w-8 rounded-lg bg-sun/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-sun/15 transition-colors">
              <Sun className="h-4 w-4 text-sun" />
            </div>
            <span className="text-muted-foreground">{sunlightRequirement}</span>
          </div>
          <div className="flex items-center gap-3 text-sm group/item">
            <div className="h-8 w-8 rounded-lg bg-soil/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-soil/15 transition-colors">
              <Sprout className="h-4 w-4 text-soil" />
            </div>
            <span className="text-muted-foreground">{soilType}</span>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </CardContent>
      
      {/* Footer with actions */}
      <CardFooter className="px-5 pb-5 pt-0 flex gap-2">
        {isAdmin ? (
          <>
            <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl hover:bg-secondary/60" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        ) : showGardenActions && (
          isInGarden ? (
            <Button
              variant="secondary"
              size="sm"
              className="w-full h-10 rounded-xl group/btn"
              onClick={onRemoveFromGarden}
            >
              <Check className="mr-2 h-4 w-4 group-hover/btn:hidden" />
              <Trash2 className="mr-2 h-4 w-4 hidden group-hover/btn:block text-destructive" />
              <span className="group-hover/btn:hidden">In My Garden</span>
              <span className="hidden group-hover/btn:block text-destructive">Remove</span>
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full h-10 rounded-xl shadow-soft hover:shadow-colored transition-all duration-300 group/btn"
              onClick={onAddToGarden}
            >
              <Plus className="mr-2 h-4 w-4 group-hover/btn:rotate-90 transition-transform duration-300" />
              Add to Garden
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}
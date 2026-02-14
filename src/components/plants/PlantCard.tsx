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
  id, name, category, type, wateringSchedule, sunlightRequirement, soilType,
  description, imageUrl, isInGarden, showGardenActions = true,
  onAddToGarden, onRemoveFromGarden, onEdit, onDelete, isAdmin,
}: PlantCardProps) {
  const defaultImage = 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop';

  return (
    <Card className="group overflow-hidden hover:border-primary/20 transition-all duration-200 hover-lift">
      <Link to={`/plants/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <img
            src={imageUrl || defaultImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs">
              {category}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="mb-3">
          <Link to={`/plants/${id}`}>
            <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{name}</h3>
          </Link>
          <p className="text-xs text-muted-foreground">{type}</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-6 w-6 rounded bg-water/10 flex items-center justify-center flex-shrink-0">
              <Droplets className="h-3 w-3 text-water" />
            </div>
            <span>{wateringSchedule}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-6 w-6 rounded bg-sun/10 flex items-center justify-center flex-shrink-0">
              <Sun className="h-3 w-3 text-sun" />
            </div>
            <span>{sunlightRequirement}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-6 w-6 rounded bg-leaf/10 flex items-center justify-center flex-shrink-0">
              <Sprout className="h-3 w-3 text-leaf" />
            </div>
            <span>{soilType}</span>
          </div>
        </div>

        {description && <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{description}</p>}
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 flex gap-2">
        {isAdmin ? (
          <>
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={onEdit}>
              <Pencil className="mr-1.5 h-3 w-3" /> Edit
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        ) : showGardenActions && (
          isInGarden ? (
            <Button variant="secondary" size="sm" className="w-full h-8 text-xs group/btn" onClick={onRemoveFromGarden}>
              <Check className="mr-1.5 h-3 w-3 group-hover/btn:hidden" />
              <Trash2 className="mr-1.5 h-3 w-3 hidden group-hover/btn:block text-destructive" />
              <span className="group-hover/btn:hidden">In Garden</span>
              <span className="hidden group-hover/btn:block text-destructive">Remove</span>
            </Button>
          ) : (
            <Button size="sm" className="w-full h-8 text-xs" onClick={onAddToGarden}>
              <Plus className="mr-1.5 h-3 w-3" /> Add to Garden
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}

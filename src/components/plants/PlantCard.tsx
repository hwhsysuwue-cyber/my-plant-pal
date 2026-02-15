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
    <Card className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft hover:shadow-medium hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
      <Link to={`/plants/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={imageUrl || defaultImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2.5 left-2.5">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-md text-xs font-medium shadow-sm">
              {category}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="mb-3">
          <Link to={`/plants/${id}`}>
            <h3 className="text-sm font-bold group-hover:text-primary transition-colors">{name}</h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">{type}</p>
        </div>

        <div className="space-y-2">
          {[
            { icon: Droplets, color: 'text-water', bg: 'bg-water/10', label: wateringSchedule },
            { icon: Sun, color: 'text-sun', bg: 'bg-sun/10', label: sunlightRequirement },
            { icon: Sprout, color: 'text-leaf', bg: 'bg-leaf/10', label: soilType },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <div className={`h-6 w-6 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`h-3 w-3 ${item.color}`} />
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {description && <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>}
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 flex gap-2">
        {isAdmin ? (
          <>
            <Button variant="outline" size="sm" className="flex-1 h-9 text-xs rounded-lg" onClick={onEdit}>
              <Pencil className="mr-1.5 h-3 w-3" /> Edit
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        ) : showGardenActions && (
          isInGarden ? (
            <Button variant="secondary" size="sm" className="w-full h-9 text-xs rounded-lg group/btn" onClick={onRemoveFromGarden}>
              <Check className="mr-1.5 h-3 w-3 group-hover/btn:hidden" />
              <Trash2 className="mr-1.5 h-3 w-3 hidden group-hover/btn:block text-destructive" />
              <span className="group-hover/btn:hidden">In Garden</span>
              <span className="hidden group-hover/btn:block text-destructive">Remove</span>
            </Button>
          ) : (
            <Button size="sm" className="w-full h-9 text-xs rounded-lg shadow-glow hover:shadow-glow-lg transition-all" onClick={onAddToGarden}>
              <Plus className="mr-1.5 h-3 w-3" /> Add to Garden
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}

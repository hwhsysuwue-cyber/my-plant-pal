import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { PlantCard } from '@/components/plants/PlantCard';
import { Loader2, Leaf, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function MyGarden() {
  const { user } = useAuth();

  const { data: gardenPlants, isLoading, refetch } = useQuery({
    queryKey: ['my-garden', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_gardens')
        .select(`
          id,
          added_at,
          plants (*)
        `)
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleRemoveFromGarden = async (plantId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_gardens')
      .delete()
      .eq('user_id', user.id)
      .eq('plant_id', plantId);

    if (error) {
      toast.error('Failed to remove plant from garden');
    } else {
      toast.success('Plant removed from garden');
      refetch();
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold mb-2">My Garden</h1>
            <p className="text-muted-foreground">
              Your personal plant collection
            </p>
          </div>
          <Button asChild>
            <Link to="/search">
              <Plus className="mr-2 h-4 w-4" />
              Add Plants
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !gardenPlants || gardenPlants.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
              <Leaf className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-2">Your garden is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your plant collection by exploring our catalog and adding your favorites.
            </p>
            <Button asChild size="lg">
              <Link to="/search">
                <Plus className="mr-2 h-5 w-5" />
                Explore Plants
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {gardenPlants.length} plant{gardenPlants.length !== 1 ? 's' : ''} in your garden
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gardenPlants.map((item) => {
                const plant = item.plants;
                if (!plant) return null;
                return (
                  <PlantCard
                    key={item.id}
                    id={plant.id}
                    name={plant.name}
                    category={plant.category}
                    type={plant.type}
                    wateringSchedule={plant.watering_schedule}
                    sunlightRequirement={plant.sunlight_requirement}
                    soilType={plant.soil_type}
                    description={plant.description || undefined}
                    imageUrl={plant.image_url || undefined}
                    isInGarden={true}
                    onRemoveFromGarden={() => handleRemoveFromGarden(plant.id)}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

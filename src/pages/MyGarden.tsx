import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Layout } from '@/components/layout/Layout';
import { PlantCard } from '@/components/plants/PlantCard';
import { PlantGridSkeleton } from '@/components/skeletons/PlantCardSkeleton';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { SwipeableCard } from '@/components/ui/swipeable-card';
import { Leaf, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function MyGarden() {
  const { user, isAdmin } = useAuth();
  useKeyboardNavigation({ isAdmin });

  const { data: gardenPlants, isLoading, refetch } = useQuery({
    queryKey: ['my-garden', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_gardens')
        .select('id, added_at, plants (*)')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleRemoveFromGarden = async (plantId: string) => {
    if (!user) return;
    const { error } = await supabase.from('user_gardens').delete().eq('user_id', user.id).eq('plant_id', plantId);
    if (error) toast.error('Failed to remove plant');
    else { toast.success('Plant removed'); refetch(); }
  };

  const handleRefresh = useCallback(async () => {
    await refetch();
    toast.success('Garden refreshed!');
  }, [refetch]);

  return (
    <Layout>
      <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
        <div className="container px-4 sm:px-6 py-6 md:py-8">
          <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">My Garden</h1>
              <p className="page-subtitle">Your personal plant collection</p>
            </div>
            <Button asChild size="sm" className="rounded-xl shadow-glow hover:shadow-glow-lg transition-all">
              <Link to="/search"><Plus className="mr-1.5 h-4 w-4" /> Add Plants</Link>
            </Button>
          </div>

          {isLoading ? (
            <PlantGridSkeleton count={4} />
          ) : !gardenPlants || gardenPlants.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold mb-1">Your garden is empty</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Start building your collection by exploring our catalog.
              </p>
              <Button asChild size="sm" className="rounded-xl shadow-glow hover:shadow-glow-lg transition-all">
                <Link to="/search"><Plus className="mr-1.5 h-4 w-4" /> Explore Plants</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-5">
                <span className="font-semibold text-foreground">{gardenPlants.length}</span>{' '}
                plant{gardenPlants.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {gardenPlants.map((item) => {
                  const plant = item.plants;
                  if (!plant) return null;
                  return (
                    <SwipeableCard
                      key={item.id}
                      onSwipeLeft={() => handleRemoveFromGarden(plant.id)}
                      leftAction="delete"
                      leftLabel="Remove"
                    >
                      <PlantCard
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
                    </SwipeableCard>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </PullToRefresh>
    </Layout>
  );
}

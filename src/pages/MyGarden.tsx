import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { PlantCard } from '@/components/plants/PlantCard';
import { Loader2, Leaf, Plus, Sparkles } from 'lucide-react';
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
      <div className="container px-4 sm:px-6 py-10 md:py-14">
        {/* Page Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 text-primary text-sm font-medium mb-3">
              <Sparkles className="h-4 w-4 animate-pulse-soft" />
              <span>Your Collection</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-3">My Garden</h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Your personal plant collection
            </p>
          </div>
          <Button asChild size="lg" className="h-12 px-6 rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 press-effect animate-fade-in-up stagger-2">
            <Link to="/search">
              <Plus className="mr-2 h-5 w-5" />
              Add Plants
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 animate-pulse-soft" />
              <Loader2 className="h-8 w-8 animate-spin text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-muted-foreground mt-4">Loading your garden...</p>
          </div>
        ) : !gardenPlants || gardenPlants.length === 0 ? (
          <div className="text-center py-24 animate-fade-in-up">
            <div className="h-24 w-24 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-8 shadow-soft hover-scale">
              <Leaf className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3 animate-fade-in stagger-1">Your garden is empty</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto animate-fade-in stagger-2">
              Start building your plant collection by exploring our catalog and adding your favorites.
            </p>
            <Button asChild size="lg" className="h-12 px-8 rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 press-effect animate-fade-in-up stagger-3">
              <Link to="/search">
                <Plus className="mr-2 h-5 w-5" />
                Explore Plants
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 animate-fade-in">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{gardenPlants.length}</span>{' '}
                plant{gardenPlants.length !== 1 ? 's' : ''} in your garden
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gardenPlants.map((item, index) => {
                const plant = item.plants;
                if (!plant) return null;
                return (
                  <div 
                    key={item.id} 
                    className={`animate-fade-in-up opacity-0`}
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
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
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

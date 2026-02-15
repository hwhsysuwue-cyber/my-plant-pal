import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Layout } from '@/components/layout/Layout';
import { PlantCard } from '@/components/plants/PlantCard';
import { PlantFilters } from '@/components/plants/PlantFilters';
import { PlantGridSkeleton } from '@/components/skeletons/PlantCardSkeleton';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { Search as SearchIcon, Leaf } from 'lucide-react';
import { toast } from 'sonner';

export default function Search() {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useKeyboardNavigation({ isAdmin });

  const { data: plants, isLoading: plantsLoading } = useQuery({
    queryKey: ['plants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: userGarden, refetch: refetchGarden } = useQuery({
    queryKey: ['user-garden', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_gardens')
        .select('plant_id')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map((g) => g.plant_id);
    },
    enabled: !!user && !isAdmin,
  });

  const categories = useMemo(() => {
    if (!plants) return [];
    return [...new Set(plants.map((p) => p.category))].sort();
  }, [plants]);

  const types = useMemo(() => {
    if (!plants) return [];
    return [...new Set(plants.map((p) => p.type))].sort();
  }, [plants]);

  const filteredPlants = useMemo(() => {
    if (!plants) return [];
    return plants.filter((plant) => {
      const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || plant.category === selectedCategory;
      const matchesType = selectedType === 'all' || plant.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [plants, searchTerm, selectedCategory, selectedType]);

  const handleAddToGarden = async (plantId: string) => {
    if (!user) { toast.error('Please sign in to add plants'); return; }
    const { error } = await supabase.from('user_gardens').insert({ user_id: user.id, plant_id: plantId });
    if (error) {
      if (error.code === '23505') toast.info('Already in your garden');
      else toast.error('Failed to add plant');
    } else {
      toast.success('Plant added to your garden!');
      refetchGarden();
    }
  };

  const handleRemoveFromGarden = async (plantId: string) => {
    if (!user) return;
    const { error } = await supabase.from('user_gardens').delete().eq('user_id', user.id).eq('plant_id', plantId);
    if (error) toast.error('Failed to remove plant');
    else { toast.success('Plant removed'); refetchGarden(); }
  };

  const clearFilters = () => { setSearchTerm(''); setSelectedCategory('all'); setSelectedType('all'); };

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['plants'] });
    await refetchGarden();
    toast.success('Refreshed!');
  }, [queryClient, refetchGarden]);

  if (!user) {
    return (
      <Layout>
        <div className="container px-4 py-24 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
            <SearchIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Search Plants</h1>
          <p className="text-muted-foreground">Please sign in to search our plant catalog</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
        <div className="container px-4 sm:px-6 py-6 md:py-8">
          <div className="page-header">
            <h1 className="page-title">Search Plants</h1>
            <p className="page-subtitle">Discover the perfect plants for your space</p>
          </div>

          <PlantFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            categories={categories}
            types={types}
            onClear={clearFilters}
          />

          {plantsLoading ? (
            <div className="mt-6"><PlantGridSkeleton count={8} /></div>
          ) : filteredPlants.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold mb-1">No plants found</h2>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="flex items-center mt-6 mb-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredPlants.length}</span>{' '}
                  plant{filteredPlants.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredPlants.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    id={plant.id}
                    name={plant.name}
                    category={plant.category}
                    type={plant.type}
                    wateringSchedule={plant.watering_schedule}
                    sunlightRequirement={plant.sunlight_requirement}
                    soilType={plant.soil_type}
                    description={plant.description || undefined}
                    imageUrl={plant.image_url || undefined}
                    isInGarden={userGarden?.includes(plant.id)}
                    showGardenActions={!isAdmin}
                    onAddToGarden={() => handleAddToGarden(plant.id)}
                    onRemoveFromGarden={() => handleRemoveFromGarden(plant.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </PullToRefresh>
    </Layout>
  );
}

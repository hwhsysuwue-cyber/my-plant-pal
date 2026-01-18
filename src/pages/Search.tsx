import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { PlantCard } from '@/components/plants/PlantCard';
import { PlantFilters } from '@/components/plants/PlantFilters';
import { PlantGridSkeleton } from '@/components/skeletons/PlantCardSkeleton';
import { Search as SearchIcon, Leaf, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Search() {
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Fetch all plants
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

  // Fetch user's garden
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

  // Get unique categories and types
  const categories = useMemo(() => {
    if (!plants) return [];
    return [...new Set(plants.map((p) => p.category))].sort();
  }, [plants]);

  const types = useMemo(() => {
    if (!plants) return [];
    return [...new Set(plants.map((p) => p.type))].sort();
  }, [plants]);

  // Filter plants
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
    if (!user) {
      toast.error('Please sign in to add plants to your garden');
      return;
    }

    const { error } = await supabase.from('user_gardens').insert({
      user_id: user.id,
      plant_id: plantId,
    });

    if (error) {
      if (error.code === '23505') {
        toast.info('This plant is already in your garden');
      } else {
        toast.error('Failed to add plant to garden');
      }
    } else {
      toast.success('Plant added to your garden!');
      refetchGarden();
    }
  };

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
      refetchGarden();
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
  };

  if (!user) {
    return (
      <Layout>
        <div className="container px-4 sm:px-6 py-20 md:py-28 text-center">
          <div className="max-w-md mx-auto animate-fade-in-up">
            <div className="h-24 w-24 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-8 shadow-soft">
              <SearchIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">Search Plants</h1>
            <p className="text-muted-foreground text-lg">Please sign in to search our plant catalog</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 sm:px-6 py-10 md:py-14">
        {/* Page Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-3">
            <Sparkles className="h-4 w-4" />
            <span>Discover Plants</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-3">Search Plants</h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Discover the perfect plants for your space
          </p>
        </div>

        {/* Filters */}
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

        {/* Results */}
        {plantsLoading ? (
          <div className="mt-8">
            <PlantGridSkeleton count={8} />
          </div>
        ) : filteredPlants.length === 0 ? (
          <div className="text-center py-24 animate-fade-in-up">
            <div className="h-24 w-24 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-8 shadow-soft">
              <Leaf className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">No plants found</h2>
            <p className="text-muted-foreground text-lg">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mt-8 mb-6 animate-fade-in">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredPlants.length}</span>{' '}
                plant{filteredPlants.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlants.map((plant, index) => (
                <div key={plant.id} className={`stagger-${Math.min(index % 8 + 1, 8)}`}>
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
                    isInGarden={userGarden?.includes(plant.id)}
                    showGardenActions={!isAdmin}
                    onAddToGarden={() => handleAddToGarden(plant.id)}
                    onRemoveFromGarden={() => handleRemoveFromGarden(plant.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
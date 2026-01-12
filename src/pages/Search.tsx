import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { PlantCard } from '@/components/plants/PlantCard';
import { PlantFilters } from '@/components/plants/PlantFilters';
import { Loader2, Search as SearchIcon, Leaf } from 'lucide-react';
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
        <div className="container px-4 sm:px-6 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl font-semibold mb-3">Search Plants</h1>
            <p className="text-muted-foreground text-lg">Please sign in to search our plant catalog</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 sm:px-6 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">Search Plants</h1>
          <p className="text-muted-foreground text-lg">
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPlants.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
              <Leaf className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-2">No plants found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mt-6 mb-4">
              {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''} found
            </p>
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
    </Layout>
  );
}

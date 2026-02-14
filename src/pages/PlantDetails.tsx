import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlantDetailsSkeleton } from '@/components/skeletons/PlantDetailsSkeleton';
import { ArrowLeft, Droplets, Sun, Flower2, Leaf, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function PlantDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: plant, isLoading } = useQuery({
    queryKey: ['plant', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('plants').select('*').eq('id', id!).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: isInGarden } = useQuery({
    queryKey: ['is-in-garden', user?.id, id],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_gardens').select('id').eq('user_id', user!.id).eq('plant_id', id!).maybeSingle();
      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !isAdmin && !!id,
  });

  const addToGardenMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('user_gardens').insert({ user_id: user!.id, plant_id: id! });
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Added to garden!'); queryClient.invalidateQueries({ queryKey: ['is-in-garden'] }); },
    onError: () => { toast.error('Failed to add'); },
  });

  if (isLoading) return <Layout><PlantDetailsSkeleton /></Layout>;

  if (!plant) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <div className="h-14 w-14 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4">
            <Leaf className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold mb-2">Plant Not Found</h1>
          <p className="text-sm text-muted-foreground mb-4">This plant doesn't exist or has been removed.</p>
          <Button size="sm" onClick={() => navigate('/search')}><ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Search</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout disableSwipeNav>
      <div className="container py-6 md:py-8 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-2 text-muted-foreground">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
        </Button>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
            {plant.image_url ? (
              <img src={plant.image_url} alt={plant.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Leaf className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
              <div>
                <h1 className="text-2xl font-bold mb-1.5">{plant.name}</h1>
                <div className="flex gap-1.5">
                  <Badge variant="secondary">{plant.category}</Badge>
                  <Badge variant="outline">{plant.type}</Badge>
                </div>
              </div>
              {user && !isAdmin && (
                <Button
                  size="sm"
                  onClick={() => addToGardenMutation.mutate()}
                  disabled={isInGarden || addToGardenMutation.isPending}
                  variant={isInGarden ? 'secondary' : 'default'}
                >
                  {isInGarden ? <><Check className="mr-1.5 h-3.5 w-3.5" /> In Garden</> : <><Plus className="mr-1.5 h-3.5 w-3.5" /> Add to Garden</>}
                </Button>
              )}
            </div>

            {plant.description && <p className="text-sm text-muted-foreground mb-4">{plant.description}</p>}

            <div className="space-y-3">
              <Card>
                <CardHeader className="p-4 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-water/10 flex items-center justify-center"><Droplets className="h-3.5 w-3.5 text-water" /></div>
                    Watering
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1">
                  <p className="text-sm font-medium">{plant.watering_schedule}</p>
                  <CardDescription className="text-xs mt-0.5">
                    {plant.watering_schedule === 'Daily' && 'Check soil moisture daily.'}
                    {plant.watering_schedule === 'Every 2-3 days' && 'Water when top inch is dry.'}
                    {plant.watering_schedule === 'Weekly' && 'Allow soil to dry between waterings.'}
                    {plant.watering_schedule === 'Every 2 weeks' && 'Prefers drier conditions.'}
                    {plant.watering_schedule === 'Monthly' && 'Very drought-tolerant.'}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-sun/10 flex items-center justify-center"><Sun className="h-3.5 w-3.5 text-sun" /></div>
                    Sunlight
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1">
                  <p className="text-sm font-medium">{plant.sunlight_requirement}</p>
                  <CardDescription className="text-xs mt-0.5">
                    {plant.sunlight_requirement === 'Full sun' && '6+ hours direct sunlight.'}
                    {plant.sunlight_requirement === 'Partial sun' && '3-6 hours sunlight.'}
                    {plant.sunlight_requirement === 'Partial shade' && 'Bright indirect light.'}
                    {plant.sunlight_requirement === 'Full shade' && 'Low light conditions.'}
                    {plant.sunlight_requirement === 'Indirect light' && 'Bright filtered light.'}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-terracotta/10 flex items-center justify-center"><Flower2 className="h-3.5 w-3.5 text-terracotta" /></div>
                    Soil
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1">
                  <p className="text-sm font-medium">{plant.soil_type}</p>
                  <CardDescription className="text-xs mt-0.5">
                    {plant.soil_type === 'Well-draining' && 'Mix with perlite or sand.'}
                    {plant.soil_type === 'Loamy' && 'Rich, balanced moisture.'}
                    {plant.soil_type === 'Sandy' && 'Fast-draining.'}
                    {plant.soil_type === 'Clay' && 'Dense, moisture-retaining.'}
                    {plant.soil_type === 'Peaty' && 'Acidic, organic-rich.'}
                    {plant.soil_type === 'Chalky' && 'Alkaline with good drainage.'}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

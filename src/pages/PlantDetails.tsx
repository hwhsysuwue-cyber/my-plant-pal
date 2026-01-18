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
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: isInGarden } = useQuery({
    queryKey: ['is-in-garden', user?.id, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_gardens')
        .select('id')
        .eq('user_id', user!.id)
        .eq('plant_id', id!)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !isAdmin && !!id,
  });

  const addToGardenMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('user_gardens').insert({
        user_id: user!.id,
        plant_id: id!,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Added to your garden!');
      queryClient.invalidateQueries({ queryKey: ['is-in-garden'] });
    },
    onError: () => {
      toast.error('Failed to add to garden');
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <PlantDetailsSkeleton />
      </Layout>
    );
  }

  if (!plant) {
    return (
      <Layout>
        <div className="container py-16 text-center animate-fade-in-up">
          <div className="h-24 w-24 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-6 hover-scale">
            <Leaf className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-semibold mb-2">Plant Not Found</h1>
          <p className="text-muted-foreground mb-6">This plant doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/search')} className="press-effect">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 animate-fade-in-left group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Plant Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary animate-fade-in-up shadow-soft">
            {plant.image_url ? (
              <img
                src={plant.image_url}
                alt={plant.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Leaf className="h-24 w-24 text-muted-foreground animate-float" />
              </div>
            )}
          </div>

          {/* Plant Info */}
          <div className="animate-fade-in-right">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="font-display text-3xl font-semibold mb-2">{plant.name}</h1>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="animate-scale-in">{plant.category}</Badge>
                  <Badge variant="outline" className="animate-scale-in stagger-1">{plant.type}</Badge>
                </div>
              </div>
              {user && !isAdmin && (
                <Button
                  onClick={() => addToGardenMutation.mutate()}
                  disabled={isInGarden || addToGardenMutation.isPending}
                  variant={isInGarden ? 'secondary' : 'default'}
                  className="press-effect shadow-glow hover:shadow-glow-lg transition-all animate-fade-in stagger-2"
                >
                  {isInGarden ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      In Garden
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Garden
                    </>
                  )}
                </Button>
              )}
            </div>

            {plant.description && (
              <p className="text-muted-foreground mb-6 animate-fade-in stagger-1">{plant.description}</p>
            )}

            <div className="space-y-4">
              <Card className="animate-fade-in-up stagger-2 hover-lift group">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-water/10 flex items-center justify-center group-hover:bg-water/20 transition-colors">
                      <Droplets className="h-4 w-4 text-water icon-hover-rotate" />
                    </div>
                    Watering
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{plant.watering_schedule}</p>
                  <CardDescription>
                    {plant.watering_schedule === 'Daily' && 'This plant needs frequent watering. Check soil moisture daily.'}
                    {plant.watering_schedule === 'Every 2-3 days' && 'Water when the top inch of soil feels dry.'}
                    {plant.watering_schedule === 'Weekly' && 'Allow soil to dry between waterings. Water thoroughly once a week.'}
                    {plant.watering_schedule === 'Every 2 weeks' && 'This plant prefers drier conditions. Water sparingly.'}
                    {plant.watering_schedule === 'Monthly' && 'Very drought-tolerant. Water only when soil is completely dry.'}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="animate-fade-in-up stagger-3 hover-lift group">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-sun/10 flex items-center justify-center group-hover:bg-sun/20 transition-colors">
                      <Sun className="h-4 w-4 text-sun icon-hover-rotate" />
                    </div>
                    Sunlight
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{plant.sunlight_requirement}</p>
                  <CardDescription>
                    {plant.sunlight_requirement === 'Full sun' && 'Needs 6+ hours of direct sunlight daily. Place near south-facing windows.'}
                    {plant.sunlight_requirement === 'Partial sun' && 'Thrives with 3-6 hours of sunlight. East or west-facing windows work well.'}
                    {plant.sunlight_requirement === 'Partial shade' && 'Prefers bright indirect light with some shade during hot afternoons.'}
                    {plant.sunlight_requirement === 'Full shade' && 'Best in low light conditions. Keep away from direct sunlight.'}
                    {plant.sunlight_requirement === 'Indirect light' && 'Bright but filtered light is ideal. Avoid harsh direct sun exposure.'}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="animate-fade-in-up stagger-4 hover-lift group">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-terracotta/10 flex items-center justify-center group-hover:bg-terracotta/20 transition-colors">
                      <Flower2 className="h-4 w-4 text-terracotta icon-hover-rotate" />
                    </div>
                    Soil Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{plant.soil_type}</p>
                  <CardDescription>
                    {plant.soil_type === 'Well-draining' && 'Use a mix with perlite or sand to ensure good drainage and prevent root rot.'}
                    {plant.soil_type === 'Loamy' && 'Rich, balanced soil with good moisture retention and drainage.'}
                    {plant.soil_type === 'Sandy' && 'Fast-draining soil ideal for drought-tolerant plants.'}
                    {plant.soil_type === 'Clay' && 'Dense soil that retains moisture. May need amendments for better drainage.'}
                    {plant.soil_type === 'Peaty' && 'Acidic, moisture-retaining soil rich in organic matter.'}
                    {plant.soil_type === 'Chalky' && 'Alkaline soil with good drainage. May need added nutrients.'}
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

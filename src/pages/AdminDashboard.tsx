import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { PlantCard } from '@/components/plants/PlantCard';
import { PlantFormDialog } from '@/components/admin/PlantFormDialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Leaf, Settings, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PlantFormData {
  name: string;
  category: string;
  type: string;
  watering_schedule: string;
  sunlight_requirement: string;
  soil_type: string;
  description?: string;
  image_url?: string;
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<PlantFormData & { id: string } | null>(null);
  const [deletingPlantId, setDeletingPlantId] = useState<string | null>(null);

  const { data: plants, isLoading } = useQuery({
    queryKey: ['admin-plants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: PlantFormData) => {
      const { error } = await supabase.from('plants').insert([values]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Plant added successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-plants'] });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to add plant: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...values }: PlantFormData & { id: string }) => {
      const { error } = await supabase
        .from('plants')
        .update(values)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Plant updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-plants'] });
      setEditingPlant(null);
    },
    onError: (error) => {
      toast.error('Failed to update plant: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('plants').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Plant deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-plants'] });
      setDeletingPlantId(null);
    },
    onError: (error) => {
      toast.error('Failed to delete plant: ' + error.message);
    },
  });

  const handleCreate = (values: PlantFormData) => {
    createMutation.mutate(values);
  };

  const handleUpdate = (values: PlantFormData) => {
    if (editingPlant) {
      updateMutation.mutate({ ...values, id: editingPlant.id });
    }
  };

  const handleEdit = (plant: typeof plants extends (infer T)[] ? T : never) => {
    setEditingPlant({
      id: plant.id,
      name: plant.name,
      category: plant.category,
      type: plant.type,
      watering_schedule: plant.watering_schedule,
      sunlight_requirement: plant.sunlight_requirement,
      soil_type: plant.soil_type,
      description: plant.description || '',
      image_url: plant.image_url || '',
    });
  };

  return (
    <Layout>
      <div className="container px-4 sm:px-6 py-10 md:py-14">
        {/* Page Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow animate-scale-in">
              <Settings className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
                <Sparkles className="h-4 w-4 animate-pulse-soft" />
                <span>Admin Panel</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold">Plant Catalog</h1>
              <p className="text-muted-foreground mt-1">Manage your plant collection</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)} 
            size="lg" 
            className="h-12 px-6 rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 press-effect animate-fade-in-up stagger-2"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Plant
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 animate-pulse-soft" />
              <Loader2 className="h-8 w-8 animate-spin text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-muted-foreground mt-4">Loading plants...</p>
          </div>
        ) : !plants || plants.length === 0 ? (
          <div className="text-center py-24 animate-fade-in-up">
            <div className="h-24 w-24 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-8 shadow-soft hover-scale">
              <Leaf className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3 animate-fade-in stagger-1">No plants yet</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto animate-fade-in stagger-2">
              Start building your plant catalog by adding your first plant.
            </p>
            <Button 
              onClick={() => setIsFormOpen(true)} 
              size="lg" 
              className="h-12 px-8 rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 press-effect animate-fade-in-up stagger-3"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Plant
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 animate-fade-in">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{plants.length}</span>{' '}
                plant{plants.length !== 1 ? 's' : ''} in catalog
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {plants.map((plant, index) => (
                <div 
                  key={plant.id} 
                  className="animate-fade-in-up opacity-0"
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
                    isAdmin
                    showGardenActions={false}
                    onEdit={() => handleEdit(plant)}
                    onDelete={() => setDeletingPlantId(plant.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <PlantFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />

        {editingPlant && (
          <PlantFormDialog
            open={!!editingPlant}
            onOpenChange={() => setEditingPlant(null)}
            onSubmit={handleUpdate}
            initialValues={editingPlant}
            isLoading={updateMutation.isPending}
          />
        )}

        <AlertDialog open={!!deletingPlantId} onOpenChange={() => setDeletingPlantId(null)}>
          <AlertDialogContent className="animate-scale-in-center">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Plant</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this plant? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="press-effect">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingPlantId && deleteMutation.mutate(deletingPlantId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 press-effect"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}

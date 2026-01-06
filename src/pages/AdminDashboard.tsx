import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { PlantCard } from '@/components/plants/PlantCard';
import { PlantFormDialog } from '@/components/admin/PlantFormDialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Leaf, Settings } from 'lucide-react';
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
      <div className="container py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full gradient-forest flex items-center justify-center">
              <Settings className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your plant catalog</p>
            </div>
          </div>
          <Button onClick={() => setIsFormOpen(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Plant
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !plants || plants.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
              <Leaf className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-2">No plants yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your plant catalog by adding your first plant.
            </p>
            <Button onClick={() => setIsFormOpen(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Plant
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {plants.length} plant{plants.length !== 1 ? 's' : ''} in catalog
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {plants.map((plant) => (
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
                  isAdmin
                  showGardenActions={false}
                  onEdit={() => handleEdit(plant)}
                  onDelete={() => setDeletingPlantId(plant.id)}
                />
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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Plant</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this plant? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingPlantId && deleteMutation.mutate(deletingPlantId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

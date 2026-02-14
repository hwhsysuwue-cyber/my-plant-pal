import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { PlantCard } from '@/components/plants/PlantCard';
import { PlantFormDialog } from '@/components/admin/PlantFormDialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PlantFormData {
  name: string; category: string; type: string; watering_schedule: string;
  sunlight_requirement: string; soil_type: string; description?: string; image_url?: string;
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<PlantFormData & { id: string } | null>(null);
  const [deletingPlantId, setDeletingPlantId] = useState<string | null>(null);

  const { data: plants, isLoading } = useQuery({
    queryKey: ['admin-plants'],
    queryFn: async () => {
      const { data, error } = await supabase.from('plants').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: PlantFormData) => { const { error } = await supabase.from('plants').insert([values]); if (error) throw error; },
    onSuccess: () => { toast.success('Plant added!'); queryClient.invalidateQueries({ queryKey: ['admin-plants'] }); setIsFormOpen(false); },
    onError: (error) => { toast.error('Failed: ' + error.message); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...values }: PlantFormData & { id: string }) => { const { error } = await supabase.from('plants').update(values).eq('id', id); if (error) throw error; },
    onSuccess: () => { toast.success('Plant updated!'); queryClient.invalidateQueries({ queryKey: ['admin-plants'] }); setEditingPlant(null); },
    onError: (error) => { toast.error('Failed: ' + error.message); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('plants').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { toast.success('Plant deleted!'); queryClient.invalidateQueries({ queryKey: ['admin-plants'] }); setDeletingPlantId(null); },
    onError: (error) => { toast.error('Failed: ' + error.message); },
  });

  const handleEdit = (plant: typeof plants extends (infer T)[] ? T : never) => {
    setEditingPlant({
      id: plant.id, name: plant.name, category: plant.category, type: plant.type,
      watering_schedule: plant.watering_schedule, sunlight_requirement: plant.sunlight_requirement,
      soil_type: plant.soil_type, description: plant.description || '', image_url: plant.image_url || '',
    });
  };

  return (
    <Layout>
      <div className="container px-4 sm:px-6 py-6 md:py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Plant Catalog</h1>
            <p className="text-sm text-muted-foreground">Manage your plant collection</p>
          </div>
          <Button size="sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Plant
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !plants || plants.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-14 w-14 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-1">No plants yet</h2>
            <p className="text-sm text-muted-foreground mb-4">Add your first plant to get started.</p>
            <Button size="sm" onClick={() => setIsFormOpen(true)}><Plus className="mr-1.5 h-4 w-4" /> Add Plant</Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-medium text-foreground">{plants.length}</span> plant{plants.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

        <PlantFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={(v) => createMutation.mutate(v as PlantFormData)} isLoading={createMutation.isPending} />
        {editingPlant && (
          <PlantFormDialog open={!!editingPlant} onOpenChange={() => setEditingPlant(null)} onSubmit={(v) => updateMutation.mutate({ ...(v as PlantFormData), id: editingPlant.id })} initialValues={editingPlant} isLoading={updateMutation.isPending} />
        )}

        <AlertDialog open={!!deletingPlantId} onOpenChange={() => setDeletingPlantId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Plant</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deletingPlantId && deleteMutation.mutate(deletingPlantId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}

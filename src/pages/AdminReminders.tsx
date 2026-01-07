import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Bell, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface TemplateForm {
  name: string;
  reminder_type: string;
  frequency_days: number;
  description: string;
  plant_id: string | null;
}

const defaultForm: TemplateForm = {
  name: '',
  reminder_type: 'watering',
  frequency_days: 7,
  description: '',
  plant_id: null,
};

export default function AdminReminders() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<TemplateForm>(defaultForm);

  const { data: templates, isLoading } = useQuery({
    queryKey: ['admin-reminder-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reminder_templates')
        .select('*, plants(name)')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: plants } = useQuery({
    queryKey: ['plants-for-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plants')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: TemplateForm) => {
      const { error } = await supabase.from('reminder_templates').insert([{
        ...values,
        plant_id: values.plant_id === 'null' ? null : values.plant_id,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Reminder template created!');
      queryClient.invalidateQueries({ queryKey: ['admin-reminder-templates'] });
      closeForm();
    },
    onError: (error) => {
      toast.error('Failed to create template: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...values }: TemplateForm & { id: string }) => {
      const { error } = await supabase
        .from('reminder_templates')
        .update({
          ...values,
          plant_id: values.plant_id === 'null' ? null : values.plant_id,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Reminder template updated!');
      queryClient.invalidateQueries({ queryKey: ['admin-reminder-templates'] });
      closeForm();
    },
    onError: (error) => {
      toast.error('Failed to update template: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reminder_templates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Reminder template deleted!');
      queryClient.invalidateQueries({ queryKey: ['admin-reminder-templates'] });
      setDeletingId(null);
    },
    onError: (error) => {
      toast.error('Failed to delete template: ' + error.message);
    },
  });

  const openEdit = (template: any) => {
    setEditingId(template.id);
    setForm({
      name: template.name,
      reminder_type: template.reminder_type,
      frequency_days: template.frequency_days,
      description: template.description || '',
      plant_id: template.plant_id || 'null',
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (editingId) {
      updateMutation.mutate({ ...form, id: editingId });
    } else {
      createMutation.mutate(form);
    }
  };

  const reminderTypes = ['watering', 'fertilizing', 'pruning', 'repotting', 'pest-check', 'rotation'];

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full gradient-forest flex items-center justify-center">
              <Bell className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold">Reminder Templates</h1>
              <p className="text-muted-foreground">Manage plant care reminder schedules</p>
            </div>
          </div>
          <Button onClick={() => setIsFormOpen(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Template
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !templates || templates.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">No reminder templates</h2>
            <p className="text-muted-foreground mb-6">Create templates for plant care reminders</p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Template
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>
                        {template.reminder_type} • Every {template.frequency_days} day{template.frequency_days !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(template)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(template.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {template.description && (
                    <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                  )}
                  {(template.plants as any)?.name && (
                    <p className="text-xs text-muted-foreground">
                      Specific to: {(template.plants as any).name}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={closeForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Template' : 'New Reminder Template'}</DialogTitle>
              <DialogDescription>
                Define a reminder schedule for plant care tasks
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Weekly Watering"
                />
              </div>
              <div>
                <Label htmlFor="type">Reminder Type</Label>
                <Select value={form.reminder_type} onValueChange={(v) => setForm({ ...form, reminder_type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="frequency">Frequency (days)</Label>
                <Input
                  id="frequency"
                  type="number"
                  min={1}
                  value={form.frequency_days}
                  onChange={(e) => setForm({ ...form, frequency_days: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label htmlFor="plant">Specific Plant (optional)</Label>
                <Select value={form.plant_id || 'null'} onValueChange={(v) => setForm({ ...form, plant_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All plants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">All plants</SelectItem>
                    {plants?.map((plant) => (
                      <SelectItem key={plant.id} value={plant.id}>
                        {plant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Additional notes about this reminder"
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingId ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Template</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This will also remove all user reminders using this template.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingId && deleteMutation.mutate(deletingId)}
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

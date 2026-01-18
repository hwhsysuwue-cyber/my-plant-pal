import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReminderListSkeleton } from '@/components/skeletons/ReminderCardSkeleton';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { Bell, Check, Droplets, Sun, Leaf, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns';

export default function Reminders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reminders, isLoading } = useQuery({
    queryKey: ['user-reminders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_reminders')
        .select('*, plants(*), reminder_templates(*)')
        .eq('user_id', user!.id)
        .eq('is_completed', false)
        .order('next_reminder_date', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: templates } = useQuery({
    queryKey: ['reminder-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reminder_templates')
        .select('*, plants(name)')
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: userGarden } = useQuery({
    queryKey: ['user-garden-plants', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_gardens')
        .select('*, plants(*)')
        .eq('user_id', user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const completeMutation = useMutation({
    mutationFn: async ({ id, templateId, plantId }: { id: string; templateId: string | null; plantId: string }) => {
      // Mark current reminder as completed
      const { error: updateError } = await supabase
        .from('user_reminders')
        .update({ is_completed: true })
        .eq('id', id);
      if (updateError) throw updateError;

      // If there's a template, create the next reminder
      if (templateId) {
        const template = templates?.find((t) => t.id === templateId);
        if (template) {
          const nextDate = addDays(new Date(), template.frequency_days);
          const { error: insertError } = await supabase.from('user_reminders').insert({
            user_id: user!.id,
            plant_id: plantId,
            reminder_template_id: templateId,
            next_reminder_date: format(nextDate, 'yyyy-MM-dd'),
          });
          if (insertError) throw insertError;
        }
      }
    },
    onSuccess: () => {
      toast.success('Reminder completed!');
      queryClient.invalidateQueries({ queryKey: ['user-reminders'] });
    },
    onError: (error) => {
      toast.error('Failed to complete reminder: ' + error.message);
    },
  });

  const createReminderMutation = useMutation({
    mutationFn: async ({ templateId, plantId }: { templateId: string; plantId: string }) => {
      const template = templates?.find((t) => t.id === templateId);
      if (!template) throw new Error('Template not found');

      const nextDate = addDays(new Date(), template.frequency_days);
      const { error } = await supabase.from('user_reminders').insert({
        user_id: user!.id,
        plant_id: plantId,
        reminder_template_id: templateId,
        next_reminder_date: format(nextDate, 'yyyy-MM-dd'),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Reminder created!');
      queryClient.invalidateQueries({ queryKey: ['user-reminders'] });
    },
    onError: (error) => {
      toast.error('Failed to create reminder: ' + error.message);
    },
  });

  const getDateBadge = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isPast(date) && !isToday(date)) {
      return <Badge variant="destructive" className="animate-pulse-soft">Overdue</Badge>;
    }
    if (isToday(date)) {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 animate-bounce-soft">Today</Badge>;
    }
    if (isTomorrow(date)) {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Tomorrow</Badge>;
    }
    return <Badge variant="secondary">{format(date, 'MMM d')}</Badge>;
  };

  const getReminderIcon = (type: string) => {
    if (type.toLowerCase().includes('water')) return <Droplets className="h-4 w-4 text-water" />;
    if (type.toLowerCase().includes('sun') || type.toLowerCase().includes('light')) return <Sun className="h-4 w-4 text-sun" />;
    return <Leaf className="h-4 w-4 text-leaf" />;
  };

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['user-reminders'] });
    await queryClient.invalidateQueries({ queryKey: ['reminder-templates'] });
    toast.success('Reminders refreshed!');
  }, [queryClient]);

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 text-center animate-fade-in-up">
          <div className="h-24 w-24 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-6 hover-scale">
            <Bell className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="font-display text-3xl font-semibold mb-2">Plant Reminders</h1>
          <p className="text-muted-foreground">Please sign in to view your reminders</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
        <div className="container px-4 sm:px-6 py-10 md:py-14 max-w-4xl">
        {/* Page Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-3">
            <Sparkles className="h-4 w-4 animate-pulse-soft" />
            <span>Stay On Track</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-3">Plant Care Reminders</h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Stay on top of your plant care schedule
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-xl font-semibold mb-4">Upcoming Reminders</h2>
              <ReminderListSkeleton count={3} />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Reminders */}
            <div className="animate-fade-in-up">
              <h2 className="font-display text-xl font-semibold mb-4">Upcoming Reminders</h2>
              {!reminders || reminders.length === 0 ? (
                <Card className="animate-scale-in">
                  <CardContent className="py-8 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                      <Bell className="h-8 w-8 text-muted-foreground animate-bounce-soft" />
                    </div>
                    <p className="text-muted-foreground">No active reminders</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add plants to your garden and set up reminders below
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {reminders.map((reminder, index) => (
                    <Card 
                      key={reminder.id} 
                      className="hover-lift animate-fade-in-up opacity-0"
                      style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center transition-colors hover:bg-primary/10">
                              {getReminderIcon((reminder.reminder_templates as any)?.reminder_type || '')}
                            </div>
                            <div>
                              <p className="font-medium">{(reminder.plants as any)?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(reminder.reminder_templates as any)?.name || 'Custom reminder'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getDateBadge(reminder.next_reminder_date)}
                            <Button
                              size="sm"
                              variant="outline"
                              className="press-effect hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() =>
                                completeMutation.mutate({
                                  id: reminder.id,
                                  templateId: reminder.reminder_template_id,
                                  plantId: reminder.plant_id,
                                })
                              }
                              disabled={completeMutation.isPending}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Done
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Available Templates */}
            {userGarden && userGarden.length > 0 && templates && templates.length > 0 && (
              <div className="animate-fade-in-up stagger-3">
                <h2 className="font-display text-xl font-semibold mb-4">Set Up Reminders</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {templates.map((template, index) => (
                    <Card 
                      key={template.id} 
                      className="hover-lift animate-fade-in-up opacity-0"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                            {getReminderIcon(template.reminder_type)}
                          </div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                        </div>
                        <CardDescription>
                          Every {template.frequency_days} day{template.frequency_days !== 1 ? 's' : ''}
                          {template.description && ` • ${template.description}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {userGarden.map((garden) => {
                            const hasReminder = reminders?.some(
                              (r) => r.plant_id === garden.plant_id && r.reminder_template_id === template.id
                            );
                            return (
                              <Button
                                key={garden.id}
                                size="sm"
                                variant={hasReminder ? 'secondary' : 'outline'}
                                disabled={hasReminder || createReminderMutation.isPending}
                                className="press-effect transition-all"
                                onClick={() =>
                                  createReminderMutation.mutate({
                                    templateId: template.id,
                                    plantId: garden.plant_id,
                                  })
                                }
                              >
                                {(garden.plants as any)?.name}
                                {hasReminder && <Check className="ml-1 h-3 w-3" />}
                              </Button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {(!userGarden || userGarden.length === 0) && (
              <Card className="animate-fade-in-up">
                <CardContent className="py-8 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Add plants to your garden first</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Visit the Search page to find and add plants to your garden
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        </div>
      </PullToRefresh>
    </Layout>
  );
}

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReminderListSkeleton } from '@/components/skeletons/ReminderCardSkeleton';
import { PullToRefresh } from '@/components/ui/pull-to-refresh';
import { SwipeableCard } from '@/components/ui/swipeable-card';
import { Bell, Check, Droplets, Sun, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns';

export default function Reminders() {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  useKeyboardNavigation({ isAdmin });

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
      const { data, error } = await supabase.from('reminder_templates').select('*, plants(name)').order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: userGarden } = useQuery({
    queryKey: ['user-garden-plants', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_gardens').select('*, plants(*)').eq('user_id', user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const completeMutation = useMutation({
    mutationFn: async ({ id, templateId, plantId }: { id: string; templateId: string | null; plantId: string }) => {
      const { error: updateError } = await supabase.from('user_reminders').update({ is_completed: true }).eq('id', id);
      if (updateError) throw updateError;
      if (templateId) {
        const template = templates?.find((t) => t.id === templateId);
        if (template) {
          const nextDate = addDays(new Date(), template.frequency_days);
          const { error: insertError } = await supabase.from('user_reminders').insert({
            user_id: user!.id, plant_id: plantId, reminder_template_id: templateId,
            next_reminder_date: format(nextDate, 'yyyy-MM-dd'),
          });
          if (insertError) throw insertError;
        }
      }
    },
    onSuccess: () => { toast.success('Reminder completed!'); queryClient.invalidateQueries({ queryKey: ['user-reminders'] }); },
    onError: (error) => { toast.error('Failed: ' + error.message); },
  });

  const createReminderMutation = useMutation({
    mutationFn: async ({ templateId, plantId }: { templateId: string; plantId: string }) => {
      const template = templates?.find((t) => t.id === templateId);
      if (!template) throw new Error('Template not found');
      const nextDate = addDays(new Date(), template.frequency_days);
      const { error } = await supabase.from('user_reminders').insert({
        user_id: user!.id, plant_id: plantId, reminder_template_id: templateId,
        next_reminder_date: format(nextDate, 'yyyy-MM-dd'),
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Reminder created!'); queryClient.invalidateQueries({ queryKey: ['user-reminders'] }); },
    onError: (error) => { toast.error('Failed: ' + error.message); },
  });

  const getDateBadge = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isPast(date) && !isToday(date)) return <Badge variant="destructive">Overdue</Badge>;
    if (isToday(date)) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Today</Badge>;
    if (isTomorrow(date)) return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Tomorrow</Badge>;
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
    toast.success('Refreshed!');
  }, [queryClient]);

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <div className="h-14 w-14 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4">
            <Bell className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Reminders</h1>
          <p className="text-muted-foreground">Sign in to view your reminders</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
        <div className="container px-4 sm:px-6 py-6 md:py-8 max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Reminders</h1>
            <p className="text-sm text-muted-foreground">Stay on top of your plant care schedule</p>
          </div>

          {isLoading ? (
            <ReminderListSkeleton count={3} />
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Upcoming</h2>
                {!reminders || reminders.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No active reminders</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {reminders.map((reminder) => (
                      <SwipeableCard
                        key={reminder.id}
                        onSwipeRight={() => completeMutation.mutate({ id: reminder.id, templateId: reminder.reminder_template_id, plantId: reminder.plant_id })}
                        rightAction="complete"
                        rightLabel="Done"
                      >
                        <Card className="border shadow-none">
                          <CardContent className="py-3 px-4">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                                  {getReminderIcon((reminder.reminder_templates as any)?.reminder_type || '')}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{(reminder.plants as any)?.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {(reminder.reminder_templates as any)?.name || 'Custom'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {getDateBadge(reminder.next_reminder_date)}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs"
                                  onClick={() => completeMutation.mutate({ id: reminder.id, templateId: reminder.reminder_template_id, plantId: reminder.plant_id })}
                                  disabled={completeMutation.isPending}
                                >
                                  <Check className="h-3.5 w-3.5 mr-1" /> Done
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </SwipeableCard>
                    ))}
                  </div>
                )}
              </div>

              {userGarden && userGarden.length > 0 && templates && templates.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Set Up Reminders</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {templates.map((template) => (
                      <Card key={template.id}>
                        <CardHeader className="pb-2 p-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center">
                              {getReminderIcon(template.reminder_type)}
                            </div>
                            <CardTitle className="text-sm">{template.name}</CardTitle>
                          </div>
                          <CardDescription className="text-xs">
                            Every {template.frequency_days} day{template.frequency_days !== 1 ? 's' : ''}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex flex-wrap gap-1.5">
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
                                  className="h-7 text-xs"
                                  onClick={() => createReminderMutation.mutate({ templateId: template.id, plantId: garden.plant_id })}
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
                <Card>
                  <CardContent className="py-8 text-center">
                    <Leaf className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Add plants to your garden first</p>
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

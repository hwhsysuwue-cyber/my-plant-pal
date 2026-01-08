import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, Trash2, Reply, Check } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
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

type FeedbackStatus = 'new' | 'reviewed' | 'resolved';

export default function AdminFeedback() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const { data: feedback, isLoading } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*, profiles(email, full_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: FeedbackStatus }) => {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
    },
    onError: (error) => {
      toast.error('Failed to update status: ' + error.message);
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      const { error } = await supabase
        .from('feedback')
        .update({ 
          admin_reply: reply.trim(),
          replied_at: new Date().toISOString(),
          status: 'reviewed' as FeedbackStatus
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Reply sent successfully');
      setReplyingId(null);
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
    },
    onError: (error) => {
      toast.error('Failed to send reply: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('feedback').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Feedback deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      setDeletingId(null);
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    },
  });

  const filteredFeedback = feedback?.filter((item) =>
    filterStatus === 'all' ? true : item.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (t: string) => {
    switch (t) {
      case 'feedback': return 'bg-primary/10 text-primary';
      case 'suggestion': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'issue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleStartReply = (id: string, existingReply?: string | null) => {
    setReplyingId(id);
    setReplyText(existingReply || '');
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full gradient-forest flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold">Feedback Management</h1>
              <p className="text-muted-foreground">Review and respond to user feedback</p>
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !filteredFeedback || filteredFeedback.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">No feedback found</h2>
            <p className="text-muted-foreground">
              {filterStatus === 'all' ? 'No feedback has been submitted yet' : `No ${filterStatus} feedback`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {filteredFeedback.length} feedback item{filteredFeedback.length !== 1 ? 's' : ''}
            </p>
            {filteredFeedback.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getTypeColor(item.type)} variant="secondary">
                            {item.type}
                          </Badge>
                          <Badge className={getStatusColor(item.status)} variant="secondary">
                            {item.status}
                          </Badge>
                          {item.admin_reply && (
                            <Badge variant="outline" className="text-primary border-primary">
                              <Check className="h-3 w-3 mr-1" />
                              Replied
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mb-2">{item.message}</p>
                        <p className="text-xs text-muted-foreground">
                          From: {(item.profiles as any)?.full_name || (item.profiles as any)?.email || 'Unknown'} •{' '}
                          {format(new Date(item.created_at), 'PPp')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {replyingId !== item.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartReply(item.id, item.admin_reply)}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            {item.admin_reply ? 'Edit Reply' : 'Reply'}
                          </Button>
                        )}
                        <Select
                          value={item.status}
                          onValueChange={(v) =>
                            updateStatusMutation.mutate({ id: item.id, status: v as FeedbackStatus })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Show existing reply */}
                    {item.admin_reply && replyingId !== item.id && (
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-xs font-medium text-primary mb-1">Your Reply:</p>
                        <p className="text-sm">{item.admin_reply}</p>
                        {item.replied_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Replied {format(new Date(item.replied_at), 'PPp')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Reply form */}
                    {replyingId === item.id && (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          maxLength={1000}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => replyMutation.mutate({ id: item.id, reply: replyText })}
                            disabled={!replyText.trim() || replyMutation.isPending}
                          >
                            {replyMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Reply className="h-4 w-4 mr-1" />
                            )}
                            Send Reply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReplyingId(null);
                              setReplyText('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this feedback? This action cannot be undone.
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

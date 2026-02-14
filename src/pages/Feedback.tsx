import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

type FeedbackType = 'feedback' | 'suggestion' | 'issue';

export default function Feedback() {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [type, setType] = useState<FeedbackType>('feedback');
  useKeyboardNavigation({ isAdmin });

  const { data: myFeedback, isLoading } = useQuery({
    queryKey: ['my-feedback', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('feedback').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('feedback').insert({ user_id: user!.id, type, message: message.trim() });
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Feedback submitted!'); setMessage(''); setType('feedback'); queryClient.invalidateQueries({ queryKey: ['my-feedback'] }); },
    onError: (error) => { toast.error('Failed: ' + error.message); },
  });

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

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <div className="h-14 w-14 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Feedback</h1>
          <p className="text-muted-foreground">Sign in to submit feedback</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 sm:px-6 py-6 md:py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Feedback</h1>
          <p className="text-sm text-muted-foreground">Share your thoughts, suggestions, or report issues</p>
        </div>

        <Card className="mb-6">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">New Feedback</CardTitle>
            <CardDescription className="text-xs">We value your input</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-3">
            <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
              <SelectTrigger className="w-full sm:w-36 h-9 text-sm">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
                <SelectItem value="issue">Issue</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Share your feedback..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={1000}
              className="resize-none text-sm"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{message.length}/1000</span>
              <Button
                size="sm"
                onClick={() => submitMutation.mutate()}
                disabled={!message.trim() || submitMutation.isPending}
              >
                {submitMutation.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-1.5 h-3.5 w-3.5" />}
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Your Submissions</h2>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : !myFeedback || myFeedback.length === 0 ? (
            <Card><CardContent className="py-8 text-center"><p className="text-sm text-muted-foreground">No feedback yet</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {myFeedback.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <Badge className={getTypeColor(item.type)} variant="secondary">{item.type}</Badge>
                      <Badge className={getStatusColor(item.status)} variant="secondary">{item.status}</Badge>
                      {item.admin_reply && <Badge variant="outline" className="text-primary border-primary text-xs">Replied</Badge>}
                    </div>
                    <p className="text-sm mb-1.5">{item.message}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(item.created_at), 'PPp')}</p>
                    {item.admin_reply && (
                      <div className="mt-3 p-3 bg-accent rounded-md">
                        <p className="text-xs font-medium text-primary mb-1">Admin Response:</p>
                        <p className="text-sm">{item.admin_reply}</p>
                        {item.replied_at && <p className="text-xs text-muted-foreground mt-1">{format(new Date(item.replied_at), 'PPp')}</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

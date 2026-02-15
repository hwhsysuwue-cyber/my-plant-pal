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
      case 'new': return 'bg-water/15 text-water border-water/20';
      case 'reviewed': return 'bg-sun/15 text-sun border-sun/20';
      case 'resolved': return 'bg-leaf/15 text-leaf border-leaf/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (t: string) => {
    switch (t) {
      case 'feedback': return 'bg-primary/10 text-primary border-primary/20';
      case 'suggestion': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'issue': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
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
        <div className="page-header">
          <h1 className="page-title">Feedback</h1>
          <p className="page-subtitle">Share your thoughts, suggestions, or report issues</p>
        </div>

        <Card className="mb-8 rounded-xl shadow-soft overflow-hidden">
          <div className="h-0.5 gradient-primary" />
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-semibold">New Feedback</CardTitle>
            <CardDescription className="text-xs">We value your input</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-lg text-sm">
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
              className="resize-none text-sm rounded-lg"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{message.length}/1000</span>
              <Button
                size="sm"
                className="rounded-lg shadow-glow hover:shadow-glow-lg transition-all"
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
          <p className="section-label">Your Submissions</p>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : !myFeedback || myFeedback.length === 0 ? (
            <Card className="rounded-xl shadow-soft"><CardContent className="py-10 text-center"><p className="text-sm text-muted-foreground">No feedback yet</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {myFeedback.map((item) => (
                <Card key={item.id} className="rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <Badge className={`${getTypeColor(item.type)} rounded-md`} variant="secondary">{item.type}</Badge>
                      <Badge className={`${getStatusColor(item.status)} rounded-md`} variant="secondary">{item.status}</Badge>
                      {item.admin_reply && <Badge variant="outline" className="text-primary border-primary/30 rounded-md text-xs">Replied</Badge>}
                    </div>
                    <p className="text-sm mb-2 leading-relaxed">{item.message}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(item.created_at), 'PPp')}</p>
                    {item.admin_reply && (
                      <div className="mt-4 p-4 bg-accent/50 rounded-xl border border-accent">
                        <p className="text-xs font-semibold text-primary mb-1">Admin Response:</p>
                        <p className="text-sm leading-relaxed">{item.admin_reply}</p>
                        {item.replied_at && <p className="text-xs text-muted-foreground mt-2">{format(new Date(item.replied_at), 'PPp')}</p>}
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

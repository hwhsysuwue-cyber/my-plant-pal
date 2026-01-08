import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [type, setType] = useState<FeedbackType>('feedback');

  const { data: myFeedback, isLoading } = useQuery({
    queryKey: ['my-feedback', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('feedback').insert({
        user_id: user!.id,
        type,
        message: message.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Feedback submitted successfully!');
      setMessage('');
      setType('feedback');
      queryClient.invalidateQueries({ queryKey: ['my-feedback'] });
    },
    onError: (error) => {
      toast.error('Failed to submit feedback: ' + error.message);
    },
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
          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-3xl font-semibold mb-2">Feedback</h1>
          <p className="text-muted-foreground">Please sign in to submit feedback</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold mb-2">Submit Feedback</h1>
          <p className="text-muted-foreground">
            Help us improve by sharing your thoughts, suggestions, or reporting issues
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>New Feedback</CardTitle>
            <CardDescription>We value your input and will review it promptly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="issue">Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Share your feedback, suggestion, or describe an issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{message.length}/1000</span>
              <Button
                onClick={() => submitMutation.mutate()}
                disabled={!message.trim() || submitMutation.isPending}
              >
                {submitMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="font-display text-xl font-semibold mb-4">Your Submissions</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !myFeedback || myFeedback.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              You haven't submitted any feedback yet
            </p>
          ) : (
            <div className="space-y-4">
              {myFeedback.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-4">
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
                              Replied
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{item.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Submitted {format(new Date(item.created_at), 'PPp')}
                        </p>

                        {/* Show admin reply */}
                        {item.admin_reply && (
                          <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-xs font-medium text-primary mb-1">Admin Response:</p>
                            <p className="text-sm">{item.admin_reply}</p>
                            {item.replied_at && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(item.replied_at), 'PPp')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
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

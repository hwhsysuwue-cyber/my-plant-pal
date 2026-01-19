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
import { Loader2, MessageSquare, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

type FeedbackType = 'feedback' | 'suggestion' | 'issue';

export default function Feedback() {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [type, setType] = useState<FeedbackType>('feedback');

  // Enable keyboard navigation (Alt + Arrow keys)
  useKeyboardNavigation({ isAdmin });

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
        <div className="container py-16 text-center animate-fade-in-up">
          <div className="h-24 w-24 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-6 hover-scale">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="font-display text-3xl font-semibold mb-2">Feedback</h1>
          <p className="text-muted-foreground">Please sign in to submit feedback</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 sm:px-6 py-10 md:py-14 max-w-4xl">
        {/* Page Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-3">
            <Sparkles className="h-4 w-4 animate-pulse-soft" />
            <span>We're Listening</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-3">Submit Feedback</h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Help us improve by sharing your thoughts, suggestions, or reporting issues
          </p>
        </div>

        <Card className="mb-8 animate-fade-in-up hover-lift">
          <CardHeader>
            <CardTitle>New Feedback</CardTitle>
            <CardDescription>We value your input and will review it promptly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
                <SelectTrigger className="w-full sm:w-40 transition-all focus:ring-2 focus:ring-primary/20">
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
              className="transition-all focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <span className="text-sm text-muted-foreground">{message.length}/1000</span>
              <Button
                className="w-full sm:w-auto press-effect shadow-glow hover:shadow-glow-lg transition-all"
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

        <div className="animate-fade-in-up stagger-2">
          <h2 className="font-display text-xl font-semibold mb-4">Your Submissions</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !myFeedback || myFeedback.length === 0 ? (
            <Card className="animate-scale-in">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  You haven't submitted any feedback yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myFeedback.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="hover-lift animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
                >
                  <CardContent className="pt-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={`${getTypeColor(item.type)} transition-all`} variant="secondary">
                          {item.type}
                        </Badge>
                        <Badge className={`${getStatusColor(item.status)} transition-all`} variant="secondary">
                          {item.status}
                        </Badge>
                        {item.admin_reply && (
                          <Badge variant="outline" className="text-primary border-primary animate-pulse-soft">
                            Replied
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p className="text-sm">{item.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Submitted {format(new Date(item.created_at), 'PPp')}
                        </p>
                      </div>

                      {/* Show admin reply */}
                      {item.admin_reply && (
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
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

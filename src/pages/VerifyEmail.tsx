import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Mail, Loader2, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email || '';
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendEmail = async () => {
    if (!email || cooldown > 0) return;
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Verification email sent!');
        setCooldown(60); // 60 second cooldown
      }
    } catch (err) {
      toast.error('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email_confirmed_at) {
        toast.success('Email verified! Redirecting...');
        window.location.href = '/';
      } else {
        toast.info('Email not verified yet. Please check your inbox.');
      }
    } catch (err) {
      toast.error('Failed to check verification status.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/50 via-background to-mint/30 p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <Link 
          to="/auth" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to sign in
        </Link>

        <Card className="shadow-strong border-border/50 rounded-2xl overflow-hidden">
          {/* Top accent line */}
          <div className="h-1 gradient-primary" />
          
          <CardHeader className="text-center pt-8 pb-4">
            <div className="flex justify-center mb-5">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
            <CardDescription className="text-base mt-2 leading-relaxed">
              We've sent a verification link to{' '}
              {email && (
                <span className="font-medium text-foreground">{email}</span>
              )}
              {!email && 'your email address'}.
              <br />
              Please click the link to activate your account and continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 space-y-6">
            {/* Warning message */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
                You won't be able to access the dashboard until your email is verified.
              </p>
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm font-medium">Waiting for verification…</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRefresh}
                className="w-full h-11 rounded-xl text-base font-medium shadow-glow hover:shadow-glow-lg transition-all"
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking status...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    I've verified my email
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleResendEmail}
                className="w-full h-11 rounded-xl text-base font-medium"
                disabled={isResending || cooldown > 0 || !email}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : cooldown > 0 ? (
                  `Resend email (${cooldown}s)`
                ) : (
                  'Resend verification email'
                )}
              </Button>
            </div>

            {/* Helper text */}
            <p className="text-center text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder.
            </p>

            {/* Divider */}
            <div className="border-t border-border pt-4">
              <p className="text-center text-sm text-muted-foreground">
                Wrong email?{' '}
                <Link to="/auth?mode=signup" className="text-primary font-medium hover:underline">
                  Sign up again
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer branding */}
        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <div className="h-6 w-6 rounded-lg gradient-primary flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-medium">PlantCare</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

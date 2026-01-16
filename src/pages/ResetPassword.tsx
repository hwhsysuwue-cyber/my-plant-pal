import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Loader2, ArrowLeft, Eye, EyeOff, CheckCircle2, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    // Check if we have a valid recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // A recovery session will have the user but came from a recovery link
      if (session?.user) {
        setIsValidSession(true);
      } else {
        setIsValidSession(false);
      }
    });

    // Listen for password recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleResetPassword = async (values: ResetPasswordValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success('Password updated successfully!');
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      }
    } catch (err) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/50 via-background to-mint/30 p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid or expired session
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/50 via-background to-mint/30 p-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <Card className="shadow-strong border-border/50 rounded-2xl overflow-hidden">
            <div className="h-1 bg-destructive" />
            <CardHeader className="text-center pt-8 pb-4">
              <div className="flex justify-center mb-5">
                <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                  <KeyRound className="h-7 w-7 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Invalid Reset Link</CardTitle>
              <CardDescription className="text-base mt-1">
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <Link to="/auth?mode=forgot">
                <Button className="w-full h-11 rounded-xl text-base font-medium">
                  Request New Reset Link
                </Button>
              </Link>
              <div className="mt-4 text-center">
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Back to sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/50 via-background to-mint/30 p-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <Card className="shadow-strong border-border/50 rounded-2xl overflow-hidden">
            <div className="h-1 gradient-primary" />
            <CardHeader className="text-center pt-8 pb-4">
              <div className="flex justify-center mb-5">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Password Updated!</CardTitle>
              <CardDescription className="text-base mt-1">
                Your password has been successfully reset. Redirecting you to sign in...
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <div className="h-1 gradient-primary" />
          
          <CardHeader className="text-center pt-8 pb-4">
            <div className="flex justify-center mb-5">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                <KeyRound className="h-7 w-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
            <CardDescription className="text-base mt-1">
              Enter your new password below
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8">
            <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? 'text' : 'password'} 
                    className="h-11 rounded-xl pr-11" 
                    {...form.register('password')} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    placeholder="••••••••" 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    className="h-11 rounded-xl pr-11" 
                    {...form.register('confirmPassword')} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl text-base font-medium shadow-glow hover:shadow-glow-lg transition-all" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
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

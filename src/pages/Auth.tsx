import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Loader2, ArrowLeft, Sparkles, Eye, EyeOff, Mail, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const [mode, setModeState] = useState<'signin' | 'signup' | 'forgot'>(
    modeParam === 'signup' ? 'signup' : modeParam === 'forgot' ? 'forgot' : 'signin'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { signIn, signUp, user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate(isAdmin ? '/admin' : '/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', fullName: '' },
  });

  const forgotPasswordForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const setMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    setModeState(newMode);
    setResetEmailSent(false);
    if (newMode === 'signup') {
      setSearchParams({ mode: 'signup' }, { replace: true });
    } else if (newMode === 'forgot') {
      setSearchParams({ mode: 'forgot' }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleSignIn = async (values: SignInValues) => {
    setIsLoading(true);
    const { error } = await signIn(values.email, values.password);
    setIsLoading(false);
    if (error) {
      toast.error(error.message.includes('Invalid login credentials') ? 'Invalid email or password' : error.message);
    } else {
      toast.success('Welcome back!');
    }
  };

  const handleSignUp = async (values: SignUpValues) => {
    setIsLoading(true);
    const { error } = await signUp(values.email, values.password, values.fullName);
    setIsLoading(false);
    if (error) {
      toast.error(error.message.includes('already registered') ? 'This email is already registered.' : error.message);
    } else {
      toast.success('Account created successfully!');
    }
  };

  const handleForgotPassword = async (values: ForgotPasswordValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setResetEmailSent(true);
        toast.success('Password reset email sent!');
      }
    } catch (err) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password success state
  if (mode === 'forgot' && resetEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <button 
            onClick={() => setMode('signin')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to sign in
          </button>

           <Card className="border rounded-lg overflow-hidden">
             <div className="h-0.5 gradient-primary" />
            
            <CardHeader className="text-center pt-8 pb-4">
              <div className="flex justify-center mb-5">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
              <CardDescription className="text-base mt-1">
                We've sent a password reset link to{' '}
                <span className="font-medium text-foreground">{forgotPasswordForm.getValues('email')}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-8 space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
              
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground text-center">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    onClick={() => setResetEmailSent(false)}
                    className="text-primary font-medium hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>

              <Button 
                onClick={() => setMode('signin')}
                variant="outline"
                className="w-full h-11 rounded-xl text-base font-medium"
              >
                Return to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {mode === 'forgot' ? (
          <button 
            onClick={() => setMode('signin')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to sign in
          </button>
        ) : (
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
        )}

        <Card className="border rounded-lg overflow-hidden">
          <div className="h-0.5 gradient-primary" />
          
          <CardHeader className="text-center pt-8 pb-4">
            <div className="flex justify-center mb-5">
              <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center">
                {mode === 'forgot' ? (
                  <Mail className="h-7 w-7 text-white" />
                ) : (
                  <Leaf className="h-7 w-7 text-white" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {mode === 'signin' 
                ? 'Sign in to continue your plant journey' 
                : mode === 'signup' 
                  ? 'Start your plant care journey today'
                  : "Enter your email and we'll send you a reset link"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8">
            {mode === 'signin' ? (
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="signin-email" 
                    placeholder="you@example.com" 
                    type="email" 
                    className="h-11 rounded-xl" 
                    {...signInForm.register('email')} 
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                    <button 
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-sm text-primary hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input 
                      id="signin-password" 
                      placeholder="••••••••" 
                      type={showPassword ? 'text' : 'password'} 
                      className="h-11 rounded-xl pr-11" 
                      {...signInForm.register('password')} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl text-base font-medium shadow-glow hover:shadow-glow-lg transition-all" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            ) : mode === 'signup' ? (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname" className="text-sm font-medium">Full Name</Label>
                  <Input 
                    id="signup-fullname" 
                    placeholder="Jane Doe" 
                    className="h-11 rounded-xl" 
                    {...signUpForm.register('fullName')} 
                  />
                  {signUpForm.formState.errors.fullName && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.fullName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="signup-email" 
                    placeholder="you@example.com" 
                    type="email" 
                    className="h-11 rounded-xl" 
                    {...signUpForm.register('email')} 
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input 
                      id="signup-password" 
                      placeholder="••••••••" 
                      type={showPassword ? 'text' : 'password'} 
                      className="h-11 rounded-xl pr-11" 
                      {...signUpForm.register('password')} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm" className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Input 
                      id="signup-confirm" 
                      placeholder="••••••••" 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      className="h-11 rounded-xl pr-11" 
                      {...signUpForm.register('confirmPassword')} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">{signUpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl text-base font-medium shadow-glow hover:shadow-glow-lg transition-all" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="forgot-email" 
                    placeholder="you@example.com" 
                    type="email" 
                    className="h-11 rounded-xl" 
                    {...forgotPasswordForm.register('email')} 
                  />
                  {forgotPasswordForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{forgotPasswordForm.formState.errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl text-base font-medium shadow-glow hover:shadow-glow-lg transition-all" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-border text-center">
              {mode === 'signin' ? (
                <p className="text-muted-foreground text-sm">
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-primary font-medium hover:underline transition-colors">
                    Sign up free
                  </button>
                </p>
              ) : mode === 'signup' ? (
                <p className="text-muted-foreground text-sm">
                  Already have an account?{' '}
                  <button onClick={() => setMode('signin')} className="text-primary font-medium hover:underline transition-colors">
                    Sign in
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Remember your password?{' '}
                  <button onClick={() => setMode('signin')} className="text-primary font-medium hover:underline transition-colors">
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

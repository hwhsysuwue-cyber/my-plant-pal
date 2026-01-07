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
import { Leaf, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

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

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const [mode, setModeState] = useState<'signin' | 'signup'>(modeParam === 'signup' ? 'signup' : 'signin');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Only redirect after auth is fully loaded
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

  const setMode = (newMode: 'signin' | 'signup') => {
    setModeState(newMode);
    setSearchParams(newMode === 'signup' ? { mode: 'signup' } : {}, { replace: true });
  };

  const handleSignIn = async (values: SignInValues) => {
    setIsLoading(true);
    const { error } = await signIn(values.email, values.password);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Welcome back!');
    }
  };

  const handleSignUp = async (values: SignUpValues) => {
    setIsLoading(true);
    const { error } = await signUp(values.email, values.password, values.fullName);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please sign in.');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Account created successfully!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="shadow-elevated border-border/50">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-full gradient-forest flex items-center justify-center animate-float">
                <Leaf className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="font-display text-2xl">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {mode === 'signin'
                ? 'Sign in to access your plant collection'
                : 'Start your plant care journey today'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {mode === 'signin' ? (
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    spellCheck={false}
                    {...signInForm.register('email')}
                  />
                  {signInForm.formState.errors.email?.message && (
                    <p className="text-sm font-medium text-destructive">
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    placeholder="••••••••"
                    type="password"
                    autoComplete="current-password"
                    {...signInForm.register('password')}
                  />
                  {signInForm.formState.errors.password?.message && (
                    <p className="text-sm font-medium text-destructive">
                      {signInForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
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
            ) : (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname">Full Name</Label>
                  <Input
                    id="signup-fullname"
                    placeholder="Jane Doe"
                    autoComplete="name"
                    {...signUpForm.register('fullName')}
                  />
                  {signUpForm.formState.errors.fullName?.message && (
                    <p className="text-sm font-medium text-destructive">
                      {signUpForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    spellCheck={false}
                    {...signUpForm.register('email')}
                  />
                  {signUpForm.formState.errors.email?.message && (
                    <p className="text-sm font-medium text-destructive">
                      {signUpForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    placeholder="••••••••"
                    type="password"
                    autoComplete="new-password"
                    {...signUpForm.register('password')}
                  />
                  {signUpForm.formState.errors.password?.message && (
                    <p className="text-sm font-medium text-destructive">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    placeholder="••••••••"
                    type="password"
                    autoComplete="new-password"
                    {...signUpForm.register('confirmPassword')}
                  />
                  {signUpForm.formState.errors.confirmPassword?.message && (
                    <p className="text-sm font-medium text-destructive">
                      {signUpForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm">
              {mode === 'signin' ? (
                <p className="text-muted-foreground">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="text-primary font-medium hover:underline"
                  >
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

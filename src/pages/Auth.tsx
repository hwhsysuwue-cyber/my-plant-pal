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

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="shadow-card border-border/50">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-5">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
                <Leaf className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="font-display text-2xl">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-base">
              {mode === 'signin' ? 'Sign in to your account' : 'Get started with PlantCare'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {mode === 'signin' ? (
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" placeholder="you@example.com" type="email" className="h-11" {...signInForm.register('email')} />
                  {signInForm.formState.errors.email && <p className="text-sm text-destructive">{signInForm.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" placeholder="••••••••" type="password" className="h-11" {...signInForm.register('password')} />
                  {signInForm.formState.errors.password && <p className="text-sm text-destructive">{signInForm.formState.errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : 'Sign In'}
                </Button>
              </form>
            ) : (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname">Full Name</Label>
                  <Input id="signup-fullname" placeholder="Jane Doe" className="h-11" {...signUpForm.register('fullName')} />
                  {signUpForm.formState.errors.fullName && <p className="text-sm text-destructive">{signUpForm.formState.errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" placeholder="you@example.com" type="email" className="h-11" {...signUpForm.register('email')} />
                  {signUpForm.formState.errors.email && <p className="text-sm text-destructive">{signUpForm.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" placeholder="••••••••" type="password" className="h-11" {...signUpForm.register('password')} />
                  {signUpForm.formState.errors.password && <p className="text-sm text-destructive">{signUpForm.formState.errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input id="signup-confirm" placeholder="••••••••" type="password" className="h-11" {...signUpForm.register('confirmPassword')} />
                  {signUpForm.formState.errors.confirmPassword && <p className="text-sm text-destructive">{signUpForm.formState.errors.confirmPassword.message}</p>}
                </div>
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : 'Create Account'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm">
              {mode === 'signin' ? (
                <p className="text-muted-foreground">
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-primary font-medium hover:underline">Sign up</button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <button onClick={() => setMode('signin')} className="text-primary font-medium hover:underline">Sign in</button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

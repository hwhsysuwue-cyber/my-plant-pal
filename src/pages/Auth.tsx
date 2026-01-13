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
import { Leaf, Loader2, ArrowLeft, Sparkles, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pattern-dots opacity-40" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl translate-y-1/2 -translate-x-1/4" />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <Card className="shadow-hero border-border/40 rounded-3xl overflow-hidden">
          {/* Decorative top border */}
          <div className="h-1 gradient-forest" />
          
          <CardHeader className="text-center pt-10 pb-6">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-2xl gradient-forest flex items-center justify-center shadow-colored animate-float">
                <Leaf className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="font-display text-3xl">
              {mode === 'signin' ? 'Welcome Back' : 'Join PlantCare'}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {mode === 'signin' ? 'Sign in to continue your plant journey' : 'Create your account and start growing'}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            {mode === 'signin' ? (
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="signin-email" 
                    placeholder="you@example.com" 
                    type="email" 
                    className="h-12 rounded-xl border-border/50 focus:border-primary/30 focus:ring-2 focus:ring-primary/15 transition-all" 
                    {...signInForm.register('email')} 
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-sm text-destructive animate-fade-in">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input 
                      id="signin-password" 
                      placeholder="••••••••" 
                      type={showPassword ? 'text' : 'password'} 
                      className="h-12 rounded-xl border-border/50 focus:border-primary/30 focus:ring-2 focus:ring-primary/15 transition-all pr-12" 
                      {...signInForm.register('password')} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-sm text-destructive animate-fade-in">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-colored hover:shadow-glow transition-all duration-300" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname" className="text-sm font-medium">Full Name</Label>
                  <Input 
                    id="signup-fullname" 
                    placeholder="Jane Doe" 
                    className="h-12 rounded-xl border-border/50 focus:border-primary/30 focus:ring-2 focus:ring-primary/15 transition-all" 
                    {...signUpForm.register('fullName')} 
                  />
                  {signUpForm.formState.errors.fullName && (
                    <p className="text-sm text-destructive animate-fade-in">{signUpForm.formState.errors.fullName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="signup-email" 
                    placeholder="you@example.com" 
                    type="email" 
                    className="h-12 rounded-xl border-border/50 focus:border-primary/30 focus:ring-2 focus:ring-primary/15 transition-all" 
                    {...signUpForm.register('email')} 
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-sm text-destructive animate-fade-in">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input 
                      id="signup-password" 
                      placeholder="••••••••" 
                      type={showPassword ? 'text' : 'password'} 
                      className="h-12 rounded-xl border-border/50 focus:border-primary/30 focus:ring-2 focus:ring-primary/15 transition-all pr-12" 
                      {...signUpForm.register('password')} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.password && (
                    <p className="text-sm text-destructive animate-fade-in">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm" className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Input 
                      id="signup-confirm" 
                      placeholder="••••••••" 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      className="h-12 rounded-xl border-border/50 focus:border-primary/30 focus:ring-2 focus:ring-primary/15 transition-all pr-12" 
                      {...signUpForm.register('confirmPassword')} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive animate-fade-in">{signUpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-colored hover:shadow-glow transition-all duration-300" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-border/40 text-center">
              {mode === 'signin' ? (
                <p className="text-muted-foreground">
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-primary font-medium hover:underline transition-colors">
                    Sign up for free
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Already have an account?{' '}
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
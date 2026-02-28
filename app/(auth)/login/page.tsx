'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BackgroundBeams } from '@/components/aceternity/background-beams';
import { SpotlightCard } from '@/components/aceternity/spotlight';
import { toast } from 'sonner';
import { Loader2, ArrowRight, Layers } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(username, password);
      if (response.success) {
        toast.success('Welcome back!', { description: 'Logged in successfully.' });
        router.replace('/dashboard');
      } else {
        toast.error('Login failed', {
          description: response.message || 'Invalid username or password.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden p-4">
      <BackgroundBeams />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 border border-primary/20">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
          </div>
        </div>

        <SpotlightCard className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username or Email
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                className="h-10 bg-background/50"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-10 bg-background/50"
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full h-10 gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </SpotlightCard>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>

        {/* Demo credentials hint */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Demo: <span className="font-mono font-medium">admin</span> /{' '}
            <span className="font-mono font-medium">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}

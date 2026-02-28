'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BackgroundBeams } from '@/components/aceternity/background-beams';
import { SpotlightCard } from '@/components/aceternity/spotlight';
import { toast } from 'sonner';
import { Loader2, ArrowRight, Layers } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate registration
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Account created!', {
      description: 'You can now sign in with your credentials.',
    });
    setIsLoading(false);
    router.push('/login');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden p-4">
      <BackgroundBeams />

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 border border-primary/20">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign up to get started</p>
          </div>
        </div>

        <SpotlightCard className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="h-10 bg-background/50"
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-10 bg-background/50"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-10 bg-background/50"
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" className="w-full h-10 gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </SpotlightCard>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

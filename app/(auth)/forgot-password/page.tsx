'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BackgroundBeams } from '@/components/aceternity/background-beams';
import { SpotlightCard } from '@/components/aceternity/spotlight';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Layers } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Reset link sent!', {
      description: 'If the email exists, you will receive a password reset link.',
    });
    setIsLoading(false);
    setSent(true);
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
            <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your email to receive a reset link
            </p>
          </div>
        </div>

        <SpotlightCard className="p-6">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <span className="text-green-500 text-xl">✓</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Check your inbox for the password reset link.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Back to sign in</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-10 bg-background/50"
                />
              </div>

              <Button type="submit" className="w-full h-10" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>
            </form>
          )}
        </SpotlightCard>

        {!sent && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            <Link href="/login" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
              <ArrowLeft className="h-3 w-3" />
              Back to sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

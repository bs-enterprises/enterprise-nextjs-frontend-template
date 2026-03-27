'use client';

import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface AccessDeniedProps {
  message?: string;
}

/**
 * Full-page "Access Denied" screen shown when a user navigates to a route
 * they don't have the required role for.
 */
export function AccessDenied({ message }: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <ShieldX className="h-8 w-8 text-destructive" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight">Access Denied</h2>
        <p className="text-sm text-muted-foreground">
          {message ??
            "You don't have the required permissions to view this page. Contact your administrator to request access."}
        </p>
      </div>

      <Button variant="outline" size="sm" onClick={() => router.back()}>
        Go Back
      </Button>
    </div>
  );
}

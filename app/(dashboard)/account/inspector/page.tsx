'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import StorageKeys from '@/constants/storage-constants';
import { RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function SessionInspectorPage() {
  const { user, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);

  const storageData: Record<string, string | null> = {};
  if (typeof window !== 'undefined') {
    Object.values(StorageKeys).forEach((key) => {
      try {
        storageData[key] = localStorage.getItem(key);
      } catch {
        storageData[key] = null;
      }
    });
  }

  const sessionData = {
    user,
    isAuthenticated,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
    url: typeof window !== 'undefined' ? window.location.href : 'N/A',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(sessionData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Session Inspector</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Debug your current session and authentication state
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Copied!</>
            ) : (
              <><Copy className="h-4 w-4 mr-2" /> Copy JSON</>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Auth State */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Authentication State</CardTitle>
            <Badge
              variant="outline"
              className={
                isAuthenticated
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
              }
            >
              {isAuthenticated ? 'Authenticated' : 'Unauthenticated'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { label: 'Status', value: isAuthenticated ? 'Authenticated' : 'Unauthenticated' },
              { label: 'User ID', value: user?.id ?? 'N/A' },
              { label: 'Name', value: user?.name ?? 'N/A' },
              { label: 'Email', value: user?.email ?? 'N/A' },
              { label: 'Role', value: user?.role ?? 'N/A' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5 p-3 rounded-lg bg-muted/40">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {item.label}
                </span>
                <span className="text-sm font-medium break-all">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Object */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">User Object</CardTitle>
          <CardDescription>Raw data from the auth context</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted/40 rounded-lg p-4 overflow-x-auto font-mono leading-relaxed">
            {JSON.stringify(user, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* LocalStorage */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">LocalStorage</CardTitle>
          <CardDescription>App storage keys and their current values</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(StorageKeys).map(([name, key]) => {
              const value = storageData[key];
              return (
                <div key={key} className="rounded-lg bg-muted/40 p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {name}
                    </span>
                    <code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {key}
                    </code>
                  </div>
                  <p className="text-xs font-mono break-all">
                    {value !== null ? value : (
                      <span className="text-muted-foreground italic">null</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Environment */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { label: 'NODE_ENV', value: process.env.NODE_ENV ?? 'N/A' },
              { label: 'Timestamp', value: new Date().toISOString() },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
                <code className="text-xs text-muted-foreground font-mono w-28 shrink-0">{item.label}</code>
                <span className="text-xs font-mono break-all">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

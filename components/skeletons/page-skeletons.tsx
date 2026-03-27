import { Skeleton } from '@/components/ui/skeleton';

// ─── TABLE PAGE SKELETON ─────────────────────────────────────────────────────
// Used by: service-requests, manage/*, fbar/*, documents/*, user-management/*,
//          orders, items, reports, team, tasks
export function TablePageSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="p-6 space-y-5">
      {/* Page heading */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Toolbar row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Skeleton className="h-9 w-64 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-3 bg-muted/30 border-b border-border/50">
          <Skeleton className="h-4 w-4 rounded" />
          {[120, 80, 100, 90, 70, 90].map((w, i) => (
            <Skeleton key={i} className="h-4 rounded" style={{ width: w }} />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3.5 border-b border-border/40 last:border-0"
            style={{ opacity: 1 - i * 0.08 }}
          >
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <Skeleton className="h-4 rounded" style={{ width: 120 + (i % 3) * 20 }} />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-4 w-16 rounded ml-auto" />
            <Skeleton className="h-4 w-4 rounded ml-2" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40 rounded" />
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── METRICS / CARDS PAGE SKELETON ──────────────────────────────────────────
// Used by: analytics, projects, referrals, integrations, calendar, orders
export function MetricsPageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Heading */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Tabs strip */}
      <div className="flex items-center gap-1 border-b border-border/50 pb-0">
        {[80, 90, 80, 70].map((w, i) => (
          <Skeleton key={i} className="h-9 rounded-t-md" style={{ width: w }} />
        ))}
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card p-5 space-y-3"
            style={{ opacity: 1 - i * 0.06 }}
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Chart-like block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
          <div className="flex items-end gap-2 h-40">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-t-sm"
                style={{ height: `${30 + Math.abs(Math.sin(i) * 70)}%` }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
          <Skeleton className="h-5 w-28" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FORM / SETTINGS PAGE SKELETON ──────────────────────────────────────────
// Used by: settings and similar form-driven pages
export function FormPageSkeleton() {
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Heading */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border/50">
        {[100, 110, 90, 100, 110].map((w, i) => (
          <Skeleton key={i} className="h-9 rounded-t-md" style={{ width: w }} />
        ))}
      </div>

      {/* Card with form fields */}
      <div className="rounded-xl border border-border/50 bg-card p-6 space-y-5">
        <div className="space-y-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Second card */}
      <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-36" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <div className="space-y-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>
            <Skeleton className="h-6 w-10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHAT / INBOX SKELETON ───────────────────────────────────────────────────
// Used by: inbox, messages
export function ChatSkeleton() {
  return (
    <div className="p-6 h-full space-y-4">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <div className="flex gap-4 h-[calc(100vh-14rem)] border border-border/50 rounded-xl overflow-hidden">
        {/* Left: conversation list */}
        <div className="w-80 shrink-0 border-r border-border/40 flex flex-col">
          <div className="p-3 border-b border-border/40">
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ opacity: 1 - i * 0.1 }}
              >
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: active thread */}
        <div className="flex-1 flex flex-col">
          {/* Thread header */}
          <div className="flex items-center gap-3 p-4 border-b border-border/40">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 space-y-5">
            {[false, true, false, false, true].map((self, i) => (
              <div
                key={i}
                className={`flex gap-3 ${self ? 'flex-row-reverse' : ''}`}
                style={{ opacity: 1 - i * 0.1 }}
              >
                {!self && <Skeleton className="h-8 w-8 rounded-full shrink-0" />}
                <div className={`space-y-1 max-w-xs ${self ? 'items-end flex flex-col' : ''}`}>
                  <Skeleton className="h-14 w-64 rounded-xl" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/40">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONTENT / GENERIC PAGE SKELETON ────────────────────────────────────────
// Used by: support, integrations, referrals, calendar, roles
export function ContentPageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Heading */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 pt-1">
        {[90, 110, 80].map((w, i) => (
          <Skeleton key={i} className="h-9 rounded-md" style={{ width: w }} />
        ))}
      </div>

      {/* Two-column grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card p-5 space-y-3"
            style={{ opacity: 1 - i * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TEAM / PROFILE CARDS SKELETON ───────────────────────────────────────────
// Used by: team
export function TeamPageSkeleton() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-64 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card p-5 flex flex-col items-center gap-3 text-center"
            style={{ opacity: 1 - i * 0.08 }}
          >
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-1.5 w-full">
              <Skeleton className="h-4 w-28 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <div className="flex gap-2 w-full">
              <Skeleton className="h-8 flex-1 rounded-md" />
              <Skeleton className="h-8 flex-1 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

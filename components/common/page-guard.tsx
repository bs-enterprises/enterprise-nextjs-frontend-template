'use client';

import { AccessDenied } from './access-denied';

interface PageGuardProps {
  /**
   * Permission check — call a function from lib/permissions (e.g. MenuPermissions.canViewClients).
   * Return true to allow access; false to show AccessDenied.
   */
  check: () => boolean;
  /** Override the default "access denied" message shown to the user. */
  message?: string;
  children: React.ReactNode;
}

/**
 * Client-side RBAC gate for individual pages.
 *
 * Usage:
 *   <PageGuard check={MenuPermissions.canViewClients}>
 *     <ClientsPageContent />
 *   </PageGuard>
 *
 * Because the dashboard layout already withholds rendering until the browser
 * has hydrated (mounted + authenticated), calling hasRole() here is always
 * safe — localStorage is available by the time this renders.
 */
export function PageGuard({ check, message, children }: PageGuardProps) {
  if (!check()) {
    return <AccessDenied message={message} />;
  }
  return <>{children}</>;
}

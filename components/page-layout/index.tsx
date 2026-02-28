'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PageLayoutProps {
  /** Toolbar rendered above main content */
  toolbar?: ReactNode;
  /** Page content */
  children: ReactNode;
  /** Extra classes on the content wrapper */
  contentClassName?: string;
  /** Show scroll-to-top button (default: true) */
  showScrollTop?: boolean;
  /** Scroll offset to show button (default: 400) */
  scrollTopThreshold?: number;
  /** Pass an empty state node */
  emptyState?: ReactNode;
  /** Render emptyState instead of children */
  showEmptyState?: boolean;
  /** Callback when scroll-to-top is clicked */
  onScrollTop?: () => void;
  /** Bottom padding for fixed pagination / action bars */
  bottomPadding?: string;
}

/**
 * PageLayout — thin wrapper that provides:
 *  - optional sticky toolbar row
 *  - scrollable content area
 *  - scroll-to-top FAB
 *  - empty state shortcut
 *
 * @example
 * <PageLayout
 *   toolbar={<GenericToolbar ... />}
 *   emptyState={<EmptyState title="No items" />}
 *   showEmptyState={items.length === 0}
 * >
 *   <DataGrid ... />
 * </PageLayout>
 */
export function PageLayout({
  toolbar,
  children,
  contentClassName,
  showScrollTop = true,
  scrollTopThreshold = 400,
  emptyState,
  showEmptyState = false,
  onScrollTop,
  bottomPadding = 'pb-24',
}: PageLayoutProps) {
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    if (!showScrollTop) return;
    const onScroll = () => setShowBtn(window.scrollY > scrollTopThreshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showScrollTop, scrollTopThreshold]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onScrollTop?.();
  };

  if (showEmptyState && emptyState) {
    return (
      <div className="flex flex-col">
        {toolbar && (
          <div className="bg-background pb-4 border-b border-border/50">{toolbar}</div>
        )}
        <div className="flex-1 flex items-center justify-center min-h-60">{emptyState}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {toolbar && (
        <div className="bg-background pb-4 border-b border-border/50">{toolbar}</div>
      )}

      <div className={cn('mt-4', bottomPadding, contentClassName)}>
        {children}
      </div>

      {showScrollTop && showBtn && (
        <Button
          size="icon"
          onClick={handleScrollTop}
          className="fixed bottom-24 right-6 z-50 rounded-full shadow-lg h-10 w-10"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

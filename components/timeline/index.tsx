'use client';

import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimelineProps } from './types';
import { CompactPagination } from '@/components/common/pagination';

export type { TimelineItem, TimelineTypeConfig, TimelineProps } from './types';

/**
 * Timeline — generic chronological feed component.
 *
 * Supply `typeConfigs` to map event types to custom card renderers and icon/color schemes.
 *
 * @example
 * const configs = [
 *   {
 *     type: 'commit',
 *     renderer: (item) => <CommitCard {...item.data} />,
 *     icon: { component: GitCommit },
 *     color: { dot: 'bg-blue-500/10', iconColor: 'text-blue-600' },
 *   },
 * ];
 * <Timeline items={events} typeConfigs={configs} autoSort showPagination />
 */
export function Timeline<T = unknown>({
  items,
  typeConfigs,
  showPagination = false,
  pageIndex = 0,
  pageSize = 10,
  totalPages = 1,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  emptyMessage = 'No activity recorded yet.',
  emptyIcon: EmptyIcon = Calendar,
  emptyState,
  isLoading = false,
  loadingState,
  className,
  autoSort = true,
  sortOrder = 'desc',
}: TimelineProps<T>) {
  const sorted = useMemo(() => {
    if (!autoSort) return items;
    return [...items].sort((a, b) => {
      const delta = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? -delta : delta;
    });
  }, [items, autoSort, sortOrder]);

  if (isLoading) {
    if (loadingState) return <>{loadingState}</>;
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sorted.length === 0) {
    if (emptyState) return <>{emptyState}</>;
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <EmptyIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-0', className)}>
      <div className="space-y-4">
        {sorted.map((item, idx) => {
          const isLast = idx === sorted.length - 1;
          const config = typeConfigs.find((c) => c.type === item.type);
          if (!config) return null;

          const Icon = config.icon?.component;
          const dotColor = config.color?.dot ?? 'bg-primary/10';
          const iconColor = config.color?.iconColor ?? 'text-primary';

          return (
            <div key={item.id} className="relative flex gap-4">
              {/* Connector line */}
              {!isLast && (
                <div className="absolute left-[15px] top-10 bottom-[-16px] w-px bg-border/60" />
              )}

              {/* Dot / Icon */}
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 mt-1',
                  dotColor
                )}
              >
                {Icon && <Icon className={cn('h-4 w-4', iconColor)} />}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">{config.renderer(item, isLast)}</div>
            </div>
          );
        })}
      </div>

      {showPagination && onPageChange && onPageSizeChange && (
        <CompactPagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalPages={totalPages}
          canNextPage={pageIndex < totalPages - 1}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          totalItems={totalItems}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}

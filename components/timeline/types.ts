import { ReactNode } from 'react';

/** A single item rendered in the timeline. */
export interface TimelineItem<T = unknown> {
  id: string;
  /** Determines which `TimelineTypeConfig` to use. */
  type: string;
  /** Used for auto-sort. */
  timestamp: Date;
  data: T;
}

/** Renders the card for a specific item type. */
export type TimelineItemRenderer<T = unknown> = (
  item: TimelineItem<T>,
  isLast: boolean
) => ReactNode;

/** Per-type display config including renderer, icon & colors. */
export interface TimelineTypeConfig<T = unknown> {
  type: string;
  renderer: TimelineItemRenderer<T>;
  icon?: {
    component: React.ComponentType<{ className?: string }>;
  };
  color?: {
    /** Tailwind bg class for the dot */
    dot: string;
    /** Tailwind text class for the icon */
    iconColor: string;
  };
}

export interface TimelineProps<T = unknown> {
  items: TimelineItem<T>[];
  typeConfigs: TimelineTypeConfig<T>[];
  showPagination?: boolean;
  pageIndex?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  emptyMessage?: string;
  emptyIcon?: React.ComponentType<{ className?: string }>;
  emptyState?: ReactNode;
  isLoading?: boolean;
  loadingState?: ReactNode;
  className?: string;
  autoSort?: boolean;
  sortOrder?: 'asc' | 'desc';
}

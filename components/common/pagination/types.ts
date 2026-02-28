export type PaginationVariant = 'default' | 'compact' | 'simple' | 'numbered' | 'infinite';

export interface PaginationProps {
  /** Current page index (0-based) */
  pageIndex: number;
  /** Items per page */
  pageSize: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether next page is available */
  canNextPage: boolean;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange: (size: number) => void;
  /** Total item count */
  totalItems?: number;
  /** Available page-size options */
  pageSizeOptions?: number[];
  /** Additional CSS classes */
  className?: string;
  /** Disable all controls */
  disabled?: boolean;
  /** For infinite variant: loading state */
  loading?: boolean;
  /** For infinite variant: custom button text */
  loadMoreText?: string;
}

export interface PaginationVariantProps extends PaginationProps {
  variant?: PaginationVariant;
}

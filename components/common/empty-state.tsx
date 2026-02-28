import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  /** Icon to display */
  icon?: ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action button or component */
  action?: ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * EmptyState — reusable empty / zero-data display with optional icon, description
 * and an action slot.
 *
 * @example
 * <EmptyState
 *   icon={<Inbox className="h-12 w-12 text-muted-foreground" />}
 *   title="No results found"
 *   description="Try changing your search or filters."
 *   action={<Button onClick={clearFilters}>Clear Filters</Button>}
 * />
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[200px] py-12 px-6 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-muted-foreground/60">{icon}</div>
      )}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

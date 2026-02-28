'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useLayoutContext } from '@/contexts/layout-context';
import { cn } from '@/lib/utils';

export interface FormActionBarProps {
  /** 'create' or 'edit' mode — controls default button labels */
  mode?: 'create' | 'edit';
  /** Whether the form is submitting */
  isSubmitting?: boolean;
  /** Cancel callback */
  onCancel: () => void;
  /** Override the submit button label */
  submitText?: string;
  /** Override the cancel button label */
  cancelText?: string;
  /** Show "* Required fields" hint */
  showRequiredIndicator?: boolean;
  /** Extra content on the left side */
  leftContent?: ReactNode;
  /** Extra content on the right side before action buttons */
  rightContent?: ReactNode;
  className?: string;
}

/**
 * FormActionBar — sticky bottom action bar for forms.
 *
 * Automatically offsets itself to respect the sidebar width so it never covers
 * the sidebar on desktop.
 */
export function FormActionBar({
  mode = 'create',
  isSubmitting = false,
  onCancel,
  submitText,
  cancelText = 'Cancel',
  showRequiredIndicator = true,
  leftContent,
  rightContent,
  className,
}: FormActionBarProps) {
  const { sidebarCollapsed } = useLayoutContext();

  const defaultSubmitText = mode === 'edit'
    ? isSubmitting ? 'Updating…' : 'Update'
    : isSubmitting ? 'Creating…' : 'Create';

  const label = submitText ?? defaultSubmitText;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-background/95 backdrop-blur border-t shadow-lg',
        'transition-[padding-left] duration-200 ease-out',
        'lg:pl-16',
        !sidebarCollapsed && 'lg:pl-64',
        className
      )}
    >
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          {showRequiredIndicator && (
            <p className="text-xs text-muted-foreground hidden sm:block">
              <span className="text-destructive">*</span> Required fields
            </p>
          )}
          {leftContent}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {rightContent}
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
            {cancelText}
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {label}
          </Button>
        </div>
      </div>
    </div>
  );
}

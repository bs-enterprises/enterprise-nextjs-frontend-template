'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function LoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Simulate a short loading animation on route change
    setLoading(true);
    setWidth(0);

    const t1 = setTimeout(() => setWidth(70), 50);
    const t2 = setTimeout(() => setWidth(95), 200);
    const t3 = setTimeout(() => {
      setWidth(100);
    }, 350);
    const t4 = setTimeout(() => {
      setLoading(false);
      setWidth(0);
    }, 550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5">
      <div
        className={cn(
          'h-full bg-primary transition-all duration-300 ease-out',
          width === 100 && 'opacity-0 transition-opacity duration-200 delay-100'
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

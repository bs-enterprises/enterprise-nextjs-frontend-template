'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppShell } from '@/components/app-shell';
import { LoadingBar } from '@/components/loading-bar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings, Code, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { getAllMenuItems, menuCategories } from '@/config/menu-config';
import {
  getOrderedPinnedMenuIds,
  addPinnedMenu,
  removePinnedMenu,
} from '@/store/menu-preferences';
import { useLayoutContext } from '@/contexts/layout-context';

function DashboardHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { activePage } = useLayoutContext();

  const allMenuItems = getAllMenuItems();

  const getPageTitle = () => {
    if (activePage) return activePage;
    const current = allMenuItems.find(
      (item) => pathname === item.href || pathname.startsWith(item.href + '/')
    );
    if (current) return current.label;
    if (pathname.startsWith('/account')) return 'Account';
    return 'Dashboard';
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold truncate">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="space-y-1">
                <div className="font-medium truncate">{user?.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                <Badge variant="outline" className="text-xs mt-1">
                  {user?.role}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account/profile" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/inspector" className="flex items-center cursor-pointer">
                <Code className="mr-2 h-4 w-4" />
                Session Inspector
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [pinnedMenuIds, setPinnedMenuIds] = useState<string[]>(() => getOrderedPinnedMenuIds());

  const allMenuItems = getAllMenuItems();

  const handleTogglePin = (menuId: string, isPinned: boolean) => {
    if (isPinned) {
      removePinnedMenu(menuId);
      setPinnedMenuIds((prev) => prev.filter((id) => id !== menuId));
    } else {
      addPinnedMenu(menuId);
      setPinnedMenuIds((prev) => [...prev, menuId]);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AppShell
      allMenuItems={allMenuItems}
      pinnedMenuIds={pinnedMenuIds}
      onTogglePin={handleTogglePin}
      menuCategories={menuCategories}
      logo={<User className="h-6 w-6 text-primary" />}
      brandName="Enterprise"
      brandSubtitle="Project Template"
      headerContent={<DashboardHeader />}
      loadingBar={<LoadingBar />}
    >
      {children}
    </AppShell>
  );
}

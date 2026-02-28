'use client';

import { useState, useMemo, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  Grid3x3,
  Pin,
  PinOff,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLayoutContext } from '@/contexts/layout-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { MenuItem, MenuCategory } from '@/config/menu-config';

// ==================== TYPES ====================

export interface AppShellProps {
  allMenuItems?: MenuItem[];
  pinnedMenuIds?: string[];
  onTogglePin?: (menuId: string, isPinned: boolean) => void;
  menuCategories?: MenuCategory[];
  headerContent?: ReactNode;
  logo?: ReactNode;
  brandName?: string;
  brandSubtitle?: string;
  children: ReactNode;
  loadingBar?: ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  contentClassName?: string;
  enableTransitions?: boolean;
  showCollapseButton?: boolean;
  useMenuPicker?: boolean;
}

// ==================== MAIN COMPONENT ====================

export function AppShell({
  allMenuItems = [],
  pinnedMenuIds = [],
  onTogglePin,
  menuCategories = [],
  headerContent,
  logo,
  brandName = 'App',
  brandSubtitle,
  children,
  loadingBar,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  contentClassName,
  enableTransitions = true,
  showCollapseButton = true,
  useMenuPicker = true,
}: AppShellProps) {
  const pathname = usePathname();
  const [menuPickerOpen, setMenuPickerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('app-shell-sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const collapsed = controlledCollapsed ?? internalCollapsed;
  const { setSidebarCollapsed } = useLayoutContext();

  const setCollapsed = (value: boolean) => {
    setSidebarCollapsed(value);
    if (onCollapsedChange) {
      onCollapsedChange(value);
    } else {
      setInternalCollapsed(value);
      localStorage.setItem('app-shell-sidebar-collapsed', JSON.stringify(value));
    }
  };

  const sharedSidebarProps = {
    allMenuItems,
    pinnedMenuIds,
    logo,
    brandName,
    brandSubtitle,
    onToggleSidebar: () => setCollapsed(!collapsed),
    onCloseMobileMenu: () => setMobileMenuOpen(false),
    onOpenMenuPicker: () => setMenuPickerOpen(true),
    useMenuPicker,
    pathname,
  };

  return (
    <div className="relative min-h-screen bg-background">
      {loadingBar}

      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden lg:flex fixed left-0 top-0 z-50 h-screen flex-col',
          'border-r border-border/50 bg-card/95 backdrop-blur-md',
          'transition-[width] duration-200 ease-out',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <AppShellSidebarContent
          {...sharedSidebarProps}
          collapsed={collapsed}
          showCollapseButton={showCollapseButton}
        />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
              className="fixed left-0 top-0 z-50 w-64 h-screen flex flex-col border-r border-border/50 bg-card/95 backdrop-blur-md lg:hidden"
            >
              <AppShellSidebarContent
                {...sharedSidebarProps}
                collapsed={false}
                showCollapseButton={false}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div
        className={cn(
          'min-h-screen transition-[margin] duration-200 ease-out',
          'lg:ml-16',
          !collapsed && 'lg:ml-64'
        )}
      >
        <AppShellHeader
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          collapsed={collapsed}
          headerContent={headerContent}
        />

        <main
          className={cn(
            'min-h-screen pt-[5rem] px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8',
            contentClassName
          )}
        >
          {enableTransitions ? (
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* Menu Picker */}
      {useMenuPicker && (
        <MenuPickerSheet
          open={menuPickerOpen}
          onOpenChange={setMenuPickerOpen}
          allMenuItems={allMenuItems}
          pinnedMenuIds={pinnedMenuIds}
          onTogglePin={onTogglePin ?? (() => {})}
          categories={menuCategories}
          pathname={pathname}
        />
      )}
    </div>
  );
}

// ==================== NAV ITEM ====================

function isItemActive(item: MenuItem, pathname: string): boolean {
  if (item.isActive) return item.isActive(pathname);
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + '/');
}

function isAnyChildActive(item: MenuItem, pathname: string): boolean {
  return (item.children ?? []).some((child) => isItemActive(child, pathname));
}

interface NavItemProps {
  item: MenuItem;
  collapsed: boolean;
  pathname: string;
  onClose: () => void;
  /** depth > 0 = sub-item, renders indented */
  depth?: number;
}

function NavItem({ item, collapsed, pathname, onClose, depth = 0 }: NavItemProps) {
  const hasChildren = (item.children?.length ?? 0) > 0;
  const childActive = hasChildren && isAnyChildActive(item, pathname);
  const [open, setOpen] = useState(() => item.defaultOpen ?? childActive);
  const active = isItemActive(item, pathname);

  // If a child becomes active later (e.g. browser navigation), auto-open
  // We use a simple effect: when childActive flips to true and we're not open, open.
  if (childActive && !open && !collapsed) {
    setOpen(true);
  }

  if (hasChildren) {
    return (
      <div>
        {/* Group header button */}
        <button
          onClick={() => !collapsed && setOpen((o) => !o)}
          title={collapsed ? item.label : undefined}
          className={cn(
            'flex items-center gap-3 h-10 px-3 rounded-md text-sm w-full',
            'transition-colors duration-150',
            (childActive || active)
              ? 'text-foreground font-medium'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            collapsed && 'justify-center'
          )}
        >
          <item.icon className={cn('shrink-0', collapsed ? 'h-5 w-5' : 'h-[18px] w-[18px]')} />
          {!collapsed && (
            <>
              <span className="truncate flex-1 text-left">{item.label}</span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200',
                  open && 'rotate-180'
                )}
              />
            </>
          )}
        </button>

        {/* Children */}
        {!collapsed && open && (
          <div className="ml-3 pl-3 border-l border-border/40 space-y-0.5 mt-0.5 mb-1">
            {item.children!.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                collapsed={false}
                pathname={pathname}
                onClose={onClose}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Leaf item
  return (
    <Link
      href={item.href}
      onClick={onClose}
      title={collapsed ? item.label : undefined}
      className={cn(
        'flex items-center gap-3 h-9 px-3 rounded-md text-sm',
        'transition-colors duration-150',
        active
          ? depth > 0
            ? 'bg-primary/10 text-primary font-medium'
            : 'bg-primary text-primary-foreground font-medium shadow-sm'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        collapsed && 'justify-center',
        depth > 0 && 'text-[13px]'
      )}
    >
      <item.icon className={cn('shrink-0', collapsed ? 'h-5 w-5' : 'h-[15px] w-[15px]')} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

// ==================== SIDEBAR CONTENT ====================

interface SidebarContentProps {
  allMenuItems: MenuItem[];
  pinnedMenuIds: string[];
  collapsed: boolean;
  logo?: ReactNode;
  brandName: string;
  brandSubtitle?: string;
  onToggleSidebar: () => void;
  onCloseMobileMenu: () => void;
  onOpenMenuPicker: () => void;
  showCollapseButton: boolean;
  useMenuPicker: boolean;
  pathname: string;
}

function AppShellSidebarContent({
  allMenuItems,
  pinnedMenuIds,
  collapsed,
  logo,
  brandName,
  brandSubtitle,
  onToggleSidebar,
  onCloseMobileMenu,
  onOpenMenuPicker,
  showCollapseButton,
  useMenuPicker,
  pathname,
}: SidebarContentProps) {
  const displayItems = useMemo(() => {
    const sorted = [...allMenuItems].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    if (!useMenuPicker) return sorted;
    if (pinnedMenuIds.length > 0) {
      return allMenuItems
        .filter((item) => pinnedMenuIds.includes(item.id))
        .sort((a, b) => pinnedMenuIds.indexOf(a.id) - pinnedMenuIds.indexOf(b.id));
    }
    return sorted;
  }, [allMenuItems, pinnedMenuIds, useMenuPicker]);

  return (
    <div className="flex h-full flex-col w-full">
      {/* Sidebar Header */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border/50 px-3">
        {useMenuPicker && !collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMenuPicker}
            className="shrink-0 h-8 w-8"
            title="All menus"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        )}

        {logo && (
          <div className={cn('shrink-0', collapsed && 'mx-auto')}>{logo}</div>
        )}

        {!collapsed && (
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold truncate leading-tight">{brandName}</span>
            {brandSubtitle && (
              <span className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                {brandSubtitle}
              </span>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onCloseMobileMenu}
          className="lg:hidden shrink-0 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-0.5">
          {displayItems.map((item) => {
            if (item.permission && !item.permission()) return null;
            return (
              <NavItem
                key={item.id}
                item={item}
                collapsed={collapsed}
                pathname={pathname}
                onClose={onCloseMobileMenu}
              />
            );
          })}
        </div>
      </nav>

      {/* Collapse button */}
      {showCollapseButton && (
        <div className="p-3 shrink-0 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="w-full justify-center gap-2 h-9 text-muted-foreground hover:text-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-xs font-medium">Collapse</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// ==================== HEADER ====================

interface AppShellHeaderProps {
  onMobileMenuToggle: () => void;
  collapsed: boolean;
  headerContent?: ReactNode;
}

function AppShellHeader({ onMobileMenuToggle, collapsed, headerContent }: AppShellHeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 flex h-16 items-center gap-4',
        'border-b border-border/50 bg-card/80 backdrop-blur-md px-4 sm:px-6',
        'transition-[left] duration-200 ease-out',
        'left-0 lg:left-16',
        !collapsed && 'lg:left-64'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onMobileMenuToggle}
        className="lg:hidden shrink-0"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
        {headerContent}
      </div>
    </header>
  );
}

// ==================== MENU PICKER SHEET ====================

interface MenuPickerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allMenuItems: MenuItem[];
  pinnedMenuIds: string[];
  onTogglePin: (menuId: string, isPinned: boolean) => void;
  categories?: MenuCategory[];
  pathname: string;
}

function MenuPickerSheet({
  open,
  onOpenChange,
  allMenuItems,
  pinnedMenuIds,
  onTogglePin,
  categories = [],
  pathname,
}: MenuPickerSheetProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return allMenuItems;
    return allMenuItems.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [allMenuItems, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    filtered.forEach((item) => {
      const cat = item.category ?? 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [filtered]);

  const renderItem = (item: MenuItem) => {
    const isPinned = pinnedMenuIds.includes(item.id);
    const isCurrent = pathname === item.href || pathname.startsWith(item.href + '/');
    return (
      <div
        key={item.id}
        className="flex items-center gap-1 rounded-md hover:bg-accent group pr-1"
      >
        <Link
          href={item.href}
          onClick={() => onOpenChange(false)}
          className="flex items-center gap-3 flex-1 min-w-0 px-2 py-2"
        >
          <item.icon
            className={cn('h-4 w-4 shrink-0', isCurrent ? 'text-primary' : 'text-muted-foreground')}
          />
          <span
            className={cn('text-sm truncate', isCurrent ? 'text-primary font-medium' : 'text-foreground')}
          >
            {item.label}
          </span>
          {isPinned && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 ml-auto shrink-0">
              pinned
            </Badge>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onTogglePin(item.id, isPinned)}
          title={isPinned ? 'Unpin from sidebar' : 'Pin to sidebar'}
        >
          {isPinned ? (
            <PinOff className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <Pin className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0 flex flex-col gap-0">
        <SheetHeader className="p-4 border-b border-border/50 space-y-1">
          <SheetTitle className="text-base font-semibold">All Menus</SheetTitle>
          <SheetDescription className="text-xs">
            Pin menus to add them to your sidebar
          </SheetDescription>
        </SheetHeader>

        <div className="p-3 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search menus..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {categories
            .filter((cat) => grouped[cat.id]?.length > 0)
            .map((cat) => (
              <div key={cat.id} className="mb-5">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                  {cat.label}
                </p>
                <div className="space-y-0.5">{grouped[cat.id].map(renderItem)}</div>
              </div>
            ))}
          {grouped['other'] && (
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                Other
              </p>
              <div className="space-y-0.5">{grouped['other'].map(renderItem)}</div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

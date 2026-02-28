import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Package,
  FolderOpen,
  ListTodo,
  Calendar,
  MessageSquare,
  Users,
  ShoppingCart,
  Inbox,
  Settings,
  Layers,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  href: string;
  icon: LucideIcon;
  label: string;
  category?: string;
  order?: number;
  isActive?: (pathname: string) => boolean;
  exact?: boolean;
  permission?: () => boolean;
}

export interface MenuCategory {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export const getAllMenuItems = (): MenuItem[] => [
  // Overview
  {
    id: 'dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    category: 'overview',
    order: 1,
  },
  {
    id: 'analytics',
    href: '/analytics',
    icon: BarChart3,
    label: 'Analytics',
    category: 'overview',
    order: 2,
  },
  {
    id: 'reports',
    href: '/reports',
    icon: FileText,
    label: 'Reports',
    category: 'overview',
    order: 3,
  },
  // Content
  {
    id: 'items',
    href: '/items',
    icon: Package,
    label: 'Items',
    category: 'content',
    order: 4,
  },
  {
    id: 'projects',
    href: '/projects',
    icon: FolderOpen,
    label: 'Projects',
    category: 'content',
    order: 5,
  },
  {
    id: 'tasks',
    href: '/tasks',
    icon: ListTodo,
    label: 'Tasks',
    category: 'content',
    order: 6,
  },
  {
    id: 'calendar',
    href: '/calendar',
    icon: Calendar,
    label: 'Calendar',
    category: 'content',
    order: 7,
  },
  // Collaboration
  {
    id: 'messages',
    href: '/messages',
    icon: MessageSquare,
    label: 'Messages',
    category: 'collaboration',
    order: 8,
  },
  {
    id: 'team',
    href: '/team',
    icon: Users,
    label: 'Team',
    category: 'collaboration',
    order: 9,
  },
  // Commerce
  {
    id: 'orders',
    href: '/orders',
    icon: ShoppingCart,
    label: 'Orders',
    category: 'commerce',
    order: 10,
  },
  {
    id: 'inbox',
    href: '/inbox',
    icon: Inbox,
    label: 'Inbox',
    category: 'commerce',
    order: 11,
  },
  // System
  {
    id: 'settings',
    href: '/settings',
    icon: Settings,
    label: 'Settings',
    category: 'system',
    order: 12,
  },
  {
    id: 'integrations',
    href: '/integrations',
    icon: Layers,
    label: 'Integrations',
    category: 'system',
    order: 13,
  },
  {
    id: 'support',
    href: '/support',
    icon: HelpCircle,
    label: 'Support',
    category: 'system',
    order: 14,
  },
];

export const menuCategories: MenuCategory[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'content', label: 'Content Management' },
  { id: 'collaboration', label: 'Collaboration' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'system', label: 'System' },
];

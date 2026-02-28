'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GenericToolbar } from '@/components/generic-toolbar';
import { PageLayout } from '@/components/page-layout';
import { EmptyState } from '@/components/common/empty-state';
import { CompactPagination } from '@/components/common/pagination';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { ShoppingCart, DollarSign, TrendingUp, Clock, Pencil, Trash2, ShoppingBag, PackageSearch } from 'lucide-react';
import type { ActiveFilter, SortState } from '@/components/generic-toolbar/types';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
}

const ALL_ORDERS: Order[] = [
  { id: 'ORD-1047', customer: 'Acme Corp', email: 'orders@acme.com', date: 'Feb 28, 2026', items: 5, total: 320.00, status: 'Pending' },
  { id: 'ORD-1046', customer: 'Bright Ideas Inc', email: 'billing@brightideas.io', date: 'Feb 27, 2026', items: 2, total: 89.99, status: 'Shipped' },
  { id: 'ORD-1045', customer: 'Nova Systems', email: 'nova@nova.co', date: 'Feb 26, 2026', items: 8, total: 1240.00, status: 'Delivered' },
  { id: 'ORD-1044', customer: 'TechStream', email: 'finance@techstream.dev', date: 'Feb 25, 2026', items: 3, total: 450.50, status: 'Processing' },
  { id: 'ORD-1043', customer: 'Greenleaf Co', email: 'orders@greenleaf.com', date: 'Feb 24, 2026', items: 1, total: 59.99, status: 'Delivered' },
  { id: 'ORD-1042', customer: 'Pinnacle Ltd', email: 'admin@pinnacle.biz', date: 'Feb 23, 2026', items: 4, total: 220.00, status: 'Cancelled' },
  { id: 'ORD-1041', customer: 'Blue Horizon', email: 'ops@bluehorizon.net', date: 'Feb 22, 2026', items: 7, total: 870.25, status: 'Shipped' },
  { id: 'ORD-1040', customer: 'Sparkle Media', email: 'accounts@sparkle.tv', date: 'Feb 21, 2026', items: 2, total: 130.00, status: 'Delivered' },
  { id: 'ORD-1039', customer: 'Redstone Labs', email: 'finance@redstone.io', date: 'Feb 20, 2026', items: 6, total: 510.00, status: 'Processing' },
  { id: 'ORD-1038', customer: 'Cascade Group', email: 'cascade@example.com', date: 'Feb 19, 2026', items: 3, total: 199.99, status: 'Pending' },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  Processing: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  Shipped: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  Delivered: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  Cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

const FILTERS = [
  {
    id: 'status', label: 'Status', type: 'multi_select' as const,
    options: (['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((v) => ({ value: v, label: v })),
  },
];

const SORT_FIELDS = [
  { id: 'id', label: 'Order ID', type: 'text' as const },
  { id: 'total', label: 'Total', type: 'number' as const },
  { id: 'date', label: 'Date', type: 'date' as const },
];

const PAGE_SIZE = 7;

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [sort, setSort] = useState<SortState | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);

  let orders = ALL_ORDERS.filter((o) => {
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) &&
        !o.customer.toLowerCase().includes(search.toLowerCase())) return false;
    for (const f of filters) {
      if (f.filterId === 'status' && Array.isArray(f.value) && f.value.length > 0) {
        if (!f.value.includes(o.status)) return false;
      }
    }
    return true;
  });

  if (sort) {
    orders = [...orders].sort((a, b) => {
      const av = a[sort.field as keyof Order];
      const bv = b[sort.field as keyof Order];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sort.direction;
      return String(av).localeCompare(String(bv)) * sort.direction;
    });
  }

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paged = orders.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);
  const totalRevenue = ALL_ORDERS.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: 'Total Orders', value: ALL_ORDERS.length, icon: ShoppingCart },
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign },
    { label: 'Pending', value: ALL_ORDERS.filter((o) => o.status === 'Pending').length, icon: Clock },
    { label: 'Delivered', value: ALL_ORDERS.filter((o) => o.status === 'Delivered').length, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-sm text-muted-foreground mt-1">Track and manage all customer orders</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <s.icon className="h-8 w-8 text-primary shrink-0" />
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PageLayout
        toolbar={
          <GenericToolbar
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPageIndex(0); }}
            searchPlaceholder="Search by order ID or customer…"
            showFilters
            availableFilters={FILTERS}
            activeFilters={filters}
            onFiltersChange={(f) => { setFilters(f); setPageIndex(0); }}
            showSort
            sortableFields={SORT_FIELDS}
            currentSort={sort}
            onSortChange={setSort}
            showExport
            onExportAll={() => alert('Exporting all orders…')}
            onExportResults={() => alert('Exporting filtered orders…')}
          />
        }
        showEmptyState={paged.length === 0}
        emptyState={
          <EmptyState
            icon={<PackageSearch className="h-12 w-12 text-muted-foreground" />}
            title="No orders found"
            description="Try adjusting your search or filter criteria."
            action={<Button size="sm" onClick={() => { setSearch(''); setFilters([]); }}>Clear Filters</Button>}
          />
        }
        bottomPadding="pb-6"
      >
        <Card className="border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', ''].map((h) => (
                    <th key={h} className={`text-xs font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wide ${h ? 'text-left' : 'text-right'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {paged.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono font-medium">{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{order.date}</td>
                    <td className="px-4 py-3 text-sm">{order.items}</td>
                    <td className="px-4 py-3 text-sm font-semibold">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-destructive"
                            onClick={() => setCancelTarget(order)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CompactPagination
            pageIndex={pageIndex}
            pageSize={PAGE_SIZE}
            totalPages={totalPages}
            totalItems={orders.length}
            canNextPage={pageIndex < totalPages - 1}
            onPageChange={setPageIndex}
            onPageSizeChange={() => {}}
          />
        </Card>
      </PageLayout>

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(o) => !o && setCancelTarget(null)}
        variant="destructive"
        title="Cancel Order"
        description={`Cancel order "${cancelTarget?.id}" for ${cancelTarget?.customer}? This cannot be undone.`}
        confirmText="Cancel Order"
        onConfirm={() => { console.log('Cancelled', cancelTarget?.id); setCancelTarget(null); }}
      />
    </div>
  );
}

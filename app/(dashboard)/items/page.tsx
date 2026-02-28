'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GenericToolbar } from '@/components/generic-toolbar';
import { PageLayout } from '@/components/page-layout';
import { EmptyState } from '@/components/common/empty-state';
import { NumberedPagination } from '@/components/common/pagination';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { DocumentUploadModal } from '@/components/document-upload-modal';
import { Package, Trash2, Pencil, Upload, PackageX, TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';
import type { ActiveFilter, SortState } from '@/components/generic-toolbar/types';

type Status = 'Active' | 'Low Stock' | 'Out of Stock';

interface Item {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: Status;
}

const ALL_ITEMS: Item[] = [
  { id: 1, name: 'Wireless Keyboard Pro', sku: 'WKB-001', category: 'Electronics', price: 89.99, stock: 245, status: 'Active' },
  { id: 2, name: 'USB-C Hub 7-Port', sku: 'USB-042', category: 'Electronics', price: 45.00, stock: 12, status: 'Low Stock' },
  { id: 3, name: 'Monitor Stand Deluxe', sku: 'MST-003', category: 'Accessories', price: 34.99, stock: 0, status: 'Out of Stock' },
  { id: 4, name: 'Mechanical Mouse', sku: 'MCM-017', category: 'Electronics', price: 59.99, stock: 88, status: 'Active' },
  { id: 5, name: 'Laptop Backpack 17"', sku: 'LBP-005', category: 'Bags', price: 79.00, stock: 150, status: 'Active' },
  { id: 6, name: 'Desk Lamp LED', sku: 'DLP-011', category: 'Furniture', price: 44.99, stock: 7, status: 'Low Stock' },
  { id: 7, name: 'Cable Management Kit', sku: 'CMK-009', category: 'Accessories', price: 19.99, stock: 320, status: 'Active' },
  { id: 8, name: 'Webcam 4K Pro', sku: 'WCM-022', category: 'Electronics', price: 129.00, stock: 0, status: 'Out of Stock' },
  { id: 9, name: 'Ergonomic Chair Pad', sku: 'ECP-013', category: 'Furniture', price: 55.00, stock: 42, status: 'Active' },
  { id: 10, name: 'Portable SSD 2TB', sku: 'SSD-031', category: 'Storage', price: 189.99, stock: 23, status: 'Active' },
  { id: 11, name: 'Blue Light Glasses', sku: 'BLG-007', category: 'Accessories', price: 24.99, stock: 5, status: 'Low Stock' },
  { id: 12, name: 'Headphone Stand', sku: 'HPS-018', category: 'Accessories', price: 29.00, stock: 65, status: 'Active' },
];

const STATUS_STYLES: Record<Status, string> = {
  Active: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  'Low Stock': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  'Out of Stock': 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

const COLUMNS = [
  { id: 'name', label: 'Name' },
  { id: 'sku', label: 'SKU' },
  { id: 'category', label: 'Category' },
  { id: 'price', label: 'Price' },
  { id: 'stock', label: 'Stock' },
  { id: 'status', label: 'Status' },
];

const FILTERS = [
  {
    id: 'status',
    label: 'Status',
    type: 'multi_select' as const,
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Low Stock', label: 'Low Stock' },
      { value: 'Out of Stock', label: 'Out of Stock' },
    ],
  },
  {
    id: 'category',
    label: 'Category',
    type: 'multi_select' as const,
    options: [...new Set(ALL_ITEMS.map((i) => i.category))].map((c) => ({ value: c, label: c })),
  },
];

const SORT_FIELDS = [
  { id: 'name', label: 'Name', type: 'text' as const },
  { id: 'price', label: 'Price', type: 'number' as const },
  { id: 'stock', label: 'Stock Units', type: 'number' as const },
];

const PAGE_SIZE = 8;

export default function ItemsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [sort, setSort] = useState<SortState | null>(null);
  const [visibleCols, setVisibleCols] = useState(COLUMNS.map((c) => c.id));
  const [pageIndex, setPageIndex] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [uploadTarget, setUploadTarget] = useState<Item | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<Record<number, File[]>>({});

  /* ── Filtering ── */
  let items = ALL_ITEMS.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) &&
        !item.sku.toLowerCase().includes(search.toLowerCase())) return false;

    for (const f of filters) {
      if (f.filterId === 'status' && Array.isArray(f.value) && f.value.length > 0) {
        if (!f.value.includes(item.status)) return false;
      }
      if (f.filterId === 'category' && Array.isArray(f.value) && f.value.length > 0) {
        if (!f.value.includes(item.category)) return false;
      }
    }
    return true;
  });

  /* ── Sorting ── */
  if (sort) {
    items = [...items].sort((a, b) => {
      const aVal = a[sort.field as keyof Item];
      const bVal = b[sort.field as keyof Item];
      if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * sort.direction;
      return String(aVal).localeCompare(String(bVal)) * sort.direction;
    });
  }

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paged = items.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

  const stats = [
    { label: 'Total Items', value: ALL_ITEMS.length, icon: Package },
    { label: 'Active', value: ALL_ITEMS.filter((i) => i.status === 'Active').length, icon: TrendingUp },
    { label: 'Low Stock', value: ALL_ITEMS.filter((i) => i.status === 'Low Stock').length, icon: AlertTriangle },
    { label: 'Out of Stock', value: ALL_ITEMS.filter((i) => i.status === 'Out of Stock').length, icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Items</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your product catalog</p>
      </div>

      {/* Stats */}
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

      {/* PageLayout + GenericToolbar */}
      <PageLayout
        toolbar={
          <GenericToolbar
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPageIndex(0); }}
            searchPlaceholder="Search by name or SKU…"
            showFilters
            availableFilters={FILTERS}
            activeFilters={filters}
            onFiltersChange={(f) => { setFilters(f); setPageIndex(0); }}
            showSort
            sortableFields={SORT_FIELDS}
            currentSort={sort}
            onSortChange={setSort}
            showConfigureView
            allColumns={COLUMNS}
            visibleColumns={visibleCols}
            onVisibleColumnsChange={setVisibleCols}
            showExport
            onExportAll={() => alert('Exporting all…')}
            onExportResults={() => alert('Exporting filtered results…')}
            showAddButton
            addButtonLabel="Add Item"
            onAdd={() => alert('Open add-item form')}
          />
        }
        showEmptyState={paged.length === 0}
        emptyState={
          <EmptyState
            icon={<PackageX className="h-12 w-12 text-muted-foreground" />}
            title="No items found"
            description={search || filters.length > 0 ? 'Try changing your search or filters.' : 'Add your first item to get started.'}
            action={
              <Button size="sm" onClick={() => { setSearch(''); setFilters([]); }}>
                Clear Filters
              </Button>
            }
          />
        }
        bottomPadding="pb-6"
      >
        {/* Table */}
        <Card className="border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  {COLUMNS.filter((c) => visibleCols.includes(c.id)).map((col) => (
                    <th key={col.id} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wide">
                      {col.label}
                    </th>
                  ))}
                  <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {paged.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    {visibleCols.includes('name') && (
                      <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                    )}
                    {visibleCols.includes('sku') && (
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{item.sku}</td>
                    )}
                    {visibleCols.includes('category') && (
                      <td className="px-4 py-3 text-sm">{item.category}</td>
                    )}
                    {visibleCols.includes('price') && (
                      <td className="px-4 py-3 text-sm font-medium">${item.price.toFixed(2)}</td>
                    )}
                    {visibleCols.includes('stock') && (
                      <td className="px-4 py-3 text-sm">{item.stock.toLocaleString()}</td>
                    )}
                    {visibleCols.includes('status') && (
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-xs ${STATUS_STYLES[item.status]}`}>
                          {item.status}
                        </Badge>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex justify-end items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Upload docs"
                          onClick={() => setUploadTarget(item)}
                        >
                          <Upload className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:text-destructive"
                          title="Delete"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <NumberedPagination
            pageIndex={pageIndex}
            pageSize={PAGE_SIZE}
            totalPages={totalPages}
            totalItems={items.length}
            canNextPage={pageIndex < totalPages - 1}
            onPageChange={setPageIndex}
            onPageSizeChange={() => {}}
          />
        </Card>
      </PageLayout>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        variant="destructive"
        title="Delete Item"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={() => {
          console.log('Deleted', deleteTarget?.id);
          setDeleteTarget(null);
        }}
      />

      {/* Document Upload */}
      <DocumentUploadModal
        open={!!uploadTarget}
        onOpenChange={(o) => !o && setUploadTarget(null)}
        documents={uploadTarget ? uploadedDocs[uploadTarget.id] ?? [] : []}
        onSave={(files) => {
          if (uploadTarget) {
            setUploadedDocs((prev) => ({ ...prev, [uploadTarget.id]: files }));
          }
        }}
        maxFiles={5}
      />
    </div>
  );
}

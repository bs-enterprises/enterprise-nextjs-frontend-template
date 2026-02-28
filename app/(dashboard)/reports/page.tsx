'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GenericToolbar } from '@/components/generic-toolbar';
import { PageLayout } from '@/components/page-layout';
import { EmptyState } from '@/components/common/empty-state';
import { NumberedPagination } from '@/components/common/pagination';
import { FileText, Download, BarChart3, TrendingUp, Clock, FileSearch } from 'lucide-react';
import type { ActiveFilter, SortState } from '@/components/generic-toolbar/types';

type ReportType = 'Financial' | 'Sales' | 'Operations' | 'HR' | 'Security';
type ReportStatus = 'Ready' | 'Generating' | 'Scheduled';

interface Report {
  id: number;
  name: string;
  type: ReportType;
  status: ReportStatus;
  generated: string;
  size: string;
  author: string;
}

const ALL_REPORTS: Report[] = [
  { id: 1, name: 'Q1 2026 Financial Summary', type: 'Financial', status: 'Ready', generated: 'Feb 28, 2026', size: '2.4 MB', author: 'Finance Team' },
  { id: 2, name: 'January Sales Performance', type: 'Sales', status: 'Ready', generated: 'Feb 7, 2026', size: '1.1 MB', author: 'Sales Analytics' },
  { id: 3, name: 'Infrastructure Cost Analysis', type: 'Operations', status: 'Ready', generated: 'Feb 15, 2026', size: '3.8 MB', author: 'DevOps Team' },
  { id: 4, name: 'Employee Headcount Report', type: 'HR', status: 'Ready', generated: 'Feb 20, 2026', size: '0.9 MB', author: 'HR Department' },
  { id: 5, name: 'Security Audit Q1 2026', type: 'Security', status: 'Generating', generated: 'In progress', size: '—', author: 'Security Team' },
  { id: 6, name: 'Customer Acquisition Metrics', type: 'Sales', status: 'Ready', generated: 'Feb 24, 2026', size: '1.7 MB', author: 'Growth Team' },
  { id: 7, name: 'Monthly Operations Review', type: 'Operations', status: 'Scheduled', generated: 'Mar 1, 2026', size: '—', author: 'Ops Team' },
  { id: 8, name: 'Product Roadmap Insights', type: 'Operations', status: 'Ready', generated: 'Feb 18, 2026', size: '2.1 MB', author: 'Product Team' },
  { id: 9, name: 'Payroll Summary February', type: 'HR', status: 'Ready', generated: 'Feb 28, 2026', size: '1.3 MB', author: 'HR Department' },
];

const STATUS_STYLES: Record<ReportStatus, string> = {
  Ready: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  Generating: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  Scheduled: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
};

const FILTERS = [
  {
    id: 'type', label: 'Type', type: 'multi_select' as const,
    options: (['Financial', 'Sales', 'Operations', 'HR', 'Security'] as ReportType[]).map((v) => ({ value: v, label: v })),
  },
  {
    id: 'status', label: 'Status', type: 'multi_select' as const,
    options: (['Ready', 'Generating', 'Scheduled'] as ReportStatus[]).map((v) => ({ value: v, label: v })),
  },
];

const SORT_FIELDS = [
  { id: 'name', label: 'Name', type: 'text' as const },
  { id: 'generated', label: 'Date', type: 'text' as const },
];

const PAGE_SIZE = 6;

export default function ReportsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [sort, setSort] = useState<SortState | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  let reports = ALL_REPORTS.filter((r) => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    for (const f of filters) {
      if (f.filterId === 'type' && Array.isArray(f.value) && f.value.length > 0) {
        if (!f.value.includes(r.type)) return false;
      }
      if (f.filterId === 'status' && Array.isArray(f.value) && f.value.length > 0) {
        if (!f.value.includes(r.status)) return false;
      }
    }
    return true;
  });

  if (sort) {
    reports = [...reports].sort((a, b) =>
      String(a[sort.field as keyof Report]).localeCompare(String(b[sort.field as keyof Report])) * sort.direction
    );
  }

  const totalPages = Math.max(1, Math.ceil(reports.length / PAGE_SIZE));
  const paged = reports.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

  const stats = [
    { label: 'Total Reports', value: ALL_REPORTS.length, icon: FileText },
    { label: 'Ready', value: ALL_REPORTS.filter((r) => r.status === 'Ready').length, icon: BarChart3 },
    { label: 'Scheduled', value: ALL_REPORTS.filter((r) => r.status === 'Scheduled').length, icon: Clock },
    { label: 'Report Types', value: new Set(ALL_REPORTS.map((r) => r.type)).size, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-sm text-muted-foreground mt-1">Generate and download reports</p>
        </div>
        <Button size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          New Report
        </Button>
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
            searchPlaceholder="Search reports…"
            showFilters
            availableFilters={FILTERS}
            activeFilters={filters}
            onFiltersChange={(f) => { setFilters(f); setPageIndex(0); }}
            showSort
            sortableFields={SORT_FIELDS}
            currentSort={sort}
            onSortChange={setSort}
            showExport
            onExportAll={() => alert('Exporting report index…')}
          />
        }
        showEmptyState={paged.length === 0}
        emptyState={
          <EmptyState
            icon={<FileSearch className="h-12 w-12 text-muted-foreground" />}
            title="No reports found"
            description="Try changing your search or filter criteria."
            action={<Button size="sm" onClick={() => { setSearch(''); setFilters([]); }}>Clear Filters</Button>}
          />
        }
        bottomPadding="pb-6"
      >
        <div className="space-y-2">
          {paged.map((report) => (
            <Card key={report.id} className="border-border/50 hover:border-border transition-colors">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{report.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">{report.author}</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="text-xs text-muted-foreground">{report.generated}</span>
                      {report.size !== '—' && (
                        <>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="text-xs text-muted-foreground">{report.size}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 hidden sm:inline-flex">
                      {report.type}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${STATUS_STYLES[report.status]}`}>
                      {report.status}
                    </Badge>
                    {report.status === 'Ready' && (
                      <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4">
          <NumberedPagination
            pageIndex={pageIndex}
            pageSize={PAGE_SIZE}
            totalPages={totalPages}
            totalItems={reports.length}
            canNextPage={pageIndex < totalPages - 1}
            onPageChange={setPageIndex}
            onPageSizeChange={() => {}}
          />
        </div>
      </PageLayout>
    </div>
  );
}

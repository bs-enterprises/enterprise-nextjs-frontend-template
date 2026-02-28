'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GenericToolbar } from '@/components/generic-toolbar';
import { PageLayout } from '@/components/page-layout';
import { EmptyState } from '@/components/common/empty-state';
import { CompactPagination } from '@/components/common/pagination';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { Users, Pencil, Trash2, UserPlus, Mail, Shield, UserX } from 'lucide-react';
import type { ActiveFilter, SortState } from '@/components/generic-toolbar/types';

const MEMBERS = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@corp.com', dept: 'Engineering', role: 'Lead Engineer', status: 'Active', joined: 'Jan 2023' },
  { id: 2, name: 'Marcus Williams', email: 'marcus@corp.com', dept: 'Design', role: 'Senior Designer', status: 'Active', joined: 'Mar 2022' },
  { id: 3, name: 'Emily Chen', email: 'emily@corp.com', dept: 'Product', role: 'Product Manager', status: 'Active', joined: 'Jun 2023' },
  { id: 4, name: 'James Rodriguez', email: 'james@corp.com', dept: 'Engineering', role: 'Backend Dev', status: 'On Leave', joined: 'Nov 2021' },
  { id: 5, name: 'Anna Thompson', email: 'anna@corp.com', dept: 'Marketing', role: 'Growth Lead', status: 'Active', joined: 'Feb 2022' },
  { id: 6, name: 'David Kim', email: 'david@corp.com', dept: 'Engineering', role: 'DevOps', status: 'Active', joined: 'Jul 2023' },
  { id: 7, name: 'Priya Patel', email: 'priya@corp.com', dept: 'Operations', role: 'Ops Manager', status: 'Active', joined: 'Oct 2021' },
  { id: 8, name: 'Noah Bennett', email: 'noah@corp.com', dept: 'Design', role: 'UX Researcher', status: 'Inactive', joined: 'May 2022' },
  { id: 9, name: 'Olivia Brooks', email: 'olivia@corp.com', dept: 'Finance', role: 'Finance Lead', status: 'Active', joined: 'Sep 2022' },
  { id: 10, name: 'Ethan Clark', email: 'ethan@corp.com', dept: 'Sales', role: 'Sales Rep', status: 'Active', joined: 'Jan 2024' },
  { id: 11, name: 'Isabel Torres', email: 'isabel@corp.com', dept: 'Support', role: 'Support Lead', status: 'Active', joined: 'Mar 2023' },
  { id: 12, name: 'Ryan Foster', email: 'ryan@corp.com', dept: 'Engineering', role: 'Frontend Dev', status: 'On Leave', joined: 'Dec 2022' },
];

const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  'On Leave': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  Inactive: 'bg-muted text-muted-foreground',
};

const DEPT_COLORS: Record<string, string> = {
  Engineering: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Design: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Product: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  Marketing: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  Operations: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  Finance: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  Sales: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Support: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
};

const FILTERS = [
  {
    id: 'status', label: 'Status', type: 'multi_select' as const,
    options: ['Active', 'On Leave', 'Inactive'].map((v) => ({ value: v, label: v })),
  },
  {
    id: 'department', label: 'Department', type: 'multi_select' as const,
    options: [...new Set(MEMBERS.map((m) => m.dept))].map((v) => ({ value: v, label: v })),
  },
];

const SORT_FIELDS = [
  { id: 'name', label: 'Name', type: 'text' as const },
  { id: 'joined', label: 'Joined Date', type: 'text' as const },
];

const PAGE_SIZE = 8;

export default function TeamPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [sort, setSort] = useState<SortState | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [removeTarget, setRemoveTarget] = useState<(typeof MEMBERS)[0] | null>(null);

  let members = MEMBERS.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) &&
        !m.email.toLowerCase().includes(search.toLowerCase())) return false;
    for (const f of filters) {
      if (f.filterId === 'status' && Array.isArray(f.value) && f.value.length > 0) {
        if (!f.value.includes(m.status)) return false;
      }
      if (f.filterId === 'department' && Array.isArray(f.value) && f.value.length > 0) {
        if (!f.value.includes(m.dept)) return false;
      }
    }
    return true;
  });

  if (sort) {
    members = [...members].sort((a, b) =>
      String(a[sort.field as keyof typeof a]).localeCompare(String(b[sort.field as keyof typeof b])) * sort.direction
    );
  }

  const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE));
  const paged = members.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

  const stats = [
    { label: 'Total Members', value: MEMBERS.length, icon: Users },
    { label: 'Active', value: MEMBERS.filter((m) => m.status === 'Active').length, icon: Shield },
    { label: 'On Leave', value: MEMBERS.filter((m) => m.status === 'On Leave').length, icon: UserX },
    { label: 'Departments', value: new Set(MEMBERS.map((m) => m.dept)).size, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your team members</p>
        </div>
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
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
            searchPlaceholder="Search by name or email…"
            showFilters
            availableFilters={FILTERS}
            activeFilters={filters}
            onFiltersChange={(f) => { setFilters(f); setPageIndex(0); }}
            showSort
            sortableFields={SORT_FIELDS}
            currentSort={sort}
            onSortChange={setSort}
            showExport
            onExportAll={() => alert('Exporting all members…')}
          />
        }
        showEmptyState={paged.length === 0}
        emptyState={
          <EmptyState
            icon={<UserX className="h-12 w-12 text-muted-foreground" />}
            title="No members found"
            description="Try adjusting your search or filter criteria."
            action={<Button size="sm" onClick={() => { setSearch(''); setFilters([]); }}>Clear Filters</Button>}
          />
        }
        bottomPadding="pb-6"
      >
        <Card className="border-border/50 overflow-hidden">
          <div className="divide-y divide-border/30">
            {paged.map((member) => (
              <div key={member.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/20 transition-colors">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-4 ${DEPT_COLORS[member.dept] ?? ''}`}>
                    {member.dept}
                  </Badge>
                  <span className="text-xs text-muted-foreground hidden lg:block">{member.role}</span>
                </div>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${STATUS_STYLES[member.status]}`}>
                  {member.status}
                </Badge>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Mail className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:text-destructive"
                    onClick={() => setRemoveTarget(member)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <CompactPagination
            pageIndex={pageIndex}
            pageSize={PAGE_SIZE}
            totalPages={totalPages}
            totalItems={members.length}
            canNextPage={pageIndex < totalPages - 1}
            onPageChange={setPageIndex}
            onPageSizeChange={() => {}}
          />
        </Card>
      </PageLayout>

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(o) => !o && setRemoveTarget(null)}
        variant="destructive"
        title="Remove Team Member"
        description={`Remove "${removeTarget?.name}" from the team? They will lose access to all resources.`}
        confirmText="Remove"
        onConfirm={() => { console.log('Removed', removeTarget?.id); setRemoveTarget(null); }}
      />
    </div>
  );
}

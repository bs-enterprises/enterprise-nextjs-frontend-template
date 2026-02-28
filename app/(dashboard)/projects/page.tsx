'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GenericToolbar } from '@/components/generic-toolbar';
import { PageLayout } from '@/components/page-layout';
import { EmptyState } from '@/components/common/empty-state';
import { SimplePagination } from '@/components/common/pagination';
import { FolderOpen, Users, CheckCircle, Clock, FolderX } from 'lucide-react';
import type { ActiveFilter, SortState } from '@/components/generic-toolbar/types';

type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
type ProjectStatus = 'On Track' | 'At Risk' | 'Completed' | 'Blocked';

interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  team: number;
  dueDate: string;
  tag: string;
}

const ALL_PROJECTS: Project[] = [
  { id: 1, name: 'Customer Portal v2', description: 'Redesign the self-service customer portal with modern UI.', status: 'On Track', priority: 'High', progress: 72, team: 5, dueDate: 'Mar 15, 2026', tag: 'Frontend' },
  { id: 2, name: 'Payment Gateway Migration', description: 'Move from legacy payment provider to Stripe.', status: 'At Risk', priority: 'Critical', progress: 34, team: 3, dueDate: 'Feb 28, 2026', tag: 'Backend' },
  { id: 3, name: 'Analytics Dashboard', description: 'Build internal analytics and reporting dashboard.', status: 'On Track', priority: 'Medium', progress: 58, team: 4, dueDate: 'Apr 10, 2026', tag: 'Data' },
  { id: 4, name: 'Mobile App iOS', description: 'Native iOS app for enterprise clients.', status: 'On Track', priority: 'High', progress: 45, team: 6, dueDate: 'May 30, 2026', tag: 'Mobile' },
  { id: 5, name: 'API Rate Limiting', description: 'Implement rate limiting and API key management.', status: 'Completed', priority: 'Low', progress: 100, team: 2, dueDate: 'Jan 31, 2026', tag: 'Backend' },
  { id: 6, name: 'SOC 2 Compliance', description: 'Achieve SOC 2 Type II certification.', status: 'At Risk', priority: 'Critical', progress: 61, team: 7, dueDate: 'Mar 31, 2026', tag: 'Security' },
  { id: 7, name: 'Microservices Refactor', description: 'Break monolith into independent microservices.', status: 'Blocked', priority: 'High', progress: 22, team: 8, dueDate: 'Jun 30, 2026', tag: 'Infrastructure' },
  { id: 8, name: 'Email Campaign System', description: 'Build automated drip email campaign infrastructure.', status: 'On Track', priority: 'Medium', progress: 88, team: 3, dueDate: 'Mar 5, 2026', tag: 'Marketing' },
];

const STATUS_STYLES: Record<ProjectStatus, string> = {
  'On Track': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  'At Risk': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  Completed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  Blocked: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

const PRIORITY_STYLES: Record<Priority, string> = {
  Critical: 'bg-red-500/10 text-red-600 dark:text-red-400',
  High: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  Medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  Low: 'bg-muted text-muted-foreground',
};

const PROGRESS_COLORS: Record<ProjectStatus, string> = {
  'On Track': '[&>div]:bg-green-500',
  'At Risk': '[&>div]:bg-yellow-500',
  Completed: '[&>div]:bg-blue-500',
  Blocked: '[&>div]:bg-red-500',
};

const FILTERS = [
  {
    id: 'status', label: 'Status', type: 'multi_select' as const,
    options: (['On Track', 'At Risk', 'Completed', 'Blocked'] as ProjectStatus[]).map((v) => ({ value: v, label: v })),
  },
  {
    id: 'priority', label: 'Priority', type: 'multi_select' as const,
    options: (['Critical', 'High', 'Medium', 'Low'] as Priority[]).map((v) => ({ value: v, label: v })),
  },
];

const PAGE_SIZE = 6;

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [sort, setSort] = useState<SortState | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const projects = ALL_PROJECTS.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    for (const f of filters) {
      if (f.filterId === 'status' && Array.isArray(f.value) && f.value.length > 0) {
        if (!f.value.includes(p.status)) return false;
      }
      if (f.filterId === 'priority' && Array.isArray(f.value) && f.value.length > 0) {
        if (!f.value.includes(p.priority)) return false;
      }
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const paged = projects.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

  const stats = [
    { label: 'Total', value: ALL_PROJECTS.length, icon: FolderOpen },
    { label: 'On Track', value: ALL_PROJECTS.filter((p) => p.status === 'On Track').length, icon: CheckCircle },
    { label: 'At Risk', value: ALL_PROJECTS.filter((p) => p.status === 'At Risk').length, icon: Clock },
    { label: 'Team Members', value: ALL_PROJECTS.reduce((s, p) => s + p.team, 0), icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
        <p className="text-sm text-muted-foreground mt-1">Track all active projects and initiatives</p>
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
            searchPlaceholder="Search projects…"
            showFilters
            availableFilters={FILTERS}
            activeFilters={filters}
            onFiltersChange={(f) => { setFilters(f); setPageIndex(0); }}
          />
        }
        showEmptyState={paged.length === 0}
        emptyState={
          <EmptyState
            icon={<FolderX className="h-12 w-12 text-muted-foreground" />}
            title="No projects found"
            description="Try adjusting your search or filters."
            action={<Button size="sm" onClick={() => { setSearch(''); setFilters([]); }}>Clear Filters</Button>}
          />
        }
        bottomPadding="pb-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((project) => (
            <Card key={project.id} className="border-border/50 hover:border-border transition-colors flex flex-col">
              <CardContent className="pt-4 pb-3 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold">{project.name}</h3>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-muted">
                        {project.tag}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${STATUS_STYLES[project.status]}`}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{project.description}</p>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className={`h-1.5 ${PROGRESS_COLORS[project.status]}`} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {project.team} members
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-4 ${PRIORITY_STYLES[project.priority]}`}>
                      {project.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{project.dueDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <SimplePagination
          pageIndex={pageIndex}
          pageSize={PAGE_SIZE}
          totalPages={totalPages}
          canNextPage={pageIndex < totalPages - 1}
          onPageChange={setPageIndex}
          onPageSizeChange={() => {}}
          className="mt-4"
        />
      </PageLayout>
    </div>
  );
}

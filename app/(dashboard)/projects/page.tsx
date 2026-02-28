import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, FolderOpen, Users, Calendar, MoreHorizontal } from 'lucide-react';

const projects = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Complete overhaul of the marketing website',
    status: 'In Progress',
    progress: 68,
    team: 4,
    dueDate: 'Jan 30, 2026',
    priority: 'High',
  },
  {
    id: 2,
    name: 'Mobile App v2',
    description: 'Next version of the iOS and Android app',
    status: 'In Progress',
    progress: 32,
    team: 6,
    dueDate: 'Mar 15, 2026',
    priority: 'High',
  },
  {
    id: 3,
    name: 'Data Pipeline Migration',
    description: 'Migrate data warehouse to new infrastructure',
    status: 'Planning',
    progress: 10,
    team: 3,
    dueDate: 'Apr 01, 2026',
    priority: 'Medium',
  },
  {
    id: 4,
    name: 'Customer Portal',
    description: 'Self-service customer management portal',
    status: 'Review',
    progress: 90,
    team: 2,
    dueDate: 'Jan 15, 2026',
    priority: 'Medium',
  },
  {
    id: 5,
    name: 'API v3',
    description: 'New REST API with GraphQL support',
    status: 'Completed',
    progress: 100,
    team: 5,
    dueDate: 'Dec 01, 2025',
    priority: 'Low',
  },
  {
    id: 6,
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting tools',
    status: 'In Progress',
    progress: 55,
    team: 3,
    dueDate: 'Feb 28, 2026',
    priority: 'High',
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  'In Progress': { label: 'In Progress', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  Planning: { label: 'Planning', className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
  Review: { label: 'Review', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  Completed: { label: 'Completed', className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and track all projects</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: 6, icon: FolderOpen },
          { label: 'Active', value: 4, icon: FolderOpen },
          { label: 'Completed', value: 1, icon: FolderOpen },
          { label: 'Due this week', value: 2, icon: Calendar },
        ].map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const status = statusConfig[project.status];
          return (
            <Card key={project.id} className="border-border/50 hover:border-border transition-colors group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold leading-tight">
                    {project.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-4 ${status.className}`}
                    >
                      {status.label}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-xs line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{project.team} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{project.dueDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

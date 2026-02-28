import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ListTodo, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const tasks = [
  { id: 1, title: 'Review pull requests for mobile app', priority: 'High', due: 'Today', done: false, assignee: 'JD' },
  { id: 2, title: 'Update API documentation', priority: 'Medium', due: 'Tomorrow', done: false, assignee: 'AS' },
  { id: 3, title: 'Fix login page bug on Safari', priority: 'High', due: 'Today', done: true, assignee: 'MK' },
  { id: 4, title: 'Design new onboarding flow', priority: 'Medium', due: 'Jan 20', done: false, assignee: 'JD' },
  { id: 5, title: 'Set up CI/CD pipeline', priority: 'Low', due: 'Jan 25', done: false, assignee: 'AS' },
  { id: 6, title: 'Conduct user research interviews', priority: 'Medium', due: 'Jan 22', done: true, assignee: 'RC' },
  { id: 7, title: 'Migrate database schemas', priority: 'High', due: 'Jan 18', done: false, assignee: 'MK' },
  { id: 8, title: 'Write unit tests for auth module', priority: 'Medium', due: 'Jan 30', done: false, assignee: 'JD' },
];

const priorityConfig: Record<string, string> = {
  High: 'bg-destructive/10 text-destructive border-destructive/20',
  Medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  Low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
};

export default function TasksPage() {
  const pending = tasks.filter((t) => !t.done);
  const completed = tasks.filter((t) => t.done);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="text-sm text-muted-foreground mt-1">Track and manage your work</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-yellow-500 shrink-0" />
            <div>
              <div className="text-2xl font-bold">{pending.length}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-500 shrink-0" />
            <div>
              <div className="text-2xl font-bold">{completed.length}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-destructive shrink-0" />
            <div>
              <div className="text-2xl font-bold">
                {tasks.filter((t) => t.due === 'Today' && !t.done).length}
              </div>
              <p className="text-xs text-muted-foreground">Due Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Pending Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pending.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <Checkbox id={`task-${task.id}`} />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`task-${task.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {task.title}
                  </label>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{task.due}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono bg-muted rounded px-1.5 py-0.5">
                    {task.assignee}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 h-4 ${priorityConfig[task.priority]}`}
                  >
                    {task.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {completed.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg opacity-60">
                <Checkbox id={`task-done-${task.id}`} checked />
                <label
                  htmlFor={`task-done-${task.id}`}
                  className="text-sm line-through text-muted-foreground flex-1 cursor-pointer"
                >
                  {task.title}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Plus, Mail, MoreHorizontal } from 'lucide-react';

const members = [
  { id: 1, name: 'Alex Johnson', role: 'Engineering Lead', email: 'alex@example.com', status: 'Active', joined: 'Jan 2023', avatar: 'AJ', dept: 'Engineering' },
  { id: 2, name: 'Sarah Chen', role: 'Product Manager', email: 'sarah@example.com', status: 'Active', joined: 'Mar 2023', avatar: 'SC', dept: 'Product' },
  { id: 3, name: 'Mike Davis', role: 'Senior Dev', email: 'mike@example.com', status: 'Active', joined: 'Jun 2023', avatar: 'MD', dept: 'Engineering' },
  { id: 4, name: 'Emma Wilson', role: 'UX Designer', email: 'emma@example.com', status: 'Active', joined: 'Apr 2023', avatar: 'EW', dept: 'Design' },
  { id: 5, name: 'Chris Brown', role: 'DevOps Engineer', email: 'chris@example.com', status: 'Away', joined: 'Aug 2023', avatar: 'CB', dept: 'Engineering' },
  { id: 6, name: 'Linda Garcia', role: 'Data Analyst', email: 'linda@example.com', status: 'Active', joined: 'Feb 2023', avatar: 'LG', dept: 'Analytics' },
  { id: 7, name: 'Tom Martinez', role: 'Frontend Dev', email: 'tom@example.com', status: 'Active', joined: 'Sep 2023', avatar: 'TM', dept: 'Engineering' },
  { id: 8, name: 'Rachel Kim', role: 'Marketing Manager', email: 'rachel@example.com', status: 'Inactive', joined: 'Nov 2022', avatar: 'RK', dept: 'Marketing' },
];

const statusConfig: Record<string, string> = {
  Active: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  Away: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  Inactive: 'bg-muted text-muted-foreground border-border',
};

const deptColors: Record<string, string> = {
  Engineering: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Product: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Design: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  Analytics: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  Marketing: 'bg-green-500/10 text-green-600 dark:text-green-400',
};

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage team members and roles</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Members', value: members.length },
          { label: 'Active', value: members.filter((m) => m.status === 'Active').length },
          { label: 'Departments', value: 5 },
          { label: 'New This Month', value: 2 },
        ].map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input placeholder="Search members..." className="pl-8 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/50">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:bg-muted/30 -mx-2 px-2 rounded-md transition-colors group"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-[10px] px-1.5 py-0 h-4 shrink-0 hidden sm:inline-flex ${deptColors[member.dept] ?? ''}`}
                >
                  {member.dept}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${statusConfig[member.status]}`}
                >
                  {member.status}
                </Badge>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Mail className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

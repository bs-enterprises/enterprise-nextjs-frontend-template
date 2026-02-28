import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Revenue',
    value: '$45,231',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
    description: 'from last month',
  },
  {
    label: 'Active Users',
    value: '2,350',
    change: '+180.1%',
    trend: 'up',
    icon: Users,
    description: 'from last month',
  },
  {
    label: 'New Projects',
    value: '12',
    change: '-4.5%',
    trend: 'down',
    icon: Activity,
    description: 'from last month',
  },
  {
    label: 'Growth Rate',
    value: '+12.5%',
    change: '+7%',
    trend: 'up',
    icon: TrendingUp,
    description: 'from last month',
  },
];

const recentActivity = [
  { id: 1, title: 'New user registered', time: '2 min ago', status: 'success' },
  { id: 2, title: 'Project Alpha deployed', time: '15 min ago', status: 'success' },
  { id: 3, title: 'Payment received from Client B', time: '1 hr ago', status: 'success' },
  { id: 4, title: 'Server latency spike detected', time: '2 hr ago', status: 'warning' },
  { id: 5, title: 'Backup completed', time: '4 hr ago', status: 'info' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your workspace performance
          </p>
        </div>
        <Button size="sm">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          View Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={`text-xs font-medium ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-destructive'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="lg:col-span-4 border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest events in your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        activity.status === 'success'
                          ? 'bg-green-500'
                          : activity.status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <span className="text-sm truncate">{activity.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-3 border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">System Status</CardTitle>
            <CardDescription>Current infrastructure health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'CPU Usage', value: 42 },
              { label: 'Memory', value: 68 },
              { label: 'Storage', value: 55 },
              { label: 'Network', value: 30 },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1">
              New Project
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1">
              Invite Team
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1">
              View Reports
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1">
              Export Data
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1">
              Schedule Meeting
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

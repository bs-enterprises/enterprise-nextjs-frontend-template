import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Activity,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const metrics = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', trend: 'up', icon: DollarSign },
  { label: 'Active Users', value: '+2,350', change: '+180.1%', trend: 'up', icon: Users },
  { label: 'Performance', value: '+12.5%', change: '+7%', trend: 'up', icon: TrendingUp },
  { label: 'Conversion Rate', value: '3.2%', change: '-0.4%', trend: 'down', icon: BarChart3 },
  { label: 'Avg Session', value: '4m 32s', change: '+12s', trend: 'up', icon: Activity },
  { label: 'Bounce Rate', value: '24.3%', change: '-2.1%', trend: 'up', icon: BarChart3 },
  { label: 'New Signups', value: '1,429', change: '+8.3%', trend: 'up', icon: Users },
  { label: 'Churn Rate', value: '1.8%', change: '-0.2%', trend: 'up', icon: TrendingUp },
];

const topPages = [
  { path: '/dashboard', sessions: 12843, change: '+4.2%' },
  { path: '/analytics', sessions: 8932, change: '+1.8%' },
  { path: '/projects', sessions: 7421, change: '+12.1%' },
  { path: '/items', sessions: 5832, change: '-0.9%' },
  { path: '/reports', sessions: 4291, change: '+3.4%' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed analytics and performance insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button size="sm">Generate Report</Button>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.slice(0, 4).map((metric) => (
          <Card key={metric.label} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={`text-xs font-medium ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-destructive'
                  }`}
                >
                  {metric.change}
                </span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue trend for 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end gap-2">
                  {[65, 48, 72, 55, 80, 62, 88, 74, 91, 68, 85, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors cursor-pointer relative group"
                      style={{ height: `${h}%` }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 whitespace-nowrap">
                        {h}%
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                    <span key={m} className="text-[10px] text-muted-foreground">{m}</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Top Pages</CardTitle>
                <CardDescription>Most visited pages this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPages.map((page) => (
                    <div key={page.path} className="flex items-center justify-between gap-2">
                      <span className="text-sm font-mono text-muted-foreground truncate">
                        {page.path}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-medium">
                          {page.sessions.toLocaleString()}
                        </span>
                        <Badge
                          variant={page.change.startsWith('+') ? 'default' : 'secondary'}
                          className="text-[10px] px-1.5 py-0 h-4"
                        >
                          {page.change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.slice(4).map((metric) => (
              <Card key={metric.label} className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{metric.change} from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="acquisition" className="mt-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Traffic Sources</CardTitle>
              <CardDescription>Where your users come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { source: 'Organic Search', value: 42, color: 'bg-blue-500' },
                  { source: 'Direct', value: 28, color: 'bg-green-500' },
                  { source: 'Referral', value: 18, color: 'bg-yellow-500' },
                  { source: 'Social Media', value: 8, color: 'bg-purple-500' },
                  { source: 'Email', value: 4, color: 'bg-pink-500' },
                ].map((source) => (
                  <div key={source.source} className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${source.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{source.source}</span>
                        <span className="font-medium">{source.value}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full">
                        <div
                          className={`h-full ${source.color} rounded-full`}
                          style={{ width: `${source.value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

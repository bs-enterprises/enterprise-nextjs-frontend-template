'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timeline } from '@/components/timeline';
import type { TimelineItem } from '@/components/timeline';
import {
  TrendingUp, Users, ShoppingCart, DollarSign,
  GitCommit, AlertCircle, CheckCircle, Bell, Package,
  Activity, Zap, Server, Shield, Database,
} from 'lucide-react';

/* ── Mock timeline data ────────────────────────────────────────────────────── */
const ACTIVITY: TimelineItem[] = [
  { id: '1', type: 'order', timestamp: new Date('2026-02-28T10:30:00'), data: { message: 'New order #ORD-1047 placed for $320.00', user: 'Customer Portal' } },
  { id: '2', type: 'alert', timestamp: new Date('2026-02-28T09:15:00'), data: { message: 'Low stock warning: "USB-C Hub 7-Port" (12 remaining)', user: 'Inventory System' } },
  { id: '3', type: 'deploy', timestamp: new Date('2026-02-28T08:45:00'), data: { message: 'Production deployment v3.2.1 completed successfully', user: 'DevOps Pipeline' } },
  { id: '4', type: 'user', timestamp: new Date('2026-02-27T17:00:00'), data: { message: '5 new team members onboarded', user: 'HR System' } },
  { id: '5', type: 'order', timestamp: new Date('2026-02-27T14:20:00'), data: { message: 'Order #ORD-1046 shipped to customer', user: 'Fulfillment' } },
  { id: '6', type: 'alert', timestamp: new Date('2026-02-27T11:05:00'), data: { message: 'Database backup completed (98 GB archived)', user: 'Backup Service' } },
  { id: '7', type: 'deploy', timestamp: new Date('2026-02-26T15:30:00'), data: { message: 'Hotfix #2.1.9 merged and deployed', user: 'CI/CD' } },
  { id: '8', type: 'user', timestamp: new Date('2026-02-26T10:00:00'), data: { message: 'User account "mike@corp.com" created', user: 'Admin Panel' } },
];

const TYPE_CONFIGS = [
  {
    type: 'order',
    icon: { component: ShoppingCart },
    color: { dot: 'bg-blue-500/10', iconColor: 'text-blue-500' },
    renderer: (item: TimelineItem) => (
      <div className="bg-card border border-border/50 rounded-lg p-3">
        <p className="text-sm font-medium">{(item.data as { message: string }).message}</p>
        <p className="text-xs text-muted-foreground mt-1">{(item.data as { user: string }).user} · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    ),
  },
  {
    type: 'alert',
    icon: { component: AlertCircle },
    color: { dot: 'bg-yellow-500/10', iconColor: 'text-yellow-500' },
    renderer: (item: TimelineItem) => (
      <div className="bg-card border border-border/50 rounded-lg p-3">
        <p className="text-sm font-medium">{(item.data as { message: string }).message}</p>
        <p className="text-xs text-muted-foreground mt-1">{(item.data as { user: string }).user} · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    ),
  },
  {
    type: 'deploy',
    icon: { component: GitCommit },
    color: { dot: 'bg-green-500/10', iconColor: 'text-green-500' },
    renderer: (item: TimelineItem) => (
      <div className="bg-card border border-border/50 rounded-lg p-3">
        <p className="text-sm font-medium">{(item.data as { message: string }).message}</p>
        <p className="text-xs text-muted-foreground mt-1">{(item.data as { user: string }).user} · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    ),
  },
  {
    type: 'user',
    icon: { component: Users },
    color: { dot: 'bg-purple-500/10', iconColor: 'text-purple-500' },
    renderer: (item: TimelineItem) => (
      <div className="bg-card border border-border/50 rounded-lg p-3">
        <p className="text-sm font-medium">{(item.data as { message: string }).message}</p>
        <p className="text-xs text-muted-foreground mt-1">{(item.data as { user: string }).user} · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    ),
  },
];

const STATS = [
  { label: 'Total Revenue', value: '$48,295', change: '+12.5%', up: true, icon: DollarSign },
  { label: 'Active Users', value: '2,847', change: '+4.3%', up: true, icon: Users },
  { label: 'Orders', value: '1,204', change: '+8.1%', up: true, icon: ShoppingCart },
  { label: 'Conversion', value: '3.24%', change: '-0.6%', up: false, icon: TrendingUp },
];

const HEALTH = [
  { name: 'API Gateway', value: 99, status: 'healthy' },
  { name: 'Database', value: 87, status: 'healthy' },
  { name: 'CDN', value: 100, status: 'healthy' },
  { name: 'Storage', value: 72, status: 'warning' },
];

const QUICK_ACTIONS = [
  { label: 'New Order', icon: ShoppingCart },
  { label: 'Add Item', icon: Package },
  { label: 'View Reports', icon: Activity },
  { label: 'System Status', icon: Server },
];

export default function DashboardPage() {
  const [actPage, setActPage] = useState(0);
  const ACT_PAGE_SIZE = 5;
  const actTotalPages = Math.ceil(ACTIVITY.length / ACT_PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Welcome back — here's what's happening today</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <div className="text-2xl font-bold mt-1">{s.value}</div>
                  <p className={`text-xs mt-1 font-medium ${s.up ? 'text-green-500' : 'text-red-500'}`}>
                    {s.change} vs last month
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Timeline Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Activity Feed</CardTitle>
              <Badge variant="secondary" className="text-xs">{ACTIVITY.length} events</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Timeline
              items={ACTIVITY.slice(actPage * ACT_PAGE_SIZE, (actPage + 1) * ACT_PAGE_SIZE)}
              typeConfigs={TYPE_CONFIGS}
              showPagination
              pageIndex={actPage}
              pageSize={ACT_PAGE_SIZE}
              totalPages={actTotalPages}
              totalItems={ACTIVITY.length}
              onPageChange={setActPage}
              onPageSizeChange={() => {}}
              emptyMessage="No activity recorded yet."
              emptyIcon={Bell}
            />
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-4">
          {/* System Health */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Server className="h-4 w-4" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {HEALTH.map((h) => (
                <div key={h.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{h.name}</span>
                    <span className={`text-xs font-medium ${h.status === 'warning' ? 'text-yellow-500' : 'text-green-500'}`}>
                      {h.value}%
                    </span>
                  </div>
                  <Progress
                    value={h.value}
                    className={`h-1.5 ${h.status === 'warning' ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((a) => (
                  <button
                    key={a.label}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border/50 hover:border-primary hover:bg-primary/5 transition-colors text-center"
                  >
                    <a.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs font-medium">{a.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-border/50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Security Status</p>
                  <p className="text-xs text-green-600 dark:text-green-400">All systems secure</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, ShoppingCart, ArrowUpRight, MoreHorizontal } from 'lucide-react';

const orders = [
  { id: '#ORD-2501', customer: 'Acme Corp', product: 'Enterprise License', date: 'Jan 15, 2026', amount: '$4,999', status: 'Completed' },
  { id: '#ORD-2500', customer: 'TechStart Inc', product: 'Pro Plan (Annual)', date: 'Jan 14, 2026', amount: '$1,199', status: 'Processing' },
  { id: '#ORD-2499', customer: 'Global Media', product: 'Team Plan x5', date: 'Jan 13, 2026', amount: '$2,495', status: 'Completed' },
  { id: '#ORD-2498', customer: 'Retail Plus', product: 'Starter License', date: 'Jan 12, 2026', amount: '$299', status: 'Pending' },
  { id: '#ORD-2497', customer: 'Dev Studio', product: 'Pro Plan (Monthly)', date: 'Jan 11, 2026', amount: '$149', status: 'Completed' },
  { id: '#ORD-2496', customer: 'Finance Co', product: 'Enterprise License', date: 'Jan 10, 2026', amount: '$4,999', status: 'Failed' },
  { id: '#ORD-2495', customer: 'Health Group', product: 'Team Plan x10', date: 'Jan 09, 2026', amount: '$4,990', status: 'Completed' },
  { id: '#ORD-2494', customer: 'Education Hub', product: 'Pro Plan (Annual)', date: 'Jan 08, 2026', amount: '$1,199', status: 'Processing' },
];

const statusConfig: Record<string, string> = {
  Completed: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  Processing: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  Pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  Failed: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function OrdersPage() {
  const total = orders.reduce((sum, o) => sum + parseFloat(o.amount.replace(/[$,]/g, '')), 0);
  const completed = orders.filter((o) => o.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-sm text-muted-foreground mt-1">Track and manage all customer orders</p>
        </div>
        <Button size="sm">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-500">{completed}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-yellow-500">
              {orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length}
            </div>
            <p className="text-xs text-muted-foreground">Pending / Processing</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-xl font-bold">
              ${total.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input placeholder="Search orders..." className="pl-8 h-9" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/50">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:bg-muted/30 -mx-2 px-2 rounded-md transition-colors group"
              >
                <div className="font-mono text-sm font-medium shrink-0 text-muted-foreground">
                  {order.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{order.customer}</p>
                  <p className="text-xs text-muted-foreground truncate">{order.product}</p>
                </div>
                <div className="text-xs text-muted-foreground shrink-0 hidden md:block">
                  {order.date}
                </div>
                <div className="text-sm font-semibold shrink-0">{order.amount}</div>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 h-4 shrink-0 ${statusConfig[order.status]}`}
                >
                  {order.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

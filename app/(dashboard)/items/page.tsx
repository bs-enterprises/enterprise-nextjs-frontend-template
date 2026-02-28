import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Package, Filter } from 'lucide-react';

const items = [
  { id: 1, name: 'Product Alpha', category: 'Electronics', status: 'Active', stock: 150, price: '$299.99' },
  { id: 2, name: 'Product Beta', category: 'Furniture', status: 'Active', stock: 45, price: '$1,299.00' },
  { id: 3, name: 'Product Gamma', category: 'Clothing', status: 'Low Stock', stock: 8, price: '$49.99' },
  { id: 4, name: 'Product Delta', category: 'Electronics', status: 'Active', stock: 230, price: '$599.00' },
  { id: 5, name: 'Product Epsilon', category: 'Books', status: 'Active', stock: 89, price: '$24.99' },
  { id: 6, name: 'Product Zeta', category: 'Sports', status: 'Out of Stock', stock: 0, price: '$89.99' },
  { id: 7, name: 'Product Eta', category: 'Food', status: 'Active', stock: 500, price: '$12.99' },
  { id: 8, name: 'Product Theta', category: 'Electronics', status: 'Active', stock: 67, price: '$199.99' },
];

const statusColor: Record<string, string> = {
  Active: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  'Low Stock': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  'Out of Stock': 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function ItemsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Items</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your product catalog</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">Total Items</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">12</div>
            <p className="text-xs text-muted-foreground">Low Stock Items</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input placeholder="Search items..." className="pl-8 h-9" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/50">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:bg-muted/30 -mx-2 px-2 rounded-md transition-colors"
              >
                <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center shrink-0 text-sm font-medium text-muted-foreground">
                  {item.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <div className="text-sm font-medium shrink-0">{item.price}</div>
                <div className="text-sm text-muted-foreground shrink-0 w-16 text-right">
                  {item.stock} left
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs shrink-0 ${statusColor[item.status] ?? ''}`}
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

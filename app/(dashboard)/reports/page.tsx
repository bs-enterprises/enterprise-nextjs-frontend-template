import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Filter, Plus } from 'lucide-react';

const reports = [
  { id: 1, name: 'Monthly Sales Report', date: '2025-12-01', size: '2.4 MB', status: 'ready', category: 'Sales' },
  { id: 2, name: 'Quarterly Analytics', date: '2025-11-15', size: '5.1 MB', status: 'ready', category: 'Analytics' },
  { id: 3, name: 'Annual Summary 2024', date: '2025-10-01', size: '8.3 MB', status: 'ready', category: 'Finance' },
  { id: 4, name: 'Customer Insights Q4', date: '2025-09-20', size: '3.7 MB', status: 'ready', category: 'Customers' },
  { id: 5, name: 'Team Performance Review', date: '2025-09-01', size: '1.9 MB', status: 'processing', category: 'HR' },
  { id: 6, name: 'Inventory Report', date: '2025-08-15', size: '4.2 MB', status: 'ready', category: 'Operations' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-sm text-muted-foreground mt-1">Generate and download reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">6</div>
            <p className="text-sm text-muted-foreground">Generated This Month</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Scheduled Reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">All Reports</CardTitle>
          <CardDescription>Download or view generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/50">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{report.name}</p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                      {report.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {report.date} · {report.size}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {report.status === 'processing' ? (
                    <Badge variant="secondary" className="text-xs">Processing</Badge>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

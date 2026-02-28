import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Layers, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
const integrations = [
  { id: 1, name: 'Slack', category: 'Communication', description: 'Team messaging and notifications', status: 'Connected', icon: '💬' },
  { id: 2, name: 'GitHub', category: 'Development', description: 'Code repositories and CI/CD', status: 'Connected', icon: '🐙' },
  { id: 3, name: 'Stripe', category: 'Payments', description: 'Payment processing and billing', status: 'Connected', icon: '💳' },
  { id: 4, name: 'Notion', category: 'Productivity', description: 'Documentation and knowledge base', status: 'Disconnected', icon: '📝' },
  { id: 5, name: 'Jira', category: 'Project Management', description: 'Issue tracking and agile boards', status: 'Connected', icon: '📊' },
  { id: 6, name: 'Figma', category: 'Design', description: 'Design collaboration and prototyping', status: 'Connected', icon: '🎨' },
  { id: 7, name: 'Salesforce', category: 'CRM', description: 'Customer relationship management', status: 'Disconnected', icon: '☁️' },
  { id: 8, name: 'Datadog', category: 'Monitoring', description: 'Infrastructure and app monitoring', status: 'Connected', icon: '📡' },
  { id: 9, name: 'SendGrid', category: 'Email', description: 'Transactional email delivery', status: 'Connected', icon: '📧' },
];

const categories = [...new Set(integrations.map((i) => i.category))];

export default function IntegrationsPage() {
  const connected = integrations.filter((i) => i.status === 'Connected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your favorite tools and services
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Browse Integrations
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <Layers className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="text-2xl font-bold">{integrations.length}</div>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500 shrink-0" />
            <div>
              <div className="text-2xl font-bold">{connected}</div>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-muted-foreground shrink-0" />
            <div>
              <div className="text-2xl font-bold">{integrations.length - connected}</div>
              <p className="text-xs text-muted-foreground">Disconnected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className="border-border/50 hover:border-border transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                    {integration.icon}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">{integration.name}</CardTitle>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 mt-0.5">
                      {integration.category}
                    </Badge>
                  </div>
                </div>
                <div
                  className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                    integration.status === 'Connected' ? 'bg-green-500' : 'bg-muted-foreground'
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">{integration.description}</p>
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 h-4 ${
                    integration.status === 'Connected'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {integration.status}
                </Badge>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <ExternalLink className="h-3.5 w-3.5" />
                  {integration.status === 'Connected' ? 'Manage' : 'Connect'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

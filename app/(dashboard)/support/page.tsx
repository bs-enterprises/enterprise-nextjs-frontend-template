import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search, HelpCircle, MessageSquare, FileText, ArrowRight, ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'How do I reset my password?', a: 'Go to Settings > Security > Change Password, or use the "Forgot password" link on the login page.' },
  { q: 'How do I invite team members?', a: 'Navigate to the Team page and click "Invite Member". Enter their email address and select a role.' },
  { q: 'Can I export my data?', a: 'Yes! Go to Reports page to generate and download reports in CSV or PDF format.' },
  { q: 'How do I configure integrations?', a: 'Visit the Integrations page to connect your favorite tools and services via API.' },
  { q: 'Is there a mobile app?', a: 'Mobile apps for iOS and Android are currently in development. Stay tuned for updates.' },
];

const categories = [
  { icon: FileText, label: 'Documentation', description: 'Complete guides and API reference', count: 48 },
  { icon: MessageSquare, label: 'Community', description: 'Forums and discussions', count: 1203 },
  { icon: HelpCircle, label: 'Tutorials', description: 'Step-by-step video tutorials', count: 26 },
];

export default function SupportPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Support</h2>
        <p className="text-sm text-muted-foreground mt-1">Get help with anything</p>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pointer-events-none" />
        <div className="relative p-6 rounded-xl border border-border/50">
          <h3 className="text-base font-semibold mb-1">How can we help?</h3>
          <p className="text-sm text-muted-foreground mb-4">Search our documentation or browse categories</p>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search help articles..."
              className="pl-9 h-10 bg-background/80"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid gap-4 sm:grid-cols-3">
        {categories.map((cat) => (
          <Card
            key={cat.label}
            className="border-border/50 hover:border-border cursor-pointer transition-colors group"
          >
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <cat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{cat.label}</p>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {cat.count}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* FAQ */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
            <CardDescription>Common questions and answers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button className="w-full flex items-start justify-between gap-3 py-3 text-left group hover:text-primary transition-colors">
                  <span className="text-sm font-medium">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                </button>
                <p className="text-sm text-muted-foreground pb-3 pr-6">{faq.a}</p>
                {i < faqs.length - 1 && <Separator className="opacity-50" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Support */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact Support</CardTitle>
              <CardDescription>Get personalized help from our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-between" variant="outline">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">Live Chat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Button>
              <Button className="w-full justify-between" variant="outline">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Submit a Ticket</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">All systems operational</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Last checked 2 minutes ago</p>
              <Button variant="link" className="h-auto p-0 mt-2 text-xs">
                View status page →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

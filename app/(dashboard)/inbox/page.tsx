import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Archive, Star, Trash2, Reply, Forward, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const emails = [
  { id: 1, from: 'Sarah Johnson', subject: 'Q4 Budget Review - Action Required', preview: 'Please review the attached budget spreadsheet and provide your comments by...', time: '10:32 AM', read: false, starred: true, avatar: 'SJ' },
  { id: 2, from: 'DevOps Team', subject: 'Production deployment successful', preview: 'The deployment of version 3.2.1 was successful. All services are running...', time: '9:15 AM', read: false, starred: false, avatar: 'DT' },
  { id: 3, from: 'Mark Wilson', subject: 'Re: Sprint Planning for Q1 2026', preview: "I've updated the sprint board with the new tickets. Let me know if you...!", time: 'Yesterday', read: true, starred: false, avatar: 'MW' },
  { id: 4, from: 'GitHub', subject: '[PR #42] Fix: Authentication edge cases', preview: 'Paul merged pull request #42 into main. This PR fixes several edge cases in...', time: 'Yesterday', read: true, starred: false, avatar: 'GH' },
  { id: 5, from: 'Customer Support', subject: 'New support ticket: #SUP-1293', preview: 'A new support ticket has been created by customer example@client.com...', time: 'Jan 15', read: true, starred: true, avatar: 'CS' },
  { id: 6, from: 'Finance Department', subject: 'Invoice #INV-2025-0047 awaiting approval', preview: 'This is a reminder that invoice #INV-2025-0047 for $8,500 is pending...', time: 'Jan 14', read: true, starred: false, avatar: 'FD' },
];

export default function InboxPage() {
  const selected = emails[0];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inbox</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {emails.filter((e) => !e.read).length} unread messages
          </p>
        </div>
        <Button size="sm">Compose</Button>
      </div>

      <div className="grid gap-0 lg:grid-cols-[320px_1fr] border border-border/50 rounded-xl overflow-hidden h-[calc(100vh-200px)] min-h-[500px]">
        {/* Email List */}
        <div className="border-r border-border/50 flex flex-col">
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input placeholder="Search inbox..." className="pl-8 h-9 text-sm bg-muted/50 border-0" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border/30">
            {emails.map((email, i) => (
              <div
                key={email.id}
                className={cn(
                  'flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors',
                  !email.read && 'bg-primary/3',
                  i === 0 && 'bg-primary/5 border-l-2 border-l-primary'
                )}
              >
                <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                  <AvatarFallback className="text-xs font-semibold bg-muted">
                    {email.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className={cn('text-sm truncate', !email.read && 'font-semibold')}>
                      {email.from}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{email.time}</span>
                  </div>
                  <p className={cn('text-xs truncate', !email.read ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                    {email.subject}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">{email.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email View */}
        <div className="flex flex-col bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Reply className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Forward className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Archive className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selected.subject}</h3>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                    {selected.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{selected.from}</span>
                    {selected.starred && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground">to me · {selected.time}</p>
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-sm text-foreground leading-relaxed">
                  {selected.preview}
                </p>
                <p className="text-sm text-foreground leading-relaxed mt-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-sm text-muted-foreground mt-4">Best regards,<br />{selected.from}</p>
              </div>
            </div>
          </div>

          {/* Reply Box */}
          <div className="p-4 border-t border-border/50">
            <div className="border border-border/50 rounded-lg p-3 space-y-2">
              <Input
                placeholder="Reply to this message..."
                className="border-0 p-0 h-auto text-sm focus-visible:ring-0 bg-transparent"
              />
              <div className="flex justify-end">
                <Button size="sm">
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Send, MoreHorizontal, Phone, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

const conversations = [
  { id: 1, name: 'Alice Johnson', lastMessage: 'Can you review the PR?', time: '2m', unread: 2, online: true },
  { id: 2, name: 'Bob Smith', lastMessage: 'Thanks for the update!', time: '15m', unread: 0, online: true },
  { id: 3, name: 'Design Team', lastMessage: 'New mockups are ready', time: '1h', unread: 5, online: false },
  { id: 4, name: 'Charlie Brown', lastMessage: 'Meeting postponed to 3pm', time: '2h', unread: 0, online: false },
  { id: 5, name: 'Product Team', lastMessage: 'Sprint review notes shared', time: '4h', unread: 1, online: false },
];

const messages = [
  { id: 1, sender: 'Alice Johnson', text: 'Hey, can you review the PR I just submitted?', time: '10:32 AM', mine: false },
  { id: 2, sender: 'Me', text: "Sure! I'll take a look shortly.", time: '10:34 AM', mine: true },
  { id: 3, sender: 'Alice Johnson', text: 'The main changes are in the auth module. There are also some UI fixes.', time: '10:35 AM', mine: false },
  { id: 4, sender: 'Me', text: 'Got it. Will review both.', time: '10:37 AM', mine: true },
  { id: 5, sender: 'Alice Johnson', text: 'Thanks! Also, there might be a few edge cases to consider.', time: '10:38 AM', mine: false },
];

export default function MessagesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
        <p className="text-sm text-muted-foreground mt-1">Team communication hub</p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[300px_1fr] border border-border/50 rounded-xl overflow-hidden h-[calc(100vh-200px)] min-h-[500px]">
        {/* Conversations Sidebar */}
        <div className="border-r border-border/50 flex flex-col">
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input placeholder="Search messages..." className="pl-8 h-9 text-sm bg-muted/50 border-0" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv, i) => (
              <div
                key={conv.id}
                className={cn(
                  'flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/30',
                  i === 0 && 'bg-primary/5 border-l-2 border-l-primary'
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs font-semibold bg-muted">
                      {conv.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-medium truncate">{conv.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <Badge className="h-5 min-w-5 rounded-full text-[10px] px-1.5 shrink-0">
                    {conv.unread}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col bg-background">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-muted">AJ</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Alice Johnson</p>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex', msg.mine ? 'justify-end' : 'justify-start')}
              >
                <div className={cn('max-w-[75%] space-y-1', msg.mine && 'items-end')}>
                  <div
                    className={cn(
                      'px-4 py-2.5 rounded-2xl text-sm',
                      msg.mine
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted rounded-tl-sm'
                    )}
                  >
                    {msg.text}
                  </div>
                  <p className="text-[10px] text-muted-foreground px-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                className="flex-1 h-10 bg-muted/50 border-0 focus-visible:ring-1"
              />
              <Button size="icon" className="h-10 w-10 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

const events = [
  { id: 1, day: 5, title: 'Team Standup', time: '9:00 AM', color: 'bg-blue-500' },
  { id: 2, day: 8, title: 'Product Review', time: '2:00 PM', color: 'bg-purple-500' },
  { id: 3, day: 12, title: 'Client Meeting', time: '10:00 AM', color: 'bg-green-500' },
  { id: 4, day: 15, title: 'Sprint Planning', time: '1:00 PM', color: 'bg-yellow-500' },
  { id: 5, day: 19, title: 'Design Review', time: '3:00 PM', color: 'bg-pink-500' },
  { id: 6, day: 22, title: 'Quarterly Review', time: '11:00 AM', color: 'bg-orange-500' },
  { id: 7, day: 28, title: 'Release Planning', time: '2:30 PM', color: 'bg-blue-500' },
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarPage() {
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const todayDate = today.getDate();

  const days: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const getEventsForDay = (day: number) => events.filter((e) => e.day === day);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
          <p className="text-sm text-muted-foreground mt-1">Schedule and manage events</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        {/* Calendar Grid */}
        <Card className="lg:col-span-5 border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {monthNames[currentMonth]} {currentYear}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>
            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                if (!day) return <div key={i} />;
                const dayEvents = getEventsForDay(day);
                const isToday = day === todayDate;
                return (
                  <div
                    key={i}
                    className={cn(
                      'min-h-[60px] p-1 rounded-md border transition-colors cursor-pointer hover:bg-muted/50',
                      isToday ? 'border-primary/50 bg-primary/5' : 'border-transparent'
                    )}
                  >
                    <span
                      className={cn(
                        'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full',
                        isToday
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground'
                      )}
                    >
                      {day}
                    </span>
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`${event.color} text-white text-[9px] px-1 py-0.5 rounded mt-0.5 truncate`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-muted-foreground mt-0.5 px-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${event.color}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {monthNames[currentMonth].slice(0, 3)} {event.day} · {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

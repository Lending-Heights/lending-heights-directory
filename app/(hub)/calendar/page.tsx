'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const upcomingEvents = [
  { id: 1, title: 'Q1 Planning Meeting', date: 'Jan 15, 2026', time: '10:00 AM', type: 'meeting' },
  { id: 2, title: 'Payroll Processing', date: 'Jan 15, 2026', time: 'All Day', type: 'payroll' },
  { id: 3, title: "Martin Luther King Jr. Day", date: 'Jan 20, 2026', time: 'Holiday', type: 'holiday' },
  { id: 4, title: 'Team Building Event', date: 'Jan 25, 2026', time: '2:00 PM', type: 'event' },
];

const eventColors: Record<string, string> = {
  meeting: 'bg-blue-100 text-blue-700 border-blue-200',
  payroll: 'bg-green-100 text-green-700 border-green-200',
  holiday: 'bg-red-100 text-red-700 border-red-200',
  event: 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function CalendarPage() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentMonth = 'January 2026';

  // Generate calendar days (simplified)
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 3; // Offset for January 2026 starting on Thursday
    if (day < 1 || day > 31) return null;
    return day;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Calendar"
        description="Events, holidays, payroll dates, and team activities"
        icon={Calendar}
        iconColor="text-red-600"
        iconBgColor="bg-red-50"
        badge="Coming Soon"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">{currentMonth}</CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, i) => (
                <div
                  key={i}
                  className={`aspect-square p-1 text-center text-sm rounded-lg ${
                    day
                      ? 'hover:bg-muted cursor-pointer'
                      : ''
                  } ${day === 21 ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  {day}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border ${eventColors[event.type]}`}
              >
                <p className="font-medium text-sm">{event.title}</p>
                <p className="text-xs mt-1">{event.date} - {event.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(eventColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color.split(' ')[0]}`} />
                <span className="text-sm text-muted-foreground capitalize">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

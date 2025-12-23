'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Check, CheckCheck, Trash2, Filter, Info, AlertCircle, CheckCircle, Users } from 'lucide-react';

type NotificationType = 'info' | 'success' | 'warning' | 'team';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  isRead: boolean;
  actionUrl?: string;
}

const initialNotifications: Notification[] = [
  { id: 1, title: 'New Teammate Added', message: 'Sarah Johnson has joined the Operations team', type: 'team', time: '2 hours ago', isRead: false },
  { id: 2, title: 'Calendar Event', message: 'Q1 Planning Meeting scheduled for tomorrow at 10 AM', type: 'info', time: '4 hours ago', isRead: false },
  { id: 3, title: 'Profile Updated', message: 'Your profile information has been successfully updated', type: 'success', time: '1 day ago', isRead: true },
  { id: 4, title: 'Action Required', message: 'Please complete your onboarding checklist', type: 'warning', time: '2 days ago', isRead: true },
  { id: 5, title: 'New Feature', message: 'Check out the new CRM dashboard with improved analytics', type: 'info', time: '3 days ago', isRead: true },
  { id: 6, title: 'Team Update', message: 'Michael Chen has been promoted to Senior Loan Officer', type: 'team', time: '1 week ago', isRead: true },
];

const typeIcons: Record<NotificationType, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  team: Users,
};

const typeColors: Record<NotificationType, string> = {
  info: 'bg-blue-100 text-blue-600',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-yellow-100 text-yellow-600',
  team: 'bg-purple-100 text-purple-600',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-lh-red">{unreadCount} new</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Stay updated on what&apos;s happening</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0 divide-y">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const Icon = typeIcons[notification.type];
              return (
                <div
                  key={notification.id}
                  className={`p-4 flex gap-4 transition-colors ${
                    !notification.isRead ? 'bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className={`p-2 rounded-full h-10 w-10 flex items-center justify-center ${typeColors[notification.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Mark read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AppGrid } from '@/components/dashboard/AppGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Users, Calendar } from 'lucide-react';

const recentActivity = [
  {
    id: 1,
    action: 'New teammate added',
    description: 'Sarah Johnson joined the Operations team',
    time: '2 hours ago',
    type: 'success',
  },
  {
    id: 2,
    action: 'Calendar event',
    description: 'Q1 Planning Meeting scheduled for Jan 15',
    time: '4 hours ago',
    type: 'info',
  },
  {
    id: 3,
    action: 'Directory updated',
    description: 'Contact information updated for 3 team members',
    time: 'Yesterday',
    type: 'info',
  },
];

const stats = [
  {
    label: 'Team Members',
    value: '12',
    change: '+2 this month',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    label: 'Upcoming Events',
    value: '5',
    change: 'Next 7 days',
    icon: Calendar,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    label: 'Active Tasks',
    value: '8',
    change: '3 due today',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <WelcomeHeader />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Applications Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Applications</h2>
        <AppGrid />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 last:pb-0 last:border-0 border-b border-border"
              >
                <div
                  className={`h-2 w-2 mt-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

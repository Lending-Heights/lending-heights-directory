'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, FileText, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Total Users', value: 12, change: '+2 this month', icon: Users, href: '/admin/users' },
  { label: 'Active Roles', value: 4, change: 'No changes', icon: Shield, href: '/admin/permissions' },
  { label: 'Audit Entries', value: 156, change: '+23 today', icon: FileText, href: '/admin/audit' },
];

const recentActivity = [
  { id: 1, action: 'User role updated', user: 'Admin', target: 'Sarah Johnson', time: '2 min ago' },
  { id: 2, action: 'New user created', user: 'Admin', target: 'Michael Chen', time: '1 hour ago' },
  { id: 3, action: 'Permission changed', user: 'Admin', target: 'CRM Access', time: '3 hours ago' },
  { id: 4, action: 'User profile edited', user: 'John Doe', target: 'Self', time: 'Yesterday' },
];

const systemHealth = [
  { name: 'Database', status: 'healthy', message: 'Connected to Supabase' },
  { name: 'Authentication', status: 'healthy', message: 'SSO Ready (pending setup)' },
  { name: 'API', status: 'healthy', message: 'All endpoints responding' },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, permissions, and monitor system activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      by {activity.user} - {activity.target}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((system) => (
                <div key={system.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${
                      system.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{system.name}</p>
                      <p className="text-xs text-muted-foreground">{system.message}</p>
                    </div>
                  </div>
                  <Badge variant={system.status === 'healthy' ? 'default' : 'secondary'}>
                    {system.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/admin/users" className="p-4 rounded-lg bg-card border hover:shadow-md transition-shadow text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Manage Users</p>
            </Link>
            <Link href="/admin/permissions" className="p-4 rounded-lg bg-card border hover:shadow-md transition-shadow text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Edit Permissions</p>
            </Link>
            <Link href="/admin/audit" className="p-4 rounded-lg bg-card border hover:shadow-md transition-shadow text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">View Logs</p>
            </Link>
            <Link href="/directory" className="p-4 rounded-lg bg-card border hover:shadow-md transition-shadow text-center">
              <AlertCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Directory</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

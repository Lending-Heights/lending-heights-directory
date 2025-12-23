'use client';

import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { User, Mail, Building, MapPin, Shield, Clock, Settings, Bell, Palette } from 'lucide-react';

export default function ProfilePage() {
  const { user, role } = useAuthStore();

  const pinnedApps = [
    { id: 'directory', name: 'Team Directory' },
    { id: 'calendar', name: 'Company Calendar' },
    { id: 'crm', name: 'Partner CRM' },
  ];

  const loginHistory = [
    { id: 1, date: 'Jan 21, 2026', time: '10:30 AM', device: 'Windows PC', location: 'Pittsburgh, PA' },
    { id: 2, date: 'Jan 20, 2026', time: '9:15 AM', device: 'Windows PC', location: 'Pittsburgh, PA' },
    { id: 3, date: 'Jan 19, 2026', time: '8:45 AM', device: 'iPhone', location: 'Pittsburgh, PA' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h2 className="text-xl font-bold">{user?.displayName}</h2>
                <Badge className="w-fit capitalize">{role}</Badge>
              </div>
              <div className="space-y-1 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </p>
                <p className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {user?.department || 'Operations'}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Pittsburgh (HQ)
                </p>
              </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Light</Button>
                <Button variant="outline" size="sm" className="flex-1">Dark</Button>
                <Button variant="default" size="sm" className="flex-1">System</Button>
              </div>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium mb-2 block">Default View</label>
              <div className="flex gap-2">
                <Button variant="default" size="sm" className="flex-1">Grid</Button>
                <Button variant="outline" size="sm" className="flex-1">List</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Email notifications', enabled: true },
              { label: 'Push notifications', enabled: false },
              { label: 'Weekly digest', enabled: true },
              { label: 'New teammate alerts', enabled: true },
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between">
                <span className="text-sm">{setting.label}</span>
                <Button
                  variant={setting.enabled ? 'default' : 'outline'}
                  size="sm"
                >
                  {setting.enabled ? 'On' : 'Off'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pinned Apps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Pinned Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {pinnedApps.map((app) => (
              <Badge key={app.id} variant="secondary" className="px-3 py-1.5">
                {app.name}
                <button className="ml-2 hover:text-destructive">&times;</button>
              </Badge>
            ))}
            <Button variant="outline" size="sm">+ Add App</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Last Login</p>
              <p className="text-sm text-muted-foreground">Today at 10:30 AM from Pittsburgh, PA</p>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <h4 className="font-medium mb-3">Recent Login History</h4>
            <div className="space-y-2">
              {loginHistory.map((login) => (
                <div key={login.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                  <div>
                    <span className="font-medium">{login.date}</span>
                    <span className="text-muted-foreground"> at {login.time}</span>
                  </div>
                  <div className="text-muted-foreground text-right">
                    <span>{login.device}</span>
                    <span className="mx-2">-</span>
                    <span>{login.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

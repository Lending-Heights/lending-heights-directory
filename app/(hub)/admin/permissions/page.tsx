'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Check, X, Minus } from 'lucide-react';

const roles = ['Employee', 'Manager', 'Admin', 'Executive'];

const applications = [
  { id: 'directory', name: 'Team Directory', category: 'Employee' },
  { id: 'calendar', name: 'Company Calendar', category: 'Employee' },
  { id: 'talentflow', name: 'TalentFlow', category: 'Operations' },
  { id: 'crm', name: 'Partner CRM', category: 'CRM' },
  { id: 'checklists', name: 'Project Checklists', category: 'Operations' },
  { id: 'marketing', name: 'Marketing Hub', category: 'Marketing' },
  { id: 'admin', name: 'Admin Panel', category: 'Admin' },
];

// Mock permission matrix
const permissions: Record<string, Record<string, string>> = {
  directory: { Employee: 'view', Manager: 'edit', Admin: 'admin', Executive: 'admin' },
  calendar: { Employee: 'view', Manager: 'view', Admin: 'admin', Executive: 'admin' },
  talentflow: { Employee: 'none', Manager: 'view', Admin: 'admin', Executive: 'admin' },
  crm: { Employee: 'view', Manager: 'edit', Admin: 'admin', Executive: 'admin' },
  checklists: { Employee: 'view', Manager: 'edit', Admin: 'admin', Executive: 'admin' },
  marketing: { Employee: 'view', Manager: 'view', Admin: 'admin', Executive: 'admin' },
  admin: { Employee: 'none', Manager: 'none', Admin: 'admin', Executive: 'admin' },
};

const permissionColors: Record<string, { bg: string; icon: typeof Check }> = {
  admin: { bg: 'bg-green-100 text-green-700', icon: Check },
  edit: { bg: 'bg-blue-100 text-blue-700', icon: Check },
  view: { bg: 'bg-gray-100 text-gray-700', icon: Minus },
  none: { bg: 'bg-red-50 text-red-400', icon: X },
};

export default function AdminPermissionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Permission Matrix</h1>
          <p className="text-muted-foreground">Configure role-based access to applications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <Badge className={permissionColors.admin.bg}>Admin</Badge>
              <span className="text-sm text-muted-foreground">Full access</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={permissionColors.edit.bg}>Edit</Badge>
              <span className="text-sm text-muted-foreground">Can modify</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={permissionColors.view.bg}>View</Badge>
              <span className="text-sm text-muted-foreground">Read only</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={permissionColors.none.bg}>None</Badge>
              <span className="text-sm text-muted-foreground">No access</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground min-w-[200px]">
                    Application
                  </th>
                  {roles.map((role) => (
                    <th key={role} className="text-center py-3 px-4 font-medium text-muted-foreground min-w-[100px]">
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{app.name}</p>
                        <p className="text-xs text-muted-foreground">{app.category}</p>
                      </div>
                    </td>
                    {roles.map((role) => {
                      const permission = permissions[app.id]?.[role] || 'none';
                      const PermIcon = permissionColors[permission].icon;
                      return (
                        <td key={role} className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Badge className={permissionColors[permission].bg}>
                              <PermIcon className="h-3 w-3 mr-1" />
                              {permission}
                            </Badge>
                          </Button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Role-Based Access Control</p>
            <p className="text-sm text-blue-700">
              Changes to permissions will take effect immediately for all users with the affected role.
              Individual user overrides can be configured in the Users section.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

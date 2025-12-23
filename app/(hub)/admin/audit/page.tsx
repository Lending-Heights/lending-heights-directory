'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Search, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const auditLogs = [
  { id: 1, action: 'user.login', user: 'John Doe', target: null, ip: '192.168.1.100', time: '2026-01-21 10:30:45', status: 'success' },
  { id: 2, action: 'user.role_updated', user: 'Admin', target: 'Sarah Johnson', ip: '192.168.1.101', time: '2026-01-21 10:28:12', status: 'success' },
  { id: 3, action: 'teammate.created', user: 'Admin', target: 'Michael Chen', ip: '192.168.1.101', time: '2026-01-21 09:45:00', status: 'success' },
  { id: 4, action: 'permission.changed', user: 'Admin', target: 'CRM Module', ip: '192.168.1.101', time: '2026-01-21 09:30:22', status: 'success' },
  { id: 5, action: 'user.login', user: 'Jane Smith', target: null, ip: '192.168.1.102', time: '2026-01-21 09:15:00', status: 'success' },
  { id: 6, action: 'teammate.updated', user: 'John Doe', target: 'Self', ip: '192.168.1.100', time: '2026-01-20 16:45:30', status: 'success' },
  { id: 7, action: 'user.login_failed', user: 'unknown', target: null, ip: '10.0.0.50', time: '2026-01-20 14:22:15', status: 'failed' },
  { id: 8, action: 'teammate.deleted', user: 'Admin', target: 'Former Employee', ip: '192.168.1.101', time: '2026-01-20 11:00:00', status: 'success' },
];

const actionLabels: Record<string, { label: string; color: string }> = {
  'user.login': { label: 'User Login', color: 'bg-green-100 text-green-700' },
  'user.login_failed': { label: 'Login Failed', color: 'bg-red-100 text-red-700' },
  'user.role_updated': { label: 'Role Updated', color: 'bg-purple-100 text-purple-700' },
  'teammate.created': { label: 'User Created', color: 'bg-blue-100 text-blue-700' },
  'teammate.updated': { label: 'User Updated', color: 'bg-yellow-100 text-yellow-700' },
  'teammate.deleted': { label: 'User Deleted', color: 'bg-red-100 text-red-700' },
  'permission.changed': { label: 'Permission Changed', color: 'bg-orange-100 text-orange-700' },
};

export default function AdminAuditPage() {
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter((log) =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.user.toLowerCase().includes(search.toLowerCase()) ||
    (log.target && log.target.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground">Track all system activity and changes</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Target</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">IP Address</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const actionInfo = actionLabels[log.action] || { label: log.action, color: 'bg-gray-100 text-gray-700' };
                  return (
                    <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-mono text-muted-foreground">
                        {log.time}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={actionInfo.color}>{actionInfo.label}</Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">{log.user}</td>
                      <td className="py-3 px-4 text-muted-foreground">{log.target || '-'}</td>
                      <td className="py-3 px-4 font-mono text-sm text-muted-foreground">{log.ip}</td>
                      <td className="py-3 px-4">
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {auditLogs.length} entries
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

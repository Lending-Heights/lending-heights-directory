'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, TrendingUp, DollarSign, Phone, Mail } from 'lucide-react';

const pipelineStats = [
  { label: 'Active Partners', value: 24, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { label: 'Pending Deals', value: 12, icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
  { label: 'Monthly Volume', value: '$2.4M', icon: DollarSign, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
];

const recentPartners = [
  { id: 1, name: 'Keller Williams Realty', contact: 'John Smith', status: 'active', deals: 5, volume: '$890K' },
  { id: 2, name: 'RE/MAX Premier', contact: 'Sarah Wilson', status: 'active', deals: 3, volume: '$650K' },
  { id: 3, name: 'Coldwell Banker', contact: 'Mike Johnson', status: 'pending', deals: 1, volume: '$245K' },
  { id: 4, name: 'Century 21', contact: 'Lisa Chen', status: 'active', deals: 4, volume: '$520K' },
];

const pipeline = [
  { stage: 'Lead', count: 8, color: 'bg-gray-200' },
  { stage: 'Contacted', count: 5, color: 'bg-blue-200' },
  { stage: 'Meeting', count: 3, color: 'bg-yellow-200' },
  { stage: 'Proposal', count: 2, color: 'bg-purple-200' },
  { stage: 'Closed', count: 6, color: 'bg-green-200' },
];

export default function CRMPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner CRM"
        description="Manage realtor partnerships and track your pipeline"
        icon={Building2}
        iconColor="text-yellow-600"
        iconBgColor="bg-yellow-50"
        badge="Coming Soon"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {pipelineStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {pipeline.map((stage) => (
              <div key={stage.stage} className="flex-1 text-center">
                <div className={`h-24 ${stage.color} rounded-lg flex items-center justify-center mb-2`}>
                  <span className="text-2xl font-bold">{stage.count}</span>
                </div>
                <p className="text-sm font-medium">{stage.stage}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Partners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Partner</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Deals</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Volume</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPartners.map((partner) => (
                  <tr key={partner.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{partner.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{partner.contact}</td>
                    <td className="py-3 px-4">
                      <Badge variant={partner.status === 'active' ? 'default' : 'secondary'}>
                        {partner.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{partner.deals}</td>
                    <td className="py-3 px-4 font-medium">{partner.volume}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-muted rounded">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Megaphone, Download, FileText, Image, Video, Folder, ExternalLink } from 'lucide-react';

const assetCategories = [
  { name: 'Logos & Brand', count: 12, icon: Image, color: 'bg-blue-50 text-blue-600' },
  { name: 'Flyers & Brochures', count: 8, icon: FileText, color: 'bg-green-50 text-green-600' },
  { name: 'Social Media', count: 24, icon: Megaphone, color: 'bg-purple-50 text-purple-600' },
  { name: 'Video Content', count: 5, icon: Video, color: 'bg-red-50 text-red-600' },
  { name: 'Email Templates', count: 15, icon: FileText, color: 'bg-yellow-50 text-yellow-600' },
  { name: 'Presentations', count: 6, icon: Folder, color: 'bg-cyan-50 text-cyan-600' },
];

const recentAssets = [
  { id: 1, name: 'Q1 Rate Sheet Template', type: 'PDF', size: '2.4 MB', date: 'Jan 15, 2026' },
  { id: 2, name: 'Social Media Kit - January', type: 'ZIP', size: '45 MB', date: 'Jan 10, 2026' },
  { id: 3, name: 'LH Logo Pack (All Formats)', type: 'ZIP', size: '12 MB', date: 'Jan 5, 2026' },
  { id: 4, name: 'Partner Intro Video', type: 'MP4', size: '120 MB', date: 'Jan 3, 2026' },
];

const campaigns = [
  { id: 1, name: 'Q1 Rate Reduction Push', status: 'active', startDate: 'Jan 15', endDate: 'Feb 28' },
  { id: 2, name: 'First-Time Buyer Education', status: 'planned', startDate: 'Feb 1', endDate: 'Mar 31' },
  { id: 3, name: 'Partner Appreciation Month', status: 'completed', startDate: 'Dec 1', endDate: 'Dec 31' },
];

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Hub"
        description="Brand assets, templates, and campaign materials"
        icon={Megaphone}
        iconColor="text-violet-600"
        iconBgColor="bg-violet-50"
        badge="Coming Soon"
      />

      {/* Asset Categories */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Asset Library</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {assetCategories.map((category) => (
            <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mx-auto mb-3`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <p className="font-medium text-sm">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.count} files</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Assets</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAssets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.type} - {asset.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Campaigns</CardTitle>
            <Button variant="outline" size="sm">New Campaign</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{campaign.name}</h3>
                  <Badge
                    variant={
                      campaign.status === 'active'
                        ? 'default'
                        : campaign.status === 'completed'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {campaign.startDate} - {campaign.endDate}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Brand Guidelines Quick Access */}
      <Card className="bg-gradient-to-r from-lh-blue to-lh-dark-blue text-white">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Brand Guidelines</h3>
            <p className="text-white/80 text-sm">Access the official Lending Heights brand guide</p>
          </div>
          <Button variant="secondary" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

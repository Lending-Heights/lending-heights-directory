'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Megaphone,
  Download,
  FileText,
  Image,
  Video,
  Folder,
  ExternalLink,
  Plus,
  X,
  Trash2,
  Loader2,
  Upload,
  Mail,
  MoreVertical,
} from 'lucide-react';
import {
  fetchAssets,
  fetchRecentAssets,
  fetchCampaigns,
  createAsset,
  updateAsset,
  deleteAsset,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getAssetCountsByType,
} from '@/lib/api/marketing';
import { uploadMarketingAsset, deleteMarketingAsset } from '@/lib/api/storage';
import type { Database } from '@/types/database';

type MarketingAsset = Database['public']['Tables']['marketing_assets']['Row'];
type MarketingCampaign = Database['public']['Tables']['marketing_campaigns']['Row'];
type AssetType = MarketingAsset['asset_type'];
type CampaignStatus = MarketingCampaign['status'];

const assetTypeConfig: Record<
  AssetType,
  { name: string; icon: typeof Image; color: string }
> = {
  logo: { name: 'Logos & Brand', icon: Image, color: 'bg-blue-50 text-blue-600' },
  flyer: { name: 'Flyers & Brochures', icon: FileText, color: 'bg-green-50 text-green-600' },
  social_media: { name: 'Social Media', icon: Megaphone, color: 'bg-purple-50 text-purple-600' },
  video: { name: 'Video Content', icon: Video, color: 'bg-red-50 text-red-600' },
  email_template: { name: 'Email Templates', icon: Mail, color: 'bg-yellow-50 text-yellow-600' },
  presentation: { name: 'Presentations', icon: Folder, color: 'bg-cyan-50 text-cyan-600' },
  other: { name: 'Other', icon: FileText, color: 'bg-gray-50 text-gray-600' },
};

const campaignStatusColors: Record<CampaignStatus, string> = {
  planned: 'outline',
  active: 'default',
  completed: 'secondary',
  archived: 'secondary',
};

interface AssetFormData {
  name: string;
  description: string;
  asset_type: AssetType;
  is_featured: boolean;
}

interface CampaignFormData {
  name: string;
  description: string;
  status: CampaignStatus;
  start_date: string;
  end_date: string;
}

const initialAssetForm: AssetFormData = {
  name: '',
  description: '',
  asset_type: 'other',
  is_featured: false,
};

const initialCampaignForm: CampaignFormData = {
  name: '',
  description: '',
  status: 'planned',
  start_date: '',
  end_date: '',
};

export default function MarketingPage() {
  // Data state
  const [assets, setAssets] = useState<MarketingAsset[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [assetCounts, setAssetCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Asset modal state
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MarketingAsset | null>(null);
  const [assetForm, setAssetForm] = useState<AssetFormData>(initialAssetForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [savingAsset, setSavingAsset] = useState(false);

  // Campaign modal state
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<MarketingCampaign | null>(null);
  const [campaignForm, setCampaignForm] = useState<CampaignFormData>(initialCampaignForm);
  const [savingCampaign, setSavingCampaign] = useState(false);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'asset' | 'campaign'; item: any } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);

    const [assetsResult, campaignsResult, countsResult] = await Promise.all([
      fetchRecentAssets(10),
      fetchCampaigns(),
      getAssetCountsByType(),
    ]);

    if (assetsResult.error) {
      setError(assetsResult.error);
    } else {
      setAssets(assetsResult.data || []);
    }

    if (campaignsResult.data) {
      setCampaigns(campaignsResult.data);
    }

    if (countsResult.data) {
      setAssetCounts(countsResult.data);
    }

    setLoading(false);
  }

  // Asset modal handlers
  function openCreateAssetModal() {
    setEditingAsset(null);
    setAssetForm(initialAssetForm);
    setSelectedFile(null);
    setIsAssetModalOpen(true);
  }

  function openEditAssetModal(asset: MarketingAsset) {
    setEditingAsset(asset);
    setAssetForm({
      name: asset.name,
      description: asset.description || '',
      asset_type: asset.asset_type,
      is_featured: asset.is_featured,
    });
    setSelectedFile(null);
    setIsAssetModalOpen(true);
  }

  function closeAssetModal() {
    setIsAssetModalOpen(false);
    setEditingAsset(null);
    setAssetForm(initialAssetForm);
    setSelectedFile(null);
  }

  async function handleAssetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavingAsset(true);

    try {
      if (editingAsset) {
        // Update existing asset
        const { error } = await updateAsset(editingAsset.id, {
          name: assetForm.name,
          description: assetForm.description || null,
          asset_type: assetForm.asset_type,
          is_featured: assetForm.is_featured,
        });

        if (error) {
          alert('Error updating asset: ' + error);
          setSavingAsset(false);
          return;
        }
      } else {
        // Create new asset - requires file
        if (!selectedFile) {
          alert('Please select a file to upload');
          setSavingAsset(false);
          return;
        }

        // Upload file first
        const uploadResult = await uploadMarketingAsset(selectedFile);
        if (uploadResult.error || !uploadResult.url) {
          alert('Error uploading file: ' + uploadResult.error);
          setSavingAsset(false);
          return;
        }

        // Create asset record
        const { error } = await createAsset({
          name: assetForm.name || selectedFile.name,
          description: assetForm.description || null,
          asset_type: assetForm.asset_type,
          is_featured: assetForm.is_featured,
          file_url: uploadResult.url,
          file_name: uploadResult.fileName,
          file_size: uploadResult.fileSize,
          mime_type: uploadResult.mimeType,
        });

        if (error) {
          alert('Error creating asset: ' + error);
          setSavingAsset(false);
          return;
        }
      }

      closeAssetModal();
      loadData();
    } catch (err) {
      alert('An unexpected error occurred');
    }

    setSavingAsset(false);
  }

  // Campaign modal handlers
  function openCreateCampaignModal() {
    setEditingCampaign(null);
    setCampaignForm(initialCampaignForm);
    setIsCampaignModalOpen(true);
  }

  function openEditCampaignModal(campaign: MarketingCampaign) {
    setEditingCampaign(campaign);
    setCampaignForm({
      name: campaign.name,
      description: campaign.description || '',
      status: campaign.status,
      start_date: campaign.start_date || '',
      end_date: campaign.end_date || '',
    });
    setIsCampaignModalOpen(true);
  }

  function closeCampaignModal() {
    setIsCampaignModalOpen(false);
    setEditingCampaign(null);
    setCampaignForm(initialCampaignForm);
  }

  async function handleCampaignSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavingCampaign(true);

    const campaignData = {
      name: campaignForm.name,
      description: campaignForm.description || null,
      status: campaignForm.status,
      start_date: campaignForm.start_date || null,
      end_date: campaignForm.end_date || null,
    };

    let result;
    if (editingCampaign) {
      result = await updateCampaign(editingCampaign.id, campaignData);
    } else {
      result = await createCampaign(campaignData);
    }

    if (result.error) {
      alert(`Error ${editingCampaign ? 'updating' : 'creating'} campaign: ${result.error}`);
    } else {
      closeCampaignModal();
      loadData();
    }

    setSavingCampaign(false);
  }

  // Delete handlers
  function confirmDeleteAsset(asset: MarketingAsset) {
    setDeleteTarget({ type: 'asset', item: asset });
    setShowDeleteConfirm(true);
  }

  function confirmDeleteCampaign(campaign: MarketingCampaign) {
    setDeleteTarget({ type: 'campaign', item: campaign });
    setShowDeleteConfirm(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);

    if (deleteTarget.type === 'asset') {
      const asset = deleteTarget.item as MarketingAsset;
      // Delete file from storage first
      await deleteMarketingAsset(asset.file_url);
      // Delete database record
      const { error } = await deleteAsset(asset.id);
      if (error) {
        alert('Error deleting asset: ' + error);
      }
    } else {
      const { error } = await deleteCampaign(deleteTarget.item.id);
      if (error) {
        alert('Error deleting campaign: ' + error);
      }
    }

    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    setDeleting(false);
    loadData();
  }

  // Format file size
  function formatFileSize(bytes: number | null): string {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // Format date
  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Hub"
        description="Brand assets, templates, and campaign materials"
        icon={Megaphone}
        iconColor="text-violet-600"
        iconBgColor="bg-violet-50"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={openCreateCampaignModal} className="gap-2">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
            <Button onClick={openCreateAssetModal} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Asset
            </Button>
          </div>
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Asset Categories */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Asset Library</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {Object.entries(assetTypeConfig).map(([type, config]) => {
              const Icon = config.icon;
              const count = assetCounts[type] || 0;
              return (
                <Card key={type} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center mx-auto mb-3`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="font-medium text-sm">{config.name}</p>
                    <p className="text-xs text-muted-foreground">{count} files</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Assets</CardTitle>
            <Button variant="outline" size="sm" onClick={openCreateAssetModal}>
              Upload
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {assets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No assets yet</p>
            ) : (
              assets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                >
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => openEditAssetModal(asset)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {asset.file_name.split('.').pop()?.toUpperCase()} -{' '}
                        {formatFileSize(asset.file_size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(asset.file_url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDeleteAsset(asset)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Campaigns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Campaigns</CardTitle>
            <Button variant="outline" size="sm" onClick={openCreateCampaignModal}>
              New Campaign
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No campaigns yet</p>
            ) : (
              campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                  onClick={() => openEditCampaignModal(campaign)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{campaign.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={campaignStatusColors[campaign.status] as any}>
                        {campaign.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteCampaign(campaign);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(campaign.start_date)}
                    {campaign.end_date && ` - ${formatDate(campaign.end_date)}`}
                  </p>
                </div>
              ))
            )}
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

      {/* Asset Upload Modal */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeAssetModal} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg bg-white rounded-xl shadow-xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-lh-gradient rounded-t-xl px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {editingAsset ? 'Edit Asset' : 'Upload Asset'}
                </h2>
                <button
                  onClick={closeAssetModal}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAssetSubmit} className="p-6 space-y-4">
                {!editingAsset && (
                  <div>
                    <label className="block text-sm font-medium mb-1">File *</label>
                    <input
                      type="file"
                      required={!editingAsset}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          if (!assetForm.name) {
                            setAssetForm({ ...assetForm, name: file.name.split('.')[0] });
                          }
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {selectedFile && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={assetForm.name}
                    onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Asset name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Asset Type *</label>
                  <select
                    required
                    value={assetForm.asset_type}
                    onChange={(e) =>
                      setAssetForm({ ...assetForm, asset_type: e.target.value as AssetType })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {Object.entries(assetTypeConfig).map(([type, config]) => (
                      <option key={type} value={type}>
                        {config.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={assetForm.description}
                    onChange={(e) => setAssetForm({ ...assetForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Optional description"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={assetForm.is_featured}
                    onChange={(e) => setAssetForm({ ...assetForm, is_featured: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="is_featured" className="text-sm">
                    Featured asset
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  {editingAsset && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => confirmDeleteAsset(editingAsset)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  )}
                  <div className="flex-1" />
                  <Button type="button" variant="outline" onClick={closeAssetModal}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingAsset}>
                    {savingAsset ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {editingAsset ? 'Saving...' : 'Uploading...'}
                      </>
                    ) : editingAsset ? (
                      'Save Changes'
                    ) : (
                      'Upload Asset'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Modal */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeCampaignModal}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg bg-white rounded-xl shadow-xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-lh-gradient rounded-t-xl px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {editingCampaign ? 'Edit Campaign' : 'New Campaign'}
                </h2>
                <button
                  onClick={closeCampaignModal}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCampaignSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Campaign Name *</label>
                  <input
                    type="text"
                    required
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Campaign name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status *</label>
                  <select
                    required
                    value={campaignForm.status}
                    onChange={(e) =>
                      setCampaignForm({ ...campaignForm, status: e.target.value as CampaignStatus })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      value={campaignForm.start_date}
                      onChange={(e) =>
                        setCampaignForm({ ...campaignForm, start_date: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      value={campaignForm.end_date}
                      onChange={(e) =>
                        setCampaignForm({ ...campaignForm, end_date: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={campaignForm.description}
                    onChange={(e) =>
                      setCampaignForm({ ...campaignForm, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Campaign description (optional)"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  {editingCampaign && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => confirmDeleteCampaign(editingCampaign)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  )}
                  <div className="flex-1" />
                  <Button type="button" variant="outline" onClick={closeCampaignModal}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingCampaign}>
                    {savingCampaign ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : editingCampaign ? (
                      'Save Changes'
                    ) : (
                      'Create Campaign'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 z-[200] overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <Card
              className="relative w-full max-w-md animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <CardTitle className="text-lg">
                  Delete {deleteTarget.type === 'asset' ? 'Asset' : 'Campaign'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Are you sure you want to delete <strong>{deleteTarget.item.name}</strong>? This
                  action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                    {deleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

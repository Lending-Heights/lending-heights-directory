'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchTeammateById, updateTeammate, deleteTeammate } from '@/lib/api/teammates';
import { uploadHeadshot } from '@/lib/api/storage';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { ProfileContact } from '@/components/profile/ProfileContact';
import { ProfileTags } from '@/components/profile/ProfileTags';
import { ProfileLicenses } from '@/components/profile/ProfileLicenses';
import { TeammateModal } from '@/components/TeammateModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Trash2, Edit, AlertTriangle, Upload, X } from 'lucide-react';

export default function TeammatePage() {
  const params = useParams();
  const router = useRouter();
  const [teammate, setTeammate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    branch: '',
    nmls: '',
    onboarding_status: '',
    linkedin_url: '',
    calendly_link: '',
  });
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [headshotPreview, setHeadshotPreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadTeammate() {
      if (!params.id) return;

      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await fetchTeammateById(params.id as string);

      if (fetchError) {
        setError(fetchError);
        setLoading(false);
        return;
      }

      if (!data) {
        setError('Teammate not found');
        setLoading(false);
        return;
      }

      setTeammate(data);
      setLoading(false);
    }

    loadTeammate();
  }, [params.id]);

  function openEditModal() {
    if (!teammate) return;
    setFormData({
      first_name: teammate.first_name || '',
      last_name: teammate.last_name || '',
      email: teammate.email || '',
      phone: teammate.phone || '',
      position: teammate.position || '',
      department: teammate.department || '',
      branch: teammate.branch || '',
      nmls: teammate.nmls || '',
      onboarding_status: teammate.onboarding_status || 'Not started',
      linkedin_url: teammate.linkedin_url || '',
      calendly_link: teammate.calendly_link || '',
    });
    // Set current headshot as preview if exists
    setHeadshotPreview(teammate.headshot_url || null);
    setHeadshotFile(null);
    setIsEditModalOpen(true);
  }

  function handleHeadshotChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setHeadshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeadshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function clearHeadshot() {
    setHeadshotFile(null);
    setHeadshotPreview(null);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teammate?.id) return;

    setSaving(true);

    let headshotUrl: string | null | undefined = undefined;

    // Upload new headshot if a file was selected
    if (headshotFile) {
      const { url, error: uploadError } = await uploadHeadshot(headshotFile, teammate.id);
      if (uploadError) {
        alert('Error uploading headshot: ' + uploadError);
        setSaving(false);
        return;
      }
      headshotUrl = url;
    } else if (headshotPreview === null && teammate.headshot_url) {
      // User cleared the headshot
      headshotUrl = null;
    }

    const updateData: any = { ...formData };
    if (headshotUrl !== undefined) {
      updateData.headshot_url = headshotUrl;
    }

    const { error } = await updateTeammate(teammate.id, updateData);
    setSaving(false);

    if (error) {
      alert('Error updating teammate: ' + error);
      return;
    }

    setIsEditModalOpen(false);
    setHeadshotFile(null);
    setHeadshotPreview(null);

    const { data } = await fetchTeammateById(teammate.id);
    if (data) {
      setTeammate(data);
    }
  }

  async function handleDelete() {
    if (!teammate?.id) return;

    setDeleting(true);
    const { error } = await deleteTeammate(teammate.id);
    setDeleting(false);

    if (error) {
      alert('Error deleting teammate: ' + error);
      setShowDeleteConfirm(false);
      return;
    }

    router.push('/directory');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !teammate) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/directory">
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
        </Button>

        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-xl font-bold mb-2">Teammate Not Found</h1>
            <p className="text-muted-foreground mb-4">
              {error || "We couldn't find the teammate you're looking for."}
            </p>
            <Button asChild>
              <Link href="/directory">Back to Directory</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/directory">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </Button>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <ProfileHeader teammate={teammate} />

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileInfo teammate={teammate} />

              {teammate.tags && teammate.tags.length > 0 && (
                <ProfileTags tags={teammate.tags} />
              )}

              {teammate.licensed_states && teammate.licensed_states.length > 0 && (
                <ProfileLicenses licenses={teammate.licensed_states} />
              )}
            </div>

            {/* Right Column - Actions & Contact */}
            <div className="space-y-4">
              <Button onClick={openEditModal} className="w-full gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete Profile
              </Button>

              <ProfileContact teammate={teammate} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      {teammate.reviews && teammate.reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Client Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teammate.reviews.map((review: any) => (
                <div key={review.id} className="border-l-4 border-primary pl-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                          *
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{review.rating}/5</span>
                  </div>
                  <p className="text-foreground mb-1 italic">"{review.review_text}"</p>
                  <p className="text-sm text-muted-foreground">
                    - {review.client_name}
                    {review.review_date && (
                      <span className="ml-2">
                        ({new Date(review.review_date).toLocaleDateString()})
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <TeammateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Teammate"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {/* Headshot Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Profile Photo</label>
            <div className="flex items-center gap-4">
              {headshotPreview ? (
                <div className="relative">
                  <img
                    src={headshotPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-border"
                  />
                  <button
                    type="button"
                    onClick={clearHeadshot}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeadshotChange}
                  className="hidden"
                  id="edit-headshot-upload"
                />
                <label htmlFor="edit-headshot-upload">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span className="cursor-pointer">
                      {headshotPreview ? 'Change Photo' : 'Upload Photo'}
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Position *</label>
            <input
              type="text"
              required
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department *</label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select</option>
                <option value="Leadership">Leadership</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Branch *</label>
              <select
                required
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select</option>
                <option value="Pittsburgh (HQ)">Pittsburgh (HQ)</option>
                <option value="Savannah">Savannah</option>
                <option value="Philadelphia">Philadelphia</option>
                <option value="Erie PA">Erie PA</option>
                <option value="LH California">LH California</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">NMLS</label>
              <input
                type="text"
                value={formData.nmls}
                onChange={(e) => setFormData({...formData, nmls: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.onboarding_status}
                onChange={(e) => setFormData({...formData, onboarding_status: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Done">Done</option>
                <option value="Offboard">Offboard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Calendly Link</label>
            <input
              type="url"
              value={formData.calendly_link}
              onChange={(e) => setFormData({...formData, calendly_link: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </TeammateModal>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
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
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-destructive" />
                </div>

                <h2 className="text-xl font-bold mb-2">Delete Teammate?</h2>

                <p className="text-muted-foreground mb-6">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-foreground">{teammate?.full_name}</span>?
                  This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
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

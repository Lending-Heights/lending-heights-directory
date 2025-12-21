'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchTeammateById, updateTeammate, deleteTeammate } from '@/lib/api/teammates';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { ProfileContact } from '@/components/profile/ProfileContact';
import { ProfileTags } from '@/components/profile/ProfileTags';
import { ProfileLicenses } from '@/components/profile/ProfileLicenses';
import { TeammateModal } from '@/components/TeammateModal';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';

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

  // Open edit modal and populate form with current data
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
    setIsEditModalOpen(true);
  }

  // Handle form submission
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teammate?.id) return;

    setSaving(true);
    const { error } = await updateTeammate(teammate.id, formData as any);
    setSaving(false);

    if (error) {
      alert('Error updating teammate: ' + error);
      return;
    }

    // Success - close modal and reload data
    setIsEditModalOpen(false);

    // Reload teammate data
    const { data } = await fetchTeammateById(teammate.id);
    if (data) {
      setTeammate(data);
    }
  }

  // Handle delete
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

    // Success - redirect to directory
    router.push('/');
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-lh-bg to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-lh-blue animate-spin mx-auto mb-4" />
          <p className="text-lh-secondary-text font-poppins text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !teammate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-lh-bg to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-lh-blue hover:text-lh-dark-blue font-poppins font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Directory
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-lh-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">😕</span>
            </div>
            <h1 className="text-3xl font-bold font-poppins text-lh-text mb-4">
              Teammate Not Found
            </h1>
            <p className="text-lh-secondary-text font-poppins mb-8">
              {error || 'We couldn\'t find the teammate you\'re looking for.'}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-lh-blue text-white rounded-lg font-poppins font-semibold hover:bg-lh-dark-blue transition-colors"
            >
              Back to Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success State - Display Profile
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-lh-bg to-white">
      <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-lh-blue hover:text-lh-dark-blue font-poppins font-semibold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
          {/* Header Section */}
          <ProfileHeader teammate={teammate} />

          {/* Content Grid */}
          <div className="p-6 md:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-8">
                <ProfileInfo teammate={teammate} />
                
                {teammate.tags && teammate.tags.length > 0 && (
                  <ProfileTags tags={teammate.tags} />
                )}

                {teammate.licensed_states && teammate.licensed_states.length > 0 && (
                  <ProfileLicenses licenses={teammate.licensed_states} />
                )}
              </div>

              {/* Right Column - Edit Button & Contact */}
              <div className="lg:col-span-1 space-y-6">
                {/* Edit Button */}
                <button
                  onClick={openEditModal}
                  className="w-full px-6 py-3 bg-lh-yellow text-lh-text font-poppins font-semibold rounded-lg hover:bg-yellow-500 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span className="text-xl">✏️</span>
                  Edit Profile
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-6 py-3 bg-lh-red/10 text-lh-red border border-lh-red/20 font-poppins font-semibold rounded-lg hover:bg-lh-red hover:text-white transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Profile
                </button>

                <ProfileContact teammate={teammate} />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section (if available) */}
        {teammate.reviews && teammate.reviews.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold font-poppins text-lh-text mb-6">
              Client Reviews
            </h2>
            <div className="space-y-6">
              {teammate.reviews.map((review: any) => (
                <div key={review.id} className="border-l-4 border-lh-blue pl-6 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-lh-yellow' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-lh-secondary-text font-poppins">
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="text-lh-text font-poppins mb-2 italic">
                    "{review.review_text}"
                  </p>
                  <p className="text-sm text-lh-secondary-text font-poppins">
                    — {review.client_name}
                    {review.review_date && (
                      <span className="ml-2">
                        ({new Date(review.review_date).toLocaleDateString()})
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <TeammateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Teammate"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-lh-text font-poppins mb-2">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-lh-text font-poppins mb-2">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-lh-text font-poppins mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-lh-text font-poppins mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-semibold text-lh-text font-poppins mb-2">
              Position *
            </label>
            <input
              type="text"
              required
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-lh-text font-poppins mb-2">
                Department *
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
              >
                <option value="">Select Department</option>
                <option value="Leadership">Leadership</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-semibold text-lh-text font-poppins mb-2">
                Branch *
              </label>
              <select
                required
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
                className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
              >
                <option value="">Select Branch</option>
                <option value="🌉 Pittsburgh (HQ)">🌉 Pittsburgh (HQ)</option>
                <option value="🍑 Savannah">🍑 Savannah</option>
                <option value="🔔 Philadelphia">🔔 Philadelphia</option>
                <option value="🌊 Erie PA">🌊 Erie PA</option>
                <option value="🌅 LH California">🌅 LH California</option>
              </select>
            </div>
          </div>

          {/* NMLS */}
          <div>
            <label className="block text-sm font-semibold text-lh-text font-poppins mb-2">
              NMLS Number
            </label>
            <input
              type="text"
              value={formData.nmls}
              onChange={(e) => setFormData({...formData, nmls: e.target.value})}
              className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
              placeholder="NMLS #123456"
            />
          </div>

          {/* Onboarding Status */}
          <div>
            <label className="block text-sm font-semibold text-lh-text font-poppins mb-2">
              Onboarding Status
            </label>
            <select
              value={formData.onboarding_status}
              onChange={(e) => setFormData({...formData, onboarding_status: e.target.value})}
              className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
            >
              <option value="Not started">Not started</option>
              <option value="In progress">In progress</option>
              <option value="Done">Done</option>
              <option value="Offboard">Offboard</option>
            </select>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-semibold text-lh-text font-poppins mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
              className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          {/* Calendly */}
          <div>
            <label className="block text-sm font-semibold text-lh-text font-poppins mb-2">
              Calendly Link
            </label>
            <input
              type="url"
              value={formData.calendly_link}
              onChange={(e) => setFormData({...formData, calendly_link: e.target.value})}
              className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
              placeholder="https://calendly.com/..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 px-6 py-3 border border-lh-border text-lh-text font-poppins font-semibold rounded-lg hover:bg-lh-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-lh-blue text-white font-poppins font-semibold rounded-lg hover:bg-lh-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </TeammateModal>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          ></div>

          {/* Dialog */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Icon */}
              <div className="w-16 h-16 bg-lh-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-lh-red" />
              </div>

              <h2 className="text-2xl font-bold font-poppins text-lh-text text-center mb-4">
                Delete Teammate?
              </h2>

              <p className="text-lh-secondary-text font-poppins text-center mb-8">
                Are you sure you want to delete <span className="font-semibold text-lh-text">{teammate?.full_name}</span>?
                This action cannot be undone.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 border border-lh-border text-lh-text font-poppins font-semibold rounded-lg hover:bg-lh-bg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-lh-red text-white font-poppins font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
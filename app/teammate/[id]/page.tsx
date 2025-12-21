'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchTeammateById } from '@/lib/api/teammates';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { ProfileContact } from '@/components/profile/ProfileContact';
import { ProfileTags } from '@/components/profile/ProfileTags';
import { ProfileLicenses } from '@/components/profile/ProfileLicenses';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function TeammatePage() {
  const params = useParams();
  const router = useRouter();
  const [teammate, setTeammate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                  onClick={() => alert('Edit button clicked! (Not connected yet)')}
                  className="w-full px-6 py-3 bg-lh-yellow text-lh-text font-poppins font-semibold rounded-lg hover:bg-yellow-500 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span className="text-xl">✏️</span>
                  Edit Profile
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
    </div>
  );
}
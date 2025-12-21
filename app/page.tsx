'use client';

import { useState, useMemo, useEffect } from 'react';
import { FilterState, Department } from '@/types';
import { fetchTeammates, createTeammate } from '@/lib/api/teammates';
import { Filters } from '@/components/Filters';
import { DepartmentGroup } from '@/components/DepartmentGroup';
import { TeammateTable } from '@/components/TeammateTable';
import { ViewToggle } from '@/components/ViewToggle';
import { ExportButton } from '@/components/ExportButton';
import { TeammateModal } from '@/components/TeammateModal';
import { Users, Loader2 } from 'lucide-react';

type ViewMode = 'gallery' | 'table';

export default function TeamDirectory() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    department: 'All',
    branch: 'All',
    onboardingStatus: 'All',
  });

  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    branch: '',
    nmls: '',
    onboardingStatus: 'Not started',
  });
  const [teammates, setTeammates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teammates from database on mount
  useEffect(() => {
    async function loadTeammates() {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await fetchTeammates();
      
      if (fetchError) {
        setError(fetchError);
        setLoading(false);
        return;
      }
      
      // Transform database data to match our component format
      const transformedData = (data || []).map((teammate: any) => ({
        id: teammate.id,
        firstName: teammate.first_name,
        lastName: teammate.last_name,
        fullName: teammate.full_name,
        email: teammate.email,
        phone: teammate.phone,
        position: teammate.position,
        department: teammate.department as Department,
        branch: teammate.branch,
        nmls: teammate.nmls,
        headshotUrl: teammate.headshot_url,
        startDate: teammate.start_date,
        birthday: teammate.birthday_date,
        onboardingStatus: teammate.onboarding_status,
        linkedIn: teammate.linkedin_url,
        calendly: teammate.calendly_link,
        manager: teammate.manager_id,
        tags: [], // Tags will be fetched separately if needed
      }));
      
      setTeammates(transformedData);
      setLoading(false);
    }
    
    loadTeammates();
  }, []);

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const { data, error } = await createTeammate({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone || null,
      position: formData.position,
      department: formData.department as any,
      branch: formData.branch,
      nmls: formData.nmls || null,
      onboarding_status: formData.onboardingStatus as any,
    });

    if (error) {
      alert('Error creating teammate: ' + error);
      return;
    }

    // Success!
    alert('Teammate created successfully! 🎉');
    setIsModalOpen(false);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      branch: '',
      nmls: '',
      onboardingStatus: 'Not started',
    });
    
    // Reload teammates
    const result = await fetchTeammates();
    if (result.data) {
      const transformedData = result.data.map((teammate: any) => ({
        id: teammate.id,
        firstName: teammate.first_name,
        lastName: teammate.last_name,
        fullName: teammate.full_name,
        email: teammate.email,
        phone: teammate.phone,
        position: teammate.position,
        department: teammate.department,
        branch: teammate.branch,
        nmls: teammate.nmls,
        headshotUrl: teammate.headshot_url,
        startDate: teammate.start_date,
        birthday: teammate.birthday_date,
        onboardingStatus: teammate.onboarding_status,
        linkedIn: teammate.linkedin_url,
        calendly: teammate.calendly_link,
        manager: teammate.manager_id,
        tags: [],
      }));
      setTeammates(transformedData);
    }
  }

  // Filter teammates based on current filters
  const filteredTeammates = useMemo(() => {
    return teammates.filter((teammate) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          teammate.fullName.toLowerCase().includes(searchLower) ||
          teammate.position.toLowerCase().includes(searchLower) ||
          teammate.branch.toLowerCase().includes(searchLower) ||
          teammate.email.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Department filter
      if (filters.department !== 'All' && teammate.department !== filters.department) {
        return false;
      }

      // Branch filter
      if (filters.branch !== 'All' && teammate.branch !== filters.branch) {
        return false;
      }

      // Status filter
      if (filters.onboardingStatus !== 'All' && teammate.onboardingStatus !== filters.onboardingStatus) {
        return false;
      }

      return true;
    });
  }, [teammates, filters]);

  // Group teammates by department for gallery view
  const groupedTeammates = useMemo(() => {
    const groups: Record<Department, any[]> = {
      Leadership: [],
      Sales: [],
      Operations: [],
    };

    filteredTeammates.forEach((teammate) => {
      groups[teammate.department as Department].push(teammate);
    });

    return groups;
  }, [filteredTeammates]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-lh-bg to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-lh-blue animate-spin mx-auto mb-4" />
          <p className="text-lh-secondary-text font-poppins text-lg">Loading team directory...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-lh-bg to-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-lh-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold font-poppins text-lh-text mb-2">
              Unable to Load Directory
            </h2>
            <p className="text-lh-secondary-text font-poppins mb-6">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-lh-blue text-white rounded-lg font-poppins font-semibold hover:bg-lh-dark-blue transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-lh-bg to-white">
      {/* Floating Add Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-lh-blue hover:bg-lh-dark-blue text-white font-poppins font-semibold px-6 py-4 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 flex items-center gap-2 z-50 hover:scale-105"
      >
        <span className="text-2xl">+</span>
        Add Teammate
      </button>

      {/* Add Teammate Modal */}
      <TeammateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Teammate"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-lh-text font-poppins mb-2">
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
              placeholder="John"
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
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
              placeholder="Doe"
            />
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
              placeholder="john.doe@lendingheights.com"
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
              placeholder="(412) 555-0123"
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
              placeholder="Loan Officer"
            />
          </div>

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

          {/* NMLS (Optional) */}
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
              Onboarding Status *
            </label>
            <select
              required
              value={formData.onboardingStatus}
              onChange={(e) => setFormData({...formData, onboardingStatus: e.target.value})}
              className="w-full px-4 py-3 border border-lh-border rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-lh-blue"
            >
              <option value="Not started">Not started</option>
              <option value="In progress">In progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-6 py-3 border border-lh-border text-lh-text font-poppins font-semibold rounded-lg hover:bg-lh-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-lh-blue text-white font-poppins font-semibold rounded-lg hover:bg-lh-dark-blue transition-colors"
            >
              Save Teammate
            </button>
          </div>
        </form>
      </TeammateModal>

      {/* Header with Gradient */}
      <div className="bg-lh-gradient shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="flex items-center gap-4 mb-4 animate-slide-up">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-poppins tracking-tight">
                Team Directory
              </h1>
              <p className="text-white/90 font-poppins text-lg md:text-xl mt-2">
                Connect with your Lending Heights teammates
              </p>
            </div>
          </div>
          
          {/* Mission Statement */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mt-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <p className="text-white font-poppins text-sm md:text-base leading-relaxed">
              💡 <span className="font-semibold">Our Mission:</span> Creating the best place for great loan officers to work through 
              cutting-edge technology, supportive culture, transparency, and a focus on personal and professional growth.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        {/* Filters */}
        <div className="mb-8">
          <Filters
            filters={filters}
            onFilterChange={setFilters}
            resultCount={filteredTeammates.length}
            totalCount={teammates.length}
          />
        </div>

        {/* View Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-slide-up">
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          
          <ExportButton teammates={filteredTeammates} />
        </div>

        {/* Content based on view mode */}
        {filteredTeammates.length > 0 ? (
          <>
            {/* Gallery View */}
            {viewMode === 'gallery' && (
              <div className="space-y-16">
                {(['Leadership', 'Sales', 'Operations'] as Department[]).map((dept, index) => {
                  const deptTeammates = groupedTeammates[dept];
                  const startIndex = ['Leadership', 'Sales', 'Operations']
                    .slice(0, index)
                    .reduce((acc, d) => acc + groupedTeammates[d as Department].length, 0);
                  
                  return (
                    <DepartmentGroup
                      key={dept}
                      department={dept}
                      teammates={deptTeammates}
                      startIndex={startIndex}
                    />
                  );
                })}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <TeammateTable teammates={filteredTeammates} />
            )}
          </>
        ) : (
          // Empty State
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-lh-bg rounded-full mb-6">
              <Users className="w-10 h-10 text-lh-secondary-text" />
            </div>
            <h3 className="text-2xl font-bold font-poppins text-lh-text mb-2">
              No teammates found
            </h3>
            <p className="text-lh-secondary-text font-poppins mb-6">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={() => setFilters({
                search: '',
                department: 'All',
                branch: 'All',
                onboardingStatus: 'All',
              })}
              className="px-6 py-3 bg-lh-blue text-white rounded-lg font-poppins font-semibold hover:bg-lh-dark-blue transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-lh-dark-blue text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="font-poppins text-sm">
              © {new Date().getFullYear()} Lending Heights Mortgage. All rights reserved.
            </p>
            <p className="font-poppins text-xs text-white/70 mt-2">
              <span className="font-bold text-lh-yellow">YOU + LH = ACCOMPLISH</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
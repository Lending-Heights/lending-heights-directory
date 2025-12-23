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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Loader2, Plus, UserCheck, Building2 } from 'lucide-react';

type ViewMode = 'gallery' | 'table';

export default function DirectoryPage() {
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
        tags: [],
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

    alert('Teammate created successfully!');
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
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          teammate.fullName.toLowerCase().includes(searchLower) ||
          teammate.position.toLowerCase().includes(searchLower) ||
          teammate.branch.toLowerCase().includes(searchLower) ||
          teammate.email.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      if (filters.department !== 'All' && teammate.department !== filters.department) {
        return false;
      }
      if (filters.branch !== 'All' && teammate.branch !== filters.branch) {
        return false;
      }
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

  // Stats
  const stats = [
    { label: 'Total Team', value: teammates.length, icon: Users, color: 'text-blue-600' },
    { label: 'Onboarded', value: teammates.filter(t => t.onboardingStatus === 'Done').length, icon: UserCheck, color: 'text-green-600' },
    { label: 'Departments', value: 3, icon: Building2, color: 'text-purple-600' },
  ];

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading team directory...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">!</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Unable to Load Directory</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Directory</h1>
          <p className="text-muted-foreground">Connect with your Lending Heights teammates</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Teammate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <Filters
            filters={filters}
            onFilterChange={setFilters}
            resultCount={filteredTeammates.length}
            totalCount={teammates.length}
          />
        </CardContent>
      </Card>

      {/* View Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        <ExportButton teammates={filteredTeammates} />
      </div>

      {/* Content */}
      {filteredTeammates.length > 0 ? (
        <>
          {viewMode === 'gallery' && (
            <div className="space-y-12">
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

          {viewMode === 'table' && (
            <Card>
              <CardContent className="p-0">
                <TeammateTable teammates={filteredTeammates} />
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No teammates found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search criteria
            </p>
            <Button
              variant="outline"
              onClick={() => setFilters({
                search: '',
                department: 'All',
                branch: 'All',
                onboardingStatus: 'All',
              })}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Teammate Modal */}
      <TeammateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Teammate"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
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
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                required
                value={formData.onboardingStatus}
                onChange={(e) => setFormData({...formData, onboardingStatus: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Teammate
            </Button>
          </div>
        </form>
      </TeammateModal>
    </div>
  );
}

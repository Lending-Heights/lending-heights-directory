import { FilterState, Department, Branch, OnboardingStatus } from '@/types';
import { Search, Filter, X } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
  totalCount: number;
}

export function Filters({ filters, onFilterChange, resultCount, totalCount }: FiltersProps) {
  const departments: Array<Department | 'All'> = ['All', 'Leadership', 'Sales', 'Operations'];
  
  const branches: Array<Branch | 'All'> = [
    'All',
    '🌉 Pittsburgh (HQ)',
    '🍑 Savannah',
    '🔔 Philadelphia',
    '🌊 Erie PA',
    '🖼️ ELG',
    '💥 Prosper Firm',
    'Champion Lending Group',
    'Keswick Mortgage Group',
    '🌅 LH California',
    'WTX Lending',
  ];

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.department !== 'All' || 
    filters.branch !== 'All' ||
    filters.onboardingStatus !== 'All';

  const clearFilters = () => {
    onFilterChange({
      search: '',
      department: 'All',
      branch: 'All',
      onboardingStatus: 'All',
    });
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lh-secondary-text w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name, position, or branch..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full pl-12 pr-4 py-4 border-2 border-lh-border rounded-xl font-poppins text-lh-text placeholder:text-lh-secondary-text focus:outline-none focus:border-lh-blue focus:ring-4 focus:ring-lh-blue/10 transition-all"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Department Filter */}
        <div className="flex-1">
          <label className="block text-xs font-semibold font-poppins text-lh-secondary-text mb-1.5 uppercase tracking-wider">
            <Filter className="inline w-3 h-3 mr-1" />
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => onFilterChange({ ...filters, department: e.target.value as Department | 'All' })}
            className="w-full px-4 py-3 border-2 border-lh-border rounded-xl font-poppins text-lh-text focus:outline-none focus:border-lh-blue focus:ring-4 focus:ring-lh-blue/10 transition-all bg-white"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Filter */}
        <div className="flex-1">
          <label className="block text-xs font-semibold font-poppins text-lh-secondary-text mb-1.5 uppercase tracking-wider">
            <Filter className="inline w-3 h-3 mr-1" />
            Branch
          </label>
          <select
            value={filters.branch}
            onChange={(e) => onFilterChange({ ...filters, branch: e.target.value as Branch | 'All' })}
            className="w-full px-4 py-3 border-2 border-lh-border rounded-xl font-poppins text-lh-text focus:outline-none focus:border-lh-blue focus:ring-4 focus:ring-lh-blue/10 transition-all bg-white"
          >
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch === 'All' ? 'All Branches' : branch}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex-1">
          <label className="block text-xs font-semibold font-poppins text-lh-secondary-text mb-1.5 uppercase tracking-wider">
            <Filter className="inline w-3 h-3 mr-1" />
            Status
          </label>
          <select
            value={filters.onboardingStatus}
            onChange={(e) => onFilterChange({ ...filters, onboardingStatus: e.target.value as OnboardingStatus | 'All' })}
            className="w-full px-4 py-3 border-2 border-lh-border rounded-xl font-poppins text-lh-text focus:outline-none focus:border-lh-blue focus:ring-4 focus:ring-lh-blue/10 transition-all bg-white"
          >
            <option value="All">All Status</option>
            <option value="Done">Active</option>
            <option value="In progress">New Members</option>
            <option value="Not started">Not Started</option>
          </select>
        </div>
      </div>

      {/* Active Filters & Results */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm font-poppins text-lh-secondary-text">
          Showing <span className="font-bold text-lh-blue">{resultCount}</span> of{' '}
          <span className="font-bold text-lh-text">{totalCount}</span> teammates
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-lh-red text-white rounded-lg font-poppins font-semibold text-sm hover:bg-lh-red/90 transition-all duration-300 group"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

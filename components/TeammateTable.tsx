import { Teammate } from '@/types';
import { Mail, Phone, Calendar, Linkedin, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState, useMemo } from 'react';

interface TeammateTableProps {
  teammates: Teammate[];
}

type SortField = keyof Teammate | 'none';
type SortDirection = 'asc' | 'desc' | 'none';

export function TeammateTable({ teammates }: TeammateTableProps) {
  const [sortField, setSortField] = useState<SortField>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');

  // Sort teammates
  const sortedTeammates = useMemo(() => {
    if (sortField === 'none') return teammates;

    return [...teammates].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle undefined values
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      // Default comparison
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [teammates, sortField, sortDirection]);

  // Handle column header click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> none
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection('none');
        setSortField('none');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon for column
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-lh-secondary-text" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-4 h-4 text-lh-blue" />;
    }
    return <ArrowDown className="w-4 h-4 text-lh-blue" />;
  };

  // Get department badge color
  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'Leadership':
        return 'bg-lh-yellow text-lh-text';
      case 'Sales':
        return 'bg-lh-red text-white';
      case 'Operations':
        return 'bg-lh-light-blue text-white';
      default:
        return 'bg-lh-blue text-white';
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'In progress':
        return 'bg-lh-yellow text-lh-text dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Not started':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden animate-fade-in">
      {/* Table wrapper with horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-lh-gradient text-white">
            <tr>
              {/* Photo */}
              <th className="px-4 py-4 text-left text-sm font-semibold font-poppins whitespace-nowrap">
                Photo
              </th>

              {/* Name - Sortable */}
              <th 
                className="px-4 py-4 text-left text-sm font-semibold font-poppins whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => handleSort('fullName')}
              >
                <div className="flex items-center gap-2">
                  Name
                  {getSortIcon('fullName')}
                </div>
              </th>

              {/* Position - Sortable */}
              <th 
                className="px-4 py-4 text-left text-sm font-semibold font-poppins whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => handleSort('position')}
              >
                <div className="flex items-center gap-2">
                  Position
                  {getSortIcon('position')}
                </div>
              </th>

              {/* Department - Sortable */}
              <th 
                className="px-4 py-4 text-left text-sm font-semibold font-poppins whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => handleSort('department')}
              >
                <div className="flex items-center gap-2">
                  Department
                  {getSortIcon('department')}
                </div>
              </th>

              {/* Branch - Sortable */}
              <th 
                className="px-4 py-4 text-left text-sm font-semibold font-poppins whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => handleSort('branch')}
              >
                <div className="flex items-center gap-2">
                  Branch
                  {getSortIcon('branch')}
                </div>
              </th>

              {/* Email */}
              <th className="px-4 py-4 text-left text-sm font-semibold font-poppins whitespace-nowrap">
                Email
              </th>

              {/* Phone */}
              <th className="px-4 py-4 text-left text-sm font-semibold font-poppins whitespace-nowrap">
                Phone
              </th>

              {/* NMLS */}
              <th className="px-4 py-4 text-left text-sm font-semibold font-poppins whitespace-nowrap">
                NMLS
              </th>

              {/* Manager - Sortable */}
              <th 
                className="px-4 py-4 text-left text-sm font-semibold font-poppins whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => handleSort('manager')}
              >
                <div className="flex items-center gap-2">
                  Manager
                  {getSortIcon('manager')}
                </div>
              </th>

              {/* Status - Sortable */}
              <th 
                className="px-4 py-4 text-left text-sm font-semibold font-poppins whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => handleSort('onboardingStatus')}
              >
                <div className="flex items-center gap-2">
                  Status
                  {getSortIcon('onboardingStatus')}
                </div>
              </th>

              {/* Actions */}
              <th className="px-4 py-4 text-left text-sm font-semibold font-poppins whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-lh-border">
            {sortedTeammates.map((teammate, index) => (
              <tr
                key={teammate.id}
                className="hover:bg-muted/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Photo */}
                <td className="px-4 py-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-lh-blue to-lh-light-blue flex items-center justify-center">
                    {teammate.headshotUrl ? (
                      <img
                        src={teammate.headshotUrl}
                        alt={teammate.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-poppins font-bold text-sm">
                        {teammate.firstName[0]}{teammate.lastName[0]}
                      </span>
                    )}
                  </div>
                </td>

                {/* Name */}
                <td className="px-4 py-4">
                  <div className="font-poppins font-semibold text-foreground whitespace-nowrap">
                    {teammate.fullName}
                  </div>
                </td>

                {/* Position */}
                <td className="px-4 py-4">
                  <div className="font-poppins text-sm text-muted-foreground">
                    {teammate.position}
                  </div>
                </td>

                {/* Department */}
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-poppins ${getDepartmentColor(teammate.department)}`}>
                    {teammate.department === 'Leadership' && '💡 '}
                    {teammate.department === 'Sales' && '🎯 '}
                    {teammate.department === 'Operations' && '⚙ '}
                    {teammate.department}
                  </span>
                </td>

                {/* Branch */}
                <td className="px-4 py-4">
                  <div className="font-poppins text-sm text-foreground whitespace-nowrap">
                    {teammate.branch}
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-4">
                  <a
                    href={`mailto:${teammate.email}`}
                    className="font-poppins text-sm text-lh-blue hover:text-lh-dark-blue hover:underline whitespace-nowrap"
                  >
                    {teammate.email}
                  </a>
                </td>

                {/* Phone */}
                <td className="px-4 py-4">
                  {teammate.phone ? (
                    <a
                      href={`tel:${teammate.phone}`}
                      className="font-poppins text-sm text-lh-blue hover:text-lh-dark-blue hover:underline whitespace-nowrap"
                    >
                      {teammate.phone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </td>

                {/* NMLS */}
                <td className="px-4 py-4">
                  {teammate.nmls ? (
                    <span className="font-poppins text-sm text-foreground whitespace-nowrap">
                      {teammate.nmls}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </td>

                {/* Manager */}
                <td className="px-4 py-4">
                  {teammate.manager ? (
                    <span className="font-poppins text-sm text-foreground whitespace-nowrap">
                      {teammate.manager}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-poppins whitespace-nowrap ${getStatusColor(teammate.onboardingStatus)}`}>
                    {teammate.onboardingStatus}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${teammate.email}`}
                      className="p-2 text-lh-blue hover:bg-lh-blue hover:text-white rounded-lg transition-all"
                      title="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    {teammate.phone && (
                      <a
                        href={`tel:${teammate.phone}`}
                        className="p-2 text-lh-blue hover:bg-lh-blue hover:text-white rounded-lg transition-all"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                    {teammate.calendly && (
                      <a
                        href={teammate.calendly}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-lh-blue hover:bg-lh-blue hover:text-white rounded-lg transition-all"
                        title="Schedule"
                      >
                        <Calendar className="w-4 h-4" />
                      </a>
                    )}
                    {teammate.linkedIn && (
                      <a
                        href={teammate.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-lh-blue hover:bg-lh-blue hover:text-white rounded-lg transition-all"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedTeammates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground font-poppins">No teammates found</p>
        </div>
      )}
    </div>
  );
}

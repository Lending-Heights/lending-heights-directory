import { Download } from 'lucide-react';
import { Teammate } from '@/types';

interface ExportButtonProps {
  teammates: Teammate[];
  filename?: string;
}

export function ExportButton({ teammates, filename = 'lending-heights-team-directory' }: ExportButtonProps) {
  const exportToCSV = () => {
    // Define CSV headers
    const headers = [
      'Full Name',
      'First Name',
      'Last Name',
      'Position',
      'Department',
      'Branch',
      'Email',
      'Phone',
      'NMLS',
      'Manager',
      'Start Date',
      'Birthday',
      'Status',
      'LinkedIn',
      'Calendly',
      'Tags'
    ];

    // Convert teammates to CSV rows
    const rows = teammates.map(teammate => [
      teammate.fullName,
      teammate.firstName,
      teammate.lastName,
      teammate.position,
      teammate.department,
      teammate.branch,
      teammate.email,
      teammate.phone || '',
      teammate.nmls || '',
      teammate.manager || '',
      teammate.startDate || '',
      teammate.birthday || '',
      teammate.onboardingStatus,
      teammate.linkedIn || '',
      teammate.calendly || '',
      teammate.tags?.join('; ') || ''
    ]);

    // Escape and quote CSV values
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    // Build CSV content
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 px-4 py-2.5 bg-lh-blue text-white rounded-lg font-poppins font-semibold text-sm hover:bg-lh-dark-blue transition-all duration-300 shadow-md hover:shadow-lg group"
    >
      <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span className="hidden sm:inline">Export CSV</span>
      <span className="sm:hidden">Export</span>
    </button>
  );
}

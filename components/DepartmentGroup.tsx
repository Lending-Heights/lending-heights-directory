import { Teammate, Department } from '@/types';
import { TeammateCard } from './TeammateCard';

interface DepartmentGroupProps {
  department: Department;
  teammates: Teammate[];
  startIndex: number;
}

export function DepartmentGroup({ department, teammates, startIndex }: DepartmentGroupProps) {
  if (teammates.length === 0) return null;

  const getDepartmentIcon = (dept: Department) => {
    switch (dept) {
      case 'Leadership':
        return '💡';
      case 'Sales':
        return '🎯';
      case 'Operations':
        return '⚙';
      default:
        return '👥';
    }
  };

  const getDepartmentColor = (dept: Department) => {
    switch (dept) {
      case 'Leadership':
        return 'from-lh-yellow to-lh-yellow/80';
      case 'Sales':
        return 'from-lh-red to-lh-red/80';
      case 'Operations':
        return 'from-lh-light-blue to-lh-blue';
      default:
        return 'from-lh-blue to-lh-light-blue';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Department Header */}
      <div className="flex items-center gap-4">
        <div className={`h-1 flex-1 bg-gradient-to-r ${getDepartmentColor(department)} rounded-full`} />
        <h2 className="text-2xl md:text-3xl font-bold font-poppins text-lh-text flex items-center gap-3">
          <span className="text-3xl">{getDepartmentIcon(department)}</span>
          {department}
          <span className="text-lg font-semibold text-lh-secondary-text">
            ({teammates.length})
          </span>
        </h2>
        <div className={`h-1 flex-1 bg-gradient-to-r ${getDepartmentColor(department)} rounded-full`} />
      </div>

      {/* Teammates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teammates.map((teammate, index) => (
          <TeammateCard 
            key={teammate.id} 
            teammate={teammate} 
            index={startIndex + index}
          />
        ))}
      </div>
    </div>
  );
}

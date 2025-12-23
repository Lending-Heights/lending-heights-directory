import { Building2, Calendar, Briefcase } from 'lucide-react';

interface ProfileHeaderProps {
  teammate: any;
}

export function ProfileHeader({ teammate }: ProfileHeaderProps) {
  // Get department gradient
  const getDepartmentGradient = (dept: string) => {
    switch (dept) {
      case 'Leadership':
        return 'from-lh-blue via-lh-light-blue to-lh-yellow';
      case 'Sales':
        return 'from-lh-red via-lh-red to-lh-yellow';
      case 'Operations':
        return 'from-lh-light-blue via-lh-blue to-lh-dark-blue';
      default:
        return 'from-lh-blue to-lh-light-blue';
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800';
      case 'In progress':
        return 'bg-lh-yellow text-lh-text';
      case 'Not started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getDepartmentGradient(teammate.department)} p-8 md:p-12`}>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        {/* Headshot */}
        <div className="relative group">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm border-4 border-white shadow-2xl">
            {teammate.headshot_url ? (
              <img
                src={teammate.headshot_url}
                alt={teammate.full_name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/30">
                <span className="text-5xl md:text-6xl font-bold text-white font-poppins">
                  {teammate.first_name[0]}{teammate.last_name[0]}
                </span>
              </div>
            )}
          </div>

          {/* Status Badge on Photo */}
          {teammate.onboarding_status !== 'Done' && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-poppins ${getStatusColor(teammate.onboarding_status)} shadow-md`}>
                {teammate.onboarding_status === 'In progress' && '🚀 '}
                {teammate.onboarding_status}
              </span>
            </div>
          )}
        </div>

        {/* Name & Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white font-poppins mb-2 tracking-tight">
            {teammate.full_name}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 font-poppins font-semibold mb-4">
            {teammate.position}
          </p>

          {/* Quick Info Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            {/* Department */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <Briefcase className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white font-poppins">
                {teammate.department}
              </span>
            </div>

            {/* Branch */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <Building2 className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white font-poppins">
                {teammate.branch}
              </span>
            </div>

            {/* Start Date */}
            {teammate.start_date && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Calendar className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white font-poppins">
                  Since {new Date(teammate.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

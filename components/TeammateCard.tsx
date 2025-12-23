import { Teammate } from '@/types';
import { Mail, Phone, Calendar, Linkedin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface TeammateCardProps {
  teammate: Teammate;
  index: number;
}

export function TeammateCard({ teammate, index }: TeammateCardProps) {
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

  return (
    <div
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden animate-slide-up hover:-translate-y-2"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Gradient Header */}
      <div className={`h-32 bg-gradient-to-r ${getDepartmentGradient(teammate.department)} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
        
        {/* Status Badge */}
        {teammate.onboardingStatus !== 'Done' && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-poppins bg-white/90 backdrop-blur-sm text-lh-text shadow-lg">
              🚀 New Member
            </span>
          </div>
        )}
      </div>

      {/* Profile Photo */}
      <div className="relative px-6 -mt-16 mb-4">
        <Link href={`/directory/${teammate.id}`} className="block w-24 h-24 mx-auto">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white ring-4 ring-white shadow-xl cursor-pointer">
            {teammate.headshotUrl ? (
              <img
                src={teammate.headshotUrl}
                alt={teammate.fullName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-lh-blue to-lh-light-blue">
                <span className="text-white font-poppins font-bold text-2xl">
                  {teammate.firstName[0]}{teammate.lastName[0]}
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {/* Name & Position - Clickable to Profile */}
        <Link href={`/directory/${teammate.id}`} className="block mb-4 group/link cursor-pointer">
          <h3 className="text-xl font-bold font-poppins text-lh-text text-center mb-1 group-hover/link:text-lh-blue transition-colors">
            {teammate.fullName}
          </h3>
          <p className="text-sm font-poppins text-lh-secondary-text text-center group-hover/link:text-lh-blue/80 transition-colors">
            {teammate.position}
          </p>
        </Link>

        {/* Branch */}
        <div className="flex items-center justify-center mb-4">
          <span className="text-xs font-poppins text-lh-secondary-text bg-lh-bg px-3 py-1.5 rounded-full">
            {teammate.branch}
          </span>
        </div>

        {/* Tags */}
        {teammate.tags && teammate.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {teammate.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-poppins bg-lh-blue/10 text-lh-blue"
              >
                {tag}
              </span>
            ))}
            {teammate.tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-poppins bg-lh-secondary-text/10 text-lh-secondary-text">
                +{teammate.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-lh-border my-4"></div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2">
          <a
            href={`mailto:${teammate.email}`}
            className="p-2 text-lh-blue hover:bg-lh-blue hover:text-white rounded-lg transition-all group/btn"
            title="Email"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          </a>
          
          {teammate.phone && (
            <a
              href={`tel:${teammate.phone}`}
              className="p-2 text-lh-blue hover:bg-lh-blue hover:text-white rounded-lg transition-all group/btn"
              title="Call"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </a>
          )}
          
          {teammate.calendly && (
            <a
              href={teammate.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-lh-blue hover:bg-lh-blue hover:text-white rounded-lg transition-all group/btn"
              title="Schedule"
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </a>
          )}
          
          {teammate.linkedIn && (
            <a
              href={teammate.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-lh-blue hover:bg-lh-blue hover:text-white rounded-lg transition-all group/btn"
              title="LinkedIn"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            </a>
          )}

          {/* View Profile Button */}
          <Link
            href={`/directory/${teammate.id}`}
            className="ml-auto p-2 text-lh-blue hover:bg-lh-blue hover:text-white rounded-lg transition-all group/btn"
            title="View Profile"
          >
            <ExternalLink className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
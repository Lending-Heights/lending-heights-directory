import { User, Building, Calendar, Cake, Users, Award } from 'lucide-react';

interface ProfileInfoProps {
  teammate: any;
}

export function ProfileInfo({ teammate }: ProfileInfoProps) {
  const infoItems = [
    {
      icon: User,
      label: 'Email',
      value: teammate.email,
      link: `mailto:${teammate.email}`,
      show: true,
    },
    {
      icon: User,
      label: 'Personal Email',
      value: teammate.personal_email,
      link: teammate.personal_email ? `mailto:${teammate.personal_email}` : undefined,
      show: !!teammate.personal_email,
    },
    {
      icon: Building,
      label: 'Department',
      value: teammate.department,
      show: true,
    },
    {
      icon: Building,
      label: 'Branch',
      value: teammate.branch,
      show: true,
    },
    {
      icon: Award,
      label: 'NMLS',
      value: teammate.nmls,
      show: !!teammate.nmls,
    },
    {
      icon: Users,
      label: 'Reports To',
      value: teammate.manager?.full_name || 'N/A',
      link: teammate.manager?.id ? `/teammate/${teammate.manager.id}` : undefined,
      show: true,
    },
    {
      icon: Calendar,
      label: 'Start Date',
      value: teammate.start_date
        ? new Date(teammate.start_date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
        : 'N/A',
      show: true,
    },
    {
      icon: Cake,
      label: 'Birthday',
      value: teammate.birthday_date
        ? new Date(teammate.birthday_date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
          })
        : 'N/A',
      show: !!teammate.birthday_date,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold font-poppins text-lh-text mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-lh-blue" />
        Profile Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {infoItems
          .filter(item => item.show)
          .map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl bg-lh-bg hover:bg-lh-border/30 transition-colors"
            >
              <div className="p-2 bg-lh-blue/10 rounded-lg flex-shrink-0">
                <item.icon className="w-5 h-5 text-lh-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-lh-secondary-text uppercase tracking-wide mb-1 font-poppins">
                  {item.label}
                </p>
                {item.link ? (
                  <a
                    href={item.link}
                    className="text-sm font-semibold text-lh-blue hover:text-lh-dark-blue hover:underline font-poppins break-words"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-lh-text font-poppins break-words">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

import {
  Mail,
  Phone,
  Calendar,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  ExternalLink,
} from 'lucide-react';

interface ProfileContactProps {
  teammate: any;
}

export function ProfileContact({ teammate }: ProfileContactProps) {
  const contactButtons = [
    {
      icon: Mail,
      label: 'Send Email',
      href: `mailto:${teammate.email}`,
      color: 'bg-lh-blue hover:bg-lh-dark-blue',
      show: !!teammate.email,
    },
    {
      icon: Phone,
      label: 'Call',
      href: `tel:${teammate.phone}`,
      color: 'bg-lh-light-blue hover:bg-lh-blue',
      show: !!teammate.phone,
    },
    {
      icon: Calendar,
      label: 'Schedule',
      href: teammate.calendly_link,
      color: 'bg-lh-yellow hover:bg-yellow-500',
      external: true,
      show: !!teammate.calendly_link,
    },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: teammate.linkedin_url,
      color: 'text-[#0077B5] hover:bg-[#0077B5]',
      show: !!teammate.linkedin_url,
    },
    {
      icon: Facebook,
      label: 'Facebook',
      href: teammate.facebook_url,
      color: 'text-[#1877F2] hover:bg-[#1877F2]',
      show: !!teammate.facebook_url,
    },
    {
      icon: Instagram,
      label: 'Instagram',
      href: teammate.instagram_url,
      color: 'text-[#E4405F] hover:bg-[#E4405F]',
      show: !!teammate.instagram_url,
    },
    {
      icon: Youtube,
      label: 'YouTube',
      href: teammate.youtube_url,
      color: 'text-[#FF0000] hover:bg-[#FF0000]',
      show: !!teammate.youtube_url,
    },
  ];

  const professionalLinks = [
    {
      label: 'ARIVE',
      href: teammate.arive_link,
      show: !!teammate.arive_link,
    },
    {
      label: 'Lead Link',
      href: teammate.lead_link,
      show: !!teammate.lead_link,
    },
    {
      label: 'Mortgage Matchup',
      href: teammate.mortgage_matchup_url,
      show: !!teammate.mortgage_matchup_url,
    },
  ];

  return (
    <div className="sticky top-8 space-y-6">
      {/* Contact Actions */}
      <div className="bg-lh-bg rounded-xl p-6">
        <h3 className="text-lg font-bold font-poppins text-lh-text mb-4">
          Contact
        </h3>
        <div className="space-y-3">
          {contactButtons
            .filter(btn => btn.show)
            .map((btn, index) => (
              <a
                key={index}
                href={btn.href}
                target={btn.external ? '_blank' : undefined}
                rel={btn.external ? 'noopener noreferrer' : undefined}
                className={`
                  flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg
                  text-white font-poppins font-semibold text-sm
                  transition-all duration-300 shadow-md hover:shadow-lg
                  ${btn.color}
                  group
                `}
              >
                <btn.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {btn.label}
                {btn.external && (
                  <ExternalLink className="w-4 h-4 ml-auto opacity-70" />
                )}
              </a>
            ))}
        </div>
      </div>

      {/* Social Media */}
      {socialLinks.some(link => link.show) && (
        <div className="bg-lh-bg rounded-xl p-6">
          <h3 className="text-lg font-bold font-poppins text-lh-text mb-4">
            Social Media
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {socialLinks
              .filter(link => link.show)
              .map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg
                    bg-white border-2 border-lh-border
                    hover:text-white hover:border-transparent
                    transition-all duration-300
                    ${link.color}
                    group
                  `}
                >
                  <link.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold font-poppins">
                    {link.label}
                  </span>
                </a>
              ))}
          </div>
        </div>
      )}

      {/* Professional Links */}
      {professionalLinks.some(link => link.show) && (
        <div className="bg-lh-bg rounded-xl p-6">
          <h3 className="text-lg font-bold font-poppins text-lh-text mb-4">
            Professional Links
          </h3>
          <div className="space-y-2">
            {professionalLinks
              .filter(link => link.show)
              .map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-white border border-lh-border hover:border-lh-blue hover:bg-lh-blue/5 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-lh-blue" />
                    <span className="text-sm font-semibold font-poppins text-lh-text">
                      {link.label}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-lh-secondary-text group-hover:text-lh-blue transition-colors" />
                </a>
              ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-lh-blue to-lh-light-blue rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold font-poppins mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-poppins opacity-90">Status</span>
            <span className="text-sm font-bold font-poppins">
              {teammate.onboarding_status}
            </span>
          </div>
          {teammate.start_date && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-poppins opacity-90">Tenure</span>
              <span className="text-sm font-bold font-poppins">
                {(() => {
                  const start = new Date(teammate.start_date);
                  const now = new Date();
                  const months = Math.floor(
                    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
                  );
                  const years = Math.floor(months / 12);
                  const remainingMonths = months % 12;
                  if (years > 0) {
                    return `${years}y ${remainingMonths}m`;
                  }
                  return `${months}m`;
                })()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

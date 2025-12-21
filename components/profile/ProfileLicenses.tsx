import { Award, CheckCircle2 } from 'lucide-react';

interface ProfileLicensesProps {
  licenses: Array<{
    id: string;
    state_code: string;
    license_number?: string;
    license_date?: string;
    expiration_date?: string;
    state?: {
      state_name: string;
    };
  }>;
}

export function ProfileLicenses({ licenses }: ProfileLicensesProps) {
  // Check if license is expiring soon (within 60 days)
  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 60 && daysUntilExpiry > 0;
  };

  // Check if license is expired
  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold font-poppins text-lh-text mb-6 flex items-center gap-2">
        <Award className="w-6 h-6 text-lh-blue" />
        Licensed States
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {licenses.map((license) => (
          <div
            key={license.id}
            className="p-5 rounded-xl bg-gradient-to-br from-lh-bg to-white border border-lh-border hover:border-lh-blue transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold font-poppins text-lh-text">
                    {license.state_code}
                  </h3>
                  {!isExpired(license.expiration_date) && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-lh-secondary-text font-poppins">
                  {license.state?.state_name || 'Unknown State'}
                </p>
              </div>
            </div>

            {license.license_number && (
              <div className="mb-2">
                <p className="text-xs text-lh-secondary-text uppercase tracking-wide font-poppins font-semibold mb-1">
                  License #
                </p>
                <p className="text-sm font-mono text-lh-text font-semibold">
                  {license.license_number}
                </p>
              </div>
            )}

            {license.expiration_date && (
              <div>
                <p className="text-xs text-lh-secondary-text uppercase tracking-wide font-poppins font-semibold mb-1">
                  Expires
                </p>
                <p className={`text-sm font-poppins font-semibold ${
                  isExpired(license.expiration_date)
                    ? 'text-red-600'
                    : isExpiringSoon(license.expiration_date)
                    ? 'text-orange-600'
                    : 'text-green-600'
                }`}>
                  {new Date(license.expiration_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {isExpired(license.expiration_date) && ' (Expired)'}
                  {isExpiringSoon(license.expiration_date) && ' (Expiring Soon)'}
                </p>
              </div>
            )}

            {license.license_date && (
              <div className="mt-3 pt-3 border-t border-lh-border">
                <p className="text-xs text-lh-secondary-text font-poppins">
                  Licensed since{' '}
                  {new Date(license.license_date).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-lh-blue/5 border border-lh-blue/20 rounded-lg">
        <p className="text-sm text-lh-secondary-text font-poppins">
          💡 <span className="font-semibold">Licensed in {licenses.length} state{licenses.length !== 1 ? 's' : ''}</span>
        </p>
      </div>
    </div>
  );
}

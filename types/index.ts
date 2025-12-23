export type Department = 'Leadership' | 'Sales' | 'Operations';

export type Branch = 
  | '🌉 Pittsburgh (HQ)' 
  | '🍑 Savannah' 
  | '🔔 Philadelphia' 
  | '🌊 Erie PA' 
  | '🖼️ ELG'
  | '💥 Prosper Firm'
  | 'Champion Lending Group'
  | 'Keswick Mortgage Group'
  | '🌅 LH California'
  | 'WTX Lending';

export type OnboardingStatus = 'Not started' | 'In progress' | 'Done' | 'Offboard';

export interface Teammate {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  position: string;
  department: Department;
  branch: Branch;
  nmls?: string;
  headshotUrl?: string;
  startDate?: string;
  birthday?: string;
  manager?: string;
  onboardingStatus: OnboardingStatus;
  tags?: string[];
  linkedIn?: string;
  calendly?: string;
}

export interface FilterState {
  search: string;
  department: Department | 'All';
  branch: Branch | 'All';
  onboardingStatus: OnboardingStatus | 'All';
}

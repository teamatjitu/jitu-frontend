export interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  suffix?: string;
}

export interface ScoreData {
  to: string;
  total: number;
  pu: number;
  ppu: number;
  pbm: number;
  pk: number;
  literasiIndo: number;
  literasiEng: number;
}

export interface Subtest {
  id: string;
  label: string;
  color: string;
  hoverColor: string;
}

export interface MenuItem {
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  items?: {
    icon: React.ElementType;
    label: string;
    description?: string;
    toggle?: boolean;
    link?: boolean;
  }[];
  action?: string;
}

export interface DailyProblem {
  question: string;
  options: string[];
  answer: number; // index of the correct option
}

export interface Package {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  features: string[];
  originalPrice: number;
  discount: number;
  finalPrice: number;
  savings: number;
  badge?: string;
  categoryBg: string;
}

export interface TryOutCard {
  id: number;
  title: string;
  number: string;
  canEdit: boolean;
  participants: number;
  badge: string;
}

export interface Stat {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

export interface Subject {
  id: number;
  title: string;
  count: number;
  icon: React.ElementType;
  gradient: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

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

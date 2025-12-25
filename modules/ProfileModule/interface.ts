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

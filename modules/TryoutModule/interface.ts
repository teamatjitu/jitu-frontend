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

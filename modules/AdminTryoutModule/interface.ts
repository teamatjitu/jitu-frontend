export interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  suffix?: string;
}

export interface AdminTryoutStatsResponse {
  totalTryout: number;
  totalActiveTryout: number;
  totalUpcomingTryout: number;
}

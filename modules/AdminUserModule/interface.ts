export interface AdminUserStatsResponse {
  totalUser: number;
  activeUser: number;
  totalAdmin: number;
}

export interface AdminUserResponse {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "USER" | "ADMIN";
  tokenBalance: number;
  target?: string;
  createdAt: Date;
}

export interface TokenTransaction {
  id: string;
  amount: number;
  type: string;
  referenceId?: string;
  createdAt: Date;
}

export interface TryOutAttempt {
  id: string;
  tryOut: { title: string };
  totalScore: number;
  status: string;
  startedAt: Date;
  finishedAt?: Date;
}

export interface StatCardProps {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  suffix?: string;
  value: number;
}

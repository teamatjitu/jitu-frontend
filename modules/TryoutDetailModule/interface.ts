export interface TryoutDetail {
  id: number;
  title: string;
  number: string;
  badge: string;
  participants: number;
  description: string;
  duration: number;
  totalQuestions: number;
  startDate: string;
  endDate: string;
  isRegistered: boolean;
  isFree: boolean;
  tokenCost?: number;
  categories: CategoryDetail[];
  benefits: string[];
  requirements: string[];
}

export interface CategoryDetail {
  id: number;
  name: string;
  questionCount: number;
  duration: number;
}

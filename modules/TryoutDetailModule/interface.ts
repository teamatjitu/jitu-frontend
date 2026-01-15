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
  latestFinishedAttemptId?: string | null;
  latestAttemptStatus?: 'IN_PROGRESS' | 'FINISHED' | null;

}

export interface CategoryDetail {
  id: number;
  name: string;
  questionCount: number;
  duration: number;
  isCompleted?: boolean; // Track if subtest is completed
}

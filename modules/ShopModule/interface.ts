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

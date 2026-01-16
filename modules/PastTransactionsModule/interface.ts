export interface PastTransaction {
  id: string;
  amount: number;
  type: string;
  referenceId: string | null;
  createdAt: Date;
  userId: string;
  totalPrice: number;
  packageName: string;
}

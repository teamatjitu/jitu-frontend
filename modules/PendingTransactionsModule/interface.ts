export interface PendingTransaction {
  id: string;
  amount: number;
  type: string;
  referenceId: string | null;
  createdAt: Date;
  userId: string;
  totalPrice: number;
  packageName: string;
}

export interface TransactionData {
  id: string;
  amount: number;
  type: string;
  referenceId: string | null;
  createdAt: Date;
  userId: string;
  qris: string;
  totalPrice: number;
}

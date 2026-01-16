import { BACKEND_URL } from "../api";

export interface Payment {
  id: string;
  userId: string;
  tokenPackageId: string;
  amount: number;
  tokenAmount: number;
  status: "PENDING" | "CONFIRMED" | "DECLINED" | "CANCELLED";
  paymentMethod: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  tokenPackage: {
    name: string;
  };
}

export interface PaymentStats {
  totalRevenue: number;
  totalSuccess: number;
  totalPending: number;
}

export const getPayments = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status && status !== "ALL") queryParams.append("status", status);
  if (search) queryParams.append("search", search);

  const response = await fetch(`${BACKEND_URL}/admin/payments?${queryParams.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }
  return response.json();
};

export const getPaymentStats = async (): Promise<PaymentStats> => {
  const response = await fetch(`${BACKEND_URL}/admin/payments/stats`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch payment stats");
  }
  return response.json();
};

export const confirmPayment = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/admin/payments/${id}/confirm`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to confirm payment");
  }
  return response.json();
};

export const rejectPayment = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/admin/payments/${id}/reject`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to reject payment");
  }
  return response.json();
};

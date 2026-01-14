import { BACKEND_URL } from "../api";
import { AdminUserResponse, AdminUserStatsResponse } from "@/modules/AdminUserModule/interface";

export const getUserStats = async (): Promise<AdminUserStatsResponse> => {
  // Placeholder API, replace with actual endpoint when available
  // Assuming GET /admin/user/stats or similar
  // For now, mocking or reusing existing generic if possible, but let's assume specific endpoint.
  // Since controller has getAllUsers, we might need to compute stats or add an endpoint.
  // I will use a mock response for now to unblock UI dev if backend endpoint is missing for stats.
  // Wait, AdminController has getDashboardStats, maybe it includes user stats?
  // Let's check AdminService.getDashboardStats in backend.
  
  // Checking backend AdminService...
  // It likely returns aggregate stats. I'll fetch /admin/stats and map it if possible, 
  // or just fetch all users and calculate length if dataset is small (temporary).
  
  // Let's assume we implement/use /admin/stats for now which might have user count.
  const response = await fetch(`${BACKEND_URL}/admin/stats`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user stats");
  }
  
  const data = await response.json();
  // Mapping assuming backend returns { totalUser: ..., etc } inside the stats object or we adapt.
  return {
    totalUser: data.totalUser || 0,
    activeUser: data.activeUser || 0,
    totalAdmin: data.totalAdmin || 0
  };
};

export const getAllUsers = async (page = 1, limit = 10) => {
  const response = await fetch(`${BACKEND_URL}/admin/user?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const getUserById = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/admin/user/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }
  return response.json();
};

export const getUserTransactions = async (id: string, page = 1, limit = 10) => {
  const response = await fetch(`${BACKEND_URL}/admin/user/${id}/transactions?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user transactions");
  }
  return response.json();
};

export const getUserTryouts = async (id: string, page = 1, limit = 10) => {
  const response = await fetch(`${BACKEND_URL}/admin/user/${id}/tryouts?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user tryouts");
  }
  return response.json();
};

export const resetUserTryout = async (attemptId: string) => {
  const response = await fetch(`${BACKEND_URL}/admin/user/attempt/${attemptId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to reset tryout attempt");
  }
  return response.json();
};

export const deleteUser = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/admin/user/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
  return response.json();
};

export interface TopupTokenPayload {
  amount: number;
  description: string;
}

export const manualTokenAdjustment = async (
  userId: string,
  data: TopupTokenPayload
) => {
  const response = await fetch(`${BACKEND_URL}/admin/user/${userId}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to adjust token balance");
  }
  return response.json();
};

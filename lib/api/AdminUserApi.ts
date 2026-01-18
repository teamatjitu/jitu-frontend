import { BACKEND_URL } from "../api";
import {
  AdminUserResponse,
  AdminUserStatsResponse,
} from "@/modules/AdminUserModule/interface";

export const getUserStats = async (): Promise<AdminUserStatsResponse> => {
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
    totalAdmin: data.totalAdmin || 0,
  };
};

export const getAllUsers = async (
  page = 1,
  limit = 10,
  search?: string,
  role?: string
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) queryParams.append("search", search);
  if (role) queryParams.append("role", role);

  const response = await fetch(
    `${BACKEND_URL}/admin/user?${queryParams.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

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
  const response = await fetch(
    `${BACKEND_URL}/admin/user/${id}/transactions?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user transactions");
  }
  return response.json();
};

export const getUserTryouts = async (id: string, page = 1, limit = 10) => {
  const response = await fetch(
    `${BACKEND_URL}/admin/user/${id}/tryouts?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user tryouts");
  }
  return response.json();
};

export const resetUserTryout = async (attemptId: string) => {
  const response = await fetch(
    `${BACKEND_URL}/admin/user/attempt/${attemptId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to reset tryout attempt");
  }
  return response.json();
};

export interface UpdateUserPayload {
  name?: string;
  role?: string;
  password?: string;
  tokenBalance?: number;
}

export const updateUser = async (id: string, data: UpdateUserPayload) => {
  const response = await fetch(`${BACKEND_URL}/admin/user/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update user details");
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

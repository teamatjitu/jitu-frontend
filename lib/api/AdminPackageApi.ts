import { BACKEND_URL } from "../api";

export interface TokenPackage {
  id: string;
  name: string;
  tokenAmount: number;
  price: number;
  isActive: boolean;
  _count?: {
    payments: number;
  };
}

export interface CreatePackagePayload {
  name: string;
  tokenAmount: number;
  price: number;
  isActive?: boolean;
}

export const getPackages = async (): Promise<TokenPackage[]> => {
  const response = await fetch(`${BACKEND_URL}/admin/shop/packages`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch packages");
  }
  return response.json();
};

export const createPackage = async (data: CreatePackagePayload) => {
  const response = await fetch(`${BACKEND_URL}/admin/shop/packages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create package");
  }
  return response.json();
};

export const updatePackage = async (id: string, data: Partial<CreatePackagePayload>) => {
  const response = await fetch(`${BACKEND_URL}/admin/shop/packages/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update package");
  }
  return response.json();
};

export const togglePackageStatus = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/admin/shop/packages/${id}/status`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to toggle package status");
  }
  return response.json();
};

export const deletePackage = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/admin/shop/packages/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete package");
  }
  return response.json();
};

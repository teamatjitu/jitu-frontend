import { BACKEND_URL } from "../api";

export interface QuestionItem {
  id?: string;
  content: string;
  isCorrect: boolean;
  order: number;
}

export interface Question {
  id: string;
  subtestId: string;
  type: "PILIHAN_GANDA" | "ISIAN_SINGKAT" | "BENAR_SALAH";
  content: string; // HTML string from Tiptap
  explanation?: string;
  points: number;
  correctAnswer?: string; // For ISIAN_SINGKAT
  items: QuestionItem[];
}

export interface CreateQuestionPayload {
  type: "PILIHAN_GANDA" | "ISIAN_SINGKAT" | "BENAR_SALAH";
  content: string;
  explanation?: string;
  points: number;
  correctAnswer?: string; // Optional, mainly for ISIAN_SINGKAT
  items?: Omit<QuestionItem, "id">[]; // Optional for ISIAN_SINGKAT
}

// Upload Image for Tiptap
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BACKEND_URL}/admin/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = "Gagal mengupload gambar";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore JSON parse error, use default message
    }
    throw new Error(errorMessage);
  }
  return response.json(); // returns { url: string }
};

export const getQuestionsBySubtest = async (subtestId: string): Promise<Question[]> => {
  const response = await fetch(
    `${BACKEND_URL}/admin/subtests/${subtestId}/questions`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil daftar soal");
  }
  return response.json();
};

export const createQuestion = async (subtestId: string, data: CreateQuestionPayload) => {
  const response = await fetch(
    `${BACKEND_URL}/admin/subtests/${subtestId}/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal membuat soal");
  }
  return response.json();
};

export const updateQuestion = async (id: string, data: CreateQuestionPayload) => {
  const response = await fetch(`${BACKEND_URL}/admin/questions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal memperbarui soal");
  }
  return response.json();
};

export const deleteQuestion = async (id: string) => {
  const response = await fetch(`${BACKEND_URL}/admin/questions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Gagal menghapus soal");
  }
  return response.json();
};

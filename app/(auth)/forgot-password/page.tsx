"use client";

"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/auth-client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Gunakan requestPasswordReset sesuai export di auth-client.ts
    const { data, error } = await requestPasswordReset({
      email: email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      toast.error(error.message || "Gagal mengirim permintaan reset password");
      return;
    }

    toast.success("Link reset password telah dikirim ke email Anda!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 border p-6 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">Lupa Password?</h1>
        <p className="text-gray-500 text-center">
          Masukkan email Anda untuk menerima link reset password.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@contoh.com"
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Kirim Link Reset"}
        </button>
      </form>
    </div>
  );
}

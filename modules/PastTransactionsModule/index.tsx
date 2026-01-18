"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { CoinsIcon, Loader2, DollarSign, Clock } from "lucide-react";
import { PastTransaction } from "./interface";

import { BACKEND_URL } from "@/lib/api";

const PastTransactionsModule = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<PastTransaction[]>([]);

  useEffect(() => {
    async function fetchPastTransactions() {
      setIsLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/shop/past`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data transaksi past.");
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error: any) {
        toast.error(error.message || "Terjadi kesalahan tak terduga.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPastTransactions();
  }, []);

  return (
    <div className="min-h-screen pl-20 bg-gray-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="pt-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Transaksi Lama</h1>
          </div>
          <p className="text-gray-600">
            Cek daftar transaksi token try out yang sudah kamu lakukan
            sebelumnya.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-600 py-20">
            Tidak ada transaksi.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transactions.map((tx) => (
              <Card
                key={tx.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {tx.type === "PAID" ? (
                        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          PAID
                        </span>
                      ) : tx.type === "CANCELLED" ? (
                        <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          CANCELLED
                        </span>
                      ) : (
                        <span className="bg-gray-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          {tx.type}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-4 transition-colors">
                    {tx.packageName}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Rp{tx.totalPrice.toLocaleString("id")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <CoinsIcon className="w-4 h-4" />
                      {tx.amount} Token
                    </div>
                  </div>

                  <div className="flex items-center pt-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600 ml-1">
                      Dibuat pada:{" "}
                      {new Date(tx.createdAt).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastTransactionsModule;

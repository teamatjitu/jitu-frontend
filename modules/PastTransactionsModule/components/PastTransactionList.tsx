"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { CoinsIcon, Loader2, DollarSign, Clock } from "lucide-react";
import { PastTransaction } from "../interface";
import { BACKEND_URL } from "@/lib/api";

const PastTransactionList = () => {
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
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-gray-500 py-10 text-sm">
          Tidak ada riwayat transaksi.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions.map((tx) => (
            <Card
              key={tx.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {tx.type === "PAID" ? (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">
                        BERHASIL
                      </span>
                    ) : tx.type === "CANCELLED" ? (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full">
                        DIBATALKAN
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-full">
                        {tx.type}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-3 transition-colors line-clamp-1">
                  {tx.packageName}
                </h3>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-xs font-medium text-slate-600">
                      Rp{tx.totalPrice.toLocaleString("id")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <CoinsIcon className="w-3 h-3" />
                    {tx.amount} Token
                  </div>
                </div>

                <div className="flex items-center mt-2 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(tx.createdAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastTransactionList;
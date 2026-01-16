"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  getUserById,
  getUserTransactions,
  getUserTryouts,
  resetUserTryout,
} from "@/lib/api/AdminUserApi";
import {
  AdminUserResponse,
  TokenTransaction,
  TryOutAttempt,
} from "@/modules/AdminUserModule/interface";
import { UserInfoCard } from "./components/UserInfoCard";
import { UserTransactionsTable } from "./components/UserTransactionsTable";
import { UserTryoutsTable } from "./components/UserTryoutsTable";

interface AdminUserDetailModuleProps {
  userId: string;
}

const AdminUserDetailModule: React.FC<AdminUserDetailModuleProps> = ({
  userId,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<AdminUserResponse | null>(null);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [tryouts, setTryouts] = useState<TryOutAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states (simplified for now, can be expanded)
  const [txPage, setTxPage] = useState(1);
  const [tryoutPage, setTryoutPage] = useState(1);

  const fetchUser = useCallback(async () => {
    try {
      const data = await getUserById(userId);
      setUser(data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat detail user");
    }
  }, [userId]);

  const fetchTransactions = useCallback(async () => {
    try {
      const data = await getUserTransactions(userId, txPage);
      if (data.data) setTransactions(data.data);
    } catch (error) {
      console.error(error);
    }
  }, [userId, txPage]);

  const fetchTryouts = useCallback(async () => {
    try {
      const data = await getUserTryouts(userId, tryoutPage);
      if (data.data) setTryouts(data.data);
    } catch (error) {
      console.error(error);
    }
  }, [userId, tryoutPage]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchUser(), fetchTransactions(), fetchTryouts()]);
      setIsLoading(false);
    };
    init();
  }, [fetchUser, fetchTransactions, fetchTryouts]);

  const handleResetAttempt = async (attemptId: string) => {
    if (confirm("Reset pengerjaan ini? User harus mengerjakan ulang dari awal. Data jawaban akan dihapus permanen.")) {
      try {
        await resetUserTryout(attemptId);
        toast.success("Pengerjaan tryout berhasil direset");
        fetchTryouts(); // Refresh list
      } catch (error) {
        console.error(error);
        toast.error("Gagal mereset pengerjaan tryout");
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Memuat data user...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-red-500">User tidak ditemukan</div>;
  }

  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Detail User
          </h1>
          <p className="text-muted-foreground">
            Informasi lengkap dan riwayat aktivitas pengguna.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: User Info */}
        <div className="md:col-span-1">
          <UserInfoCard user={user} />
        </div>

        {/* Right Column: Tabs (Transactions & Tryouts) */}
        <div className="md:col-span-2">
          <Tabs defaultValue="tryouts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tryouts">Riwayat Tryout</TabsTrigger>
              <TabsTrigger value="transactions">Riwayat Transaksi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tryouts" className="mt-4">
              <UserTryoutsTable 
                attempts={tryouts} 
                isLoading={isLoading} 
                onReset={handleResetAttempt} 
              />
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-4">
              <UserTransactionsTable 
                transactions={transactions} 
                isLoading={isLoading} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailModule;

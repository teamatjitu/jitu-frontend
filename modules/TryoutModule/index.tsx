"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  Users,
  Search,
  Calendar,
  Filter,
  ArrowRight,
  Loader2,
  Coins,
} from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Config
import { BACKEND_URL } from "@/lib/api";

// Interface untuk data Tryout
interface TryOutData {
  id: string;
  title: string;
  number: string;
  participants: number;
  badge: string;
  solutionPrice: number; // 0 = Gratis
  isPublic: boolean;
  scheduledStart: string | null;
  scheduledEnd: string | null;
}

const TryoutModule = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // --- States ---
  const [tryouts, setTryouts] = useState<TryOutData[]>([]);
  const [filteredTryouts, setFilteredTryouts] = useState<TryOutData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "free" | "paid">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // --- Effects ---

  // 1. Fetch Data Tryout dari Backend
  useEffect(() => {
    const fetchTryouts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BACKEND_URL}/tryout`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Gagal mengambil data tryout");

        const data = await res.json();

        // Mapping response backend ke UI Frontend
        const mappedData: TryOutData[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          number: item.number || "?",
          participants: item.participants || 0,
          badge: item.badge || "SNBT",
          solutionPrice: item.solutionPrice || 0, // Fallback ke 0 jika tidak ada
          isPublic: item.isPublic ?? true,
          scheduledStart: item.scheduledStart,
          scheduledEnd: item.scheduledEnd,
        }));

        setTryouts(mappedData);
        setFilteredTryouts(mappedData);
      } catch (error) {
        console.error("Error fetching tryouts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTryouts();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    let result = [...tryouts];

    // Filter by Tab
    if (activeTab === "free") {
      result = result.filter((t) => t.solutionPrice === 0);
    } else if (activeTab === "paid") {
      result = result.filter((t) => t.solutionPrice > 0);
    }

    // Filter by Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(lowerQuery) ||
          t.badge.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.scheduledStart || 0).getTime();
      const dateB = new Date(b.scheduledStart || 0).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredTryouts(result);
  }, [tryouts, activeTab, searchQuery, sortOrder]);

  // --- Handlers ---

  const handleTryoutClick = (id: string) => {
    router.push(`/tryout/${id}`);
  };

  // --- Render ---

  return (
    <div className="min-h-screen pl-20 bg-gray-50/50 pt-24 pb-20 font-open-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Daftar Tryout
            </h1>
            <p className="text-gray-500 mt-1">
              Temukan tryout terbaik untuk persiapan ujianmu.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl w-full md:w-auto">
                <button 
                    onClick={() => setActiveTab("all")}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Semua
                </button>
                <button 
                    onClick={() => setActiveTab("free")}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "free" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Gratis
                </button>
                <button 
                    onClick={() => setActiveTab("paid")}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "paid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Premium
                </button>
            </div>

            {/* Search & Sort */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Cari judul tryout..." 
                        className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={sortOrder} onValueChange={(val: any) => setSortOrder(val)}>
                    <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Filter className="w-4 h-4" />
                            <SelectValue placeholder="Urutkan" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Terbaru</SelectItem>
                        <SelectItem value="oldest">Terlama</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
            <div className="flex justify-center items-center py-24">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        ) : filteredTryouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Tidak ada tryout ditemukan</h3>
                <p className="text-gray-500 mt-1">Coba ubah kata kunci atau filter pencarianmu.</p>
                <Button 
                    variant="link" 
                    className="mt-4 text-blue-600"
                    onClick={() => {setSearchQuery(""); setActiveTab("all");}}
                >
                    Reset Filter
                </Button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTryouts.map((tryout) => {
                    const isPaid = tryout.solutionPrice > 0;
                    
                    return (
                        <Card 
                            key={tryout.id} 
                            className="group border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white overflow-hidden"
                            onClick={() => handleTryoutClick(tryout.id)}
                        >
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                        {tryout.badge}
                                    </Badge>
                                    
                                    <div className="flex gap-2">
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">
                                            Akses Gratis
                                        </Badge>
                                        {isPaid && (
                                            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-[10px]">
                                                Solusi: {tryout.solutionPrice} Token
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                                    {tryout.title}
                                </h3>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>
                                            {tryout.scheduledStart ? new Date(tryout.scheduledStart).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "Jadwal Belum Tersedia"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span>{tryout.participants.toLocaleString()} Peserta</span>
                                    </div>
                                </div>

                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg group-hover:shadow-md transition-all">
                                    Lihat Detail
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default TryoutModule;

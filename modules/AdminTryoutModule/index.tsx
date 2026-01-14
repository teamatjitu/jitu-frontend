"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";
import { stats } from "./const";
import { AdminTryoutResponse, AdminTryoutStatsResponse } from "./interface";
import { getAllTryouts, getTryoutStats } from "@/lib/api/AdminTryoutApi";
import Link from "next/link";

const AdminTryoutModule = () => {
  const [valueStats, setValueStats] = useState<AdminTryoutStatsResponse | null>(
    null
  );

  const [tryouts, setTryouts] = useState<AdminTryoutResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, tryoutsData] = await Promise.all([
          getTryoutStats(),
          getAllTryouts(),
        ]);
        setValueStats(statsData);
        setTryouts(tryoutsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none">
            Aktif
          </Badge>
        );
      case "NOT_STARTED":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200 shadow-none"
          >
            Belum Rilis
          </Badge>
        );
      case "ENDED":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 shadow-none"
          >
            Selesai
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Kelola Tryout
          </h1>
          <p className="text-muted-foreground">
            Pantau statistik dan kelola semua tryout UTBK dalam satu tempat.
          </p>
        </div>
        <Link href={"create-to"}>
          <Button className="font-semibold shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Buat Tryout Baru
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          let value = 0;
          if (valueStats) {
            if (stat.label === "TOTAL TRYOUT") value = valueStats.totalTryout;
            else if (stat.label === "TRYOUT AKTIF")
              value = valueStats.totalActiveTryout;
            else if (stat.label === "SELESAI")
              value = valueStats.totalEndedTryout;
            else value = valueStats.totalUpcomingTryout;
          }

          return (
            <Card
              key={index}
              className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? "-" : value}
                </div>
                {stat.suffix && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.suffix}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tryout Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Daftar Tryout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nama Tryout</TableHead>
                  <TableHead>Harga (Token)</TableHead>
                  <TableHead>Tanggal Rilis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : tryouts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Belum ada tryout yang dibuat.
                    </TableCell>
                  </TableRow>
                ) : (
                  tryouts.map((tryout) => (
                    <TableRow key={tryout.code}>
                      <TableCell className="font-mono text-xs font-medium">
                        #{tryout.code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {tryout.title}
                      </TableCell>
                      <TableCell>
                        {tryout.solutionPrice > 0 ? (
                          <div className="flex items-center gap-1 font-medium text-amber-600">
                            <span>
                              {tryout.solutionPrice.toLocaleString("id-ID")}
                            </span>
                            <span className="text-xs">Token</span>
                          </div>
                        ) : (
                          <span className="text-green-600 font-medium">
                            Gratis
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(tryout.releaseDate).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(tryout.status)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/tryout/${tryout.id}`}>
                          <Button variant="outline" className="h-8">
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            Detail
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTryoutModule;

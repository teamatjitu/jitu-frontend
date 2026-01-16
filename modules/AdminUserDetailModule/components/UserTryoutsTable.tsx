import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { TryOutAttempt } from "@/modules/AdminUserModule/interface";

interface UserTryoutsTableProps {
  attempts: TryOutAttempt[];
  isLoading: boolean;
  onReset: (attemptId: string) => void;
}

export const UserTryoutsTable: React.FC<UserTryoutsTableProps> = ({
  attempts,
  isLoading,
  onReset,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "FINISHED":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none">
            Selesai
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 shadow-none">
            Sedang Mengerjakan
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Tryout</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Nilai</TableHead>
            <TableHead>Waktu Mulai</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Memuat data...
              </TableCell>
            </TableRow>
          ) : attempts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                Belum ada riwayat tryout.
              </TableCell>
            </TableRow>
          ) : (
            attempts.map((attempt) => (
              <TableRow key={attempt.id}>
                <TableCell className="font-medium">
                  {attempt.tryOut.title}
                </TableCell>
                <TableCell>{getStatusBadge(attempt.status)}</TableCell>
                <TableCell className="font-bold">
                  {attempt.totalScore}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(attempt.startedAt).toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReset(attempt.id)}
                    title="Reset Pengerjaan"
                    className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

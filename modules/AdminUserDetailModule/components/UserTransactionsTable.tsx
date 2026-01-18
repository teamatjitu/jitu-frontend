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
import { TokenTransaction } from "@/modules/AdminUserModule/interface";

interface UserTransactionsTableProps {
  transactions: TokenTransaction[];
  isLoading: boolean;
}

export const UserTransactionsTable: React.FC<UserTransactionsTableProps> = ({
  transactions,
  isLoading,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Waktu</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Referensi</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Memuat data...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                Belum ada riwayat transaksi.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium text-xs text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{tx.type}</Badge>
                </TableCell>
                <TableCell className="text-sm">{tx.referenceId || "-"}</TableCell>
                <TableCell className={`text-right font-bold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

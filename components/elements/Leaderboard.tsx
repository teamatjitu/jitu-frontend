"use client";

import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LeaderboardData } from "@/lib/api/tryout";

interface LeaderboardProps {
  leaderboardData: LeaderboardData | null;
}

export const Leaderboard = ({ leaderboardData }: LeaderboardProps) => {
  if (!leaderboardData) {
    return (
      <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Trophy className="w-5 h-5 text-amber-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Leaderboard akan tersedia setelah tryout berakhir.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { top10, currentUserRank } = leaderboardData;

  if (!top10 || top10.length === 0) {
    return (
      <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Trophy className="w-5 h-5 text-amber-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Belum ada peserta yang menyelesaikan tryout ini.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Trophy className="w-5 h-5 text-amber-500" />
          Leaderboard Top 10
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Peringkat</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-right">Skor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top10.map((user) => (
              <TableRow
                key={user.rank}
                className={user.isCurrentUser ? "bg-blue-50" : ""}
              >
                <TableCell className="font-medium">{user.rank}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell className="text-right">{user.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {currentUserRank && currentUserRank.rank > 10 && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              Peringkat Kamu
            </h4>
            <Table>
              <TableBody>
                <TableRow className="bg-blue-100">
                  <TableCell className="font-medium w-[80px]">
                    {currentUserRank.rank}
                  </TableCell>
                  <TableCell>{currentUserRank.name}</TableCell>
                  <TableCell className="text-right">
                    {currentUserRank.score}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

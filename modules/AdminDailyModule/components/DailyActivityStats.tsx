import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyQuestionStats } from "@/lib/api/AdminDailyApi";
import { Users, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

interface DailyActivityStatsProps {
  stats: DailyQuestionStats;
}

export const DailyActivityStats: React.FC<DailyActivityStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 h-full">
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total Pengerjaan Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalAttempts}</div>
          <p className="text-xs text-muted-foreground mt-1">User telah mencoba menjawab</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{stats.successRate.toFixed(1)}%</div>
          <div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500" 
              style={{ width: `${stats.successRate}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border/50 shadow-sm bg-green-50/30">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-xs font-medium text-green-700 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              BENAR
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-green-700">{stats.correctAnswers}</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-red-50/30">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-xs font-medium text-red-700 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              SALAH
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-red-700">{stats.incorrectAnswers}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

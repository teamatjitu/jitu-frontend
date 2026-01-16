import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export interface StatCardData {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  value: number;
  suffix?: string;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardData> = ({
  label,
  icon: Icon,
  color,
  bgColor,
  value,
  suffix,
  isLoading = false,
}) => {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div className={`p-2 rounded-full ${bgColor}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            value
          )}
        </div>
        {suffix && (
          <p className="text-xs text-muted-foreground mt-1">{suffix}</p>
        )}
      </CardContent>
    </Card>
  );
};

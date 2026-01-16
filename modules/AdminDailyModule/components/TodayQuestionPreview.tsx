import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DailyQuestionResponse } from "@/lib/api/AdminDailyApi";
import { BookOpen, Target, Calendar } from "lucide-react";

interface TodayQuestionPreviewProps {
  question: DailyQuestionResponse;
}

export const TodayQuestionPreview: React.FC<TodayQuestionPreviewProps> = ({ question }) => {
  return (
    <Card className="border-border/50 shadow-sm overflow-hidden h-full">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Calendar className="h-4 w-4" />
            SOAL HARI INI
          </div>
          <Badge variant="secondary" className="font-mono">#{question.id.slice(-6).toUpperCase()}</Badge>
        </div>
        <CardTitle className="pt-2 text-lg">{question.subtest.tryOut.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">{question.subtest.name}</Badge>
          <span className="text-xs text-muted-foreground">• {question.points} Poin</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            Konten Soal
          </div>
          <div 
            className="prose prose-sm max-w-none p-4 rounded-lg bg-gray-50 border border-dashed"
            dangerouslySetInnerHTML={{ __html: question.content }}
          />
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {question.items.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-2 rounded border text-xs flex items-center gap-2 ${item.isCorrect ? "bg-green-50 border-green-200 text-green-700" : "bg-white"}`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold border ${item.isCorrect ? "bg-green-500 text-white border-transparent" : "bg-muted"}`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                {item.content}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

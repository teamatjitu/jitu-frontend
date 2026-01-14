"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import QuestionList from "./components/QuestionList";
import QuestionForm from "./components/QuestionForm";
import {
  getQuestionsBySubtest,
  createQuestion,
  deleteQuestion,
  Question,
  CreateQuestionPayload,
  updateQuestion,
} from "@/lib/api/AdminQuestionApi";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface SubtestQuestionsModuleProps {
  subtestId: string;
}

const SubtestQuestionsModule: React.FC<SubtestQuestionsModuleProps> = ({
  subtestId,
}) => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const data = await getQuestionsBySubtest(subtestId);
      setQuestions(data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat daftar soal.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (subtestId) {
      fetchQuestions();
    }
  }, [subtestId]);

  const handleSave = async (payload: CreateQuestionPayload) => {
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, payload);
        toast.success("Soal berhasil diperbarui!");
      } else {
        await createQuestion(subtestId, payload);
        toast.success("Soal berhasil ditambahkan!");
      }
      setIsCreating(false);
      setEditingQuestion(null);
      fetchQuestions(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan soal.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestion(id);
      toast.success("Soal berhasil dihapus.");
      fetchQuestions();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus soal.");
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Kelola Soal Subtest
          </h1>
          <p className="text-muted-foreground">
            Daftar soal untuk subtest ini. Tambahkan, edit, atau hapus soal.
          </p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daftar Soal</CardTitle>
            <CardDescription>Total: {questions.length} Soal</CardDescription>
          </div>
          {!isCreating && (
            <Button
              onClick={() => setIsCreating(true)}
              className="font-semibold shadow-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Soal
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isCreating ? (
            <QuestionForm
              initialData={editingQuestion}
              onSave={handleSave}
              onCancel={() => {
                setIsCreating(false);
                setEditingQuestion(null);
              }}
            />
          ) : (
            <QuestionList
              questions={questions}
              onDelete={handleDelete}
              onEdit={(q) => {
                setEditingQuestion(q);
                setIsCreating(true);
              }}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubtestQuestionsModule;

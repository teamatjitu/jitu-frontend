"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getTryoutPreview } from "@/lib/api/AdminTryoutApi";
import { toast } from "sonner";
import { PreviewHeader } from "./components/PreviewHeader";
import { SidebarNavigation } from "./components/SidebarNavigation";
import { QuestionDisplay } from "./components/QuestionDisplay";

interface AdminTryoutPreviewModuleProps {
  tryoutId: string;
}

const AdminTryoutPreviewModule: React.FC<AdminTryoutPreviewModuleProps> = ({
  tryoutId,
}) => {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16); // Default 16px

  const [activeSubtestIndex, setActiveSubtestIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getTryoutPreview(tryoutId);
      setData(result);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data preview tryout.");
    } finally {
      setIsLoading(false);
    }
  }, [tryoutId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || !data.subtests || data.subtests.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-red-500 font-bold">
          Tryout ini belum memiliki subtest atau soal.
        </p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Kembali
        </button>
      </div>
    );
  }

  const currentSubtest = data.subtests[activeSubtestIndex];
  const questions = currentSubtest.questions || [];
  const currentQuestion = questions[activeQuestionIndex];

  const handleNext = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    } else if (activeSubtestIndex < data.subtests.length - 1) {
      setActiveSubtestIndex(activeSubtestIndex + 1);
      setActiveQuestionIndex(0);
    }
  };

  const handlePrev = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    } else if (activeSubtestIndex > 0) {
      setActiveSubtestIndex(activeSubtestIndex - 1);
      setActiveQuestionIndex(
        data.subtests[activeSubtestIndex - 1].questions.length - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PreviewHeader
        title={data.title}
        subtestName={currentSubtest.name}
        batch={data.batch}
        onExit={() => router.back()}
      />

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar - Navigation Grid */}
          <SidebarNavigation
            subtests={data.subtests}
            activeSubtestIndex={activeSubtestIndex}
            activeQuestionIndex={activeQuestionIndex}
            questions={questions}
            onSubtestChange={(idx) => {
              setActiveSubtestIndex(idx);
              setActiveQuestionIndex(0);
            }}
            onQuestionChange={setActiveQuestionIndex}
          />

          {/* Main Question Area */}
          <QuestionDisplay
            question={currentQuestion}
            subtestName={currentSubtest.name}
            currentIndex={activeQuestionIndex}
            totalQuestions={questions.length}
            fontSize={fontSize}
            onFontSizeIncrease={() => setFontSize((p) => Math.min(32, p + 2))}
            onFontSizeDecrease={() => setFontSize((p) => Math.max(12, p - 2))}
            onPrev={handlePrev}
            onNext={handleNext}
            canPrev={!(activeSubtestIndex === 0 && activeQuestionIndex === 0)}
            canNext={
              !(
                activeSubtestIndex === data.subtests.length - 1 &&
                activeQuestionIndex === questions.length - 1
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AdminTryoutPreviewModule;

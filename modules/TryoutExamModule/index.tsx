"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { BACKEND_URL } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Flag,
  Loader2,
  BookOpen,
  CheckCircle2,
  XCircle,
  List,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
type UiOption = { id: string; text: string };

type UiQuestion = {
  id: string;
  questionText: string;
  options: UiOption[];
  correctAnswerId?: string;
  correctAnswerText?: string;
  solution?: string;
  type?: string;
  userAnswer?: string;
};

type UiExamData = {
  attemptId: string;
  tryoutTitle: string;
  subtestName: string;
  durationMinutes: number;
  questions: UiQuestion[];
};

type AnswersMap = Record<string, string>;

const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));

const SUBTEST_FLOW = ["PU", "PPU", "PBM", "PK", "LBI", "LBE", "PM"] as const;

const getSubtestIndex = (subtestParam: string) => {
  const n = Number(subtestParam);
  if (!Number.isNaN(n) && n >= 1 && n <= 7) return n - 1;

  const upper = String(subtestParam).toUpperCase();
  const idx = (SUBTEST_FLOW as readonly string[]).indexOf(upper);
  return idx >= 0 ? idx : 0;
};

export default function TryoutExamModule() {
  const router = useRouter();
  const params = useParams<{ id: string; subtestId: string }>();
  const searchParams = useSearchParams();

  const tryoutId = params?.id;
  const subtestId = params?.subtestId;

  const isReviewMode = searchParams.get("review") === "true";
  const attemptIdFromQuery = searchParams.get("attemptId");

  const { data: session } = useSession();

  const [attemptId, setAttemptId] = useState<string | null>(
    attemptIdFromQuery ? String(attemptIdFromQuery) : null
  );

  const [examData, setExamData] = useState<UiExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingAttempt, setStartingAttempt] = useState(false);
  const [error, setError] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [markedQuestions, setMarkedQuestions] = useState<string[]>([]);
  const [timeRemainingSec, setTimeRemainingSec] = useState<number | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSyncedAnswers, setLastSyncedAnswers] = useState<
    Record<string, string>
  >({});
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [isSubmittingFinish, setIsSubmittingFinish] = useState(false);

  const subtestIndex = useMemo(
    () => getSubtestIndex(String(subtestId)),
    [subtestId]
  );
  const hasNextSubtest = subtestIndex < SUBTEST_FLOW.length - 1;
  const nextSubtestParam = String(subtestIndex + 2);

  const startAttempt = async (): Promise<string> => {
    if (!tryoutId) throw new Error("Tryout ID tidak ditemukan.");
    const userId = session?.user?.id;
    if (!userId) throw new Error("Kamu belum login / session belum siap.");

    const res = await fetch(
      `${BACKEND_URL}/exam/${encodeURIComponent(tryoutId)}/start`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      }
    );

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(msg || "Gagal memulai attempt");
    }

    const data = await res.json();
    const id = data?.attemptId || data?.id;
    if (!id) throw new Error("Attempt ID tidak ditemukan.");
    return String(id);
  };

  const ensureAttempt = async (): Promise<string> => {
    if (attemptId) return attemptId;
    setStartingAttempt(true);
    try {
      const id = await startAttempt();
      setAttemptId(id);
      return id;
    } finally {
      setStartingAttempt(false);
    }
  };

  const mapQuestionsPayloadToUi = (
    raw: any,
    effectiveAttemptId: string
  ): UiExamData => {
    const rawQuestions = Array.isArray(raw?.questions) ? raw.questions : [];

    const questions: UiQuestion[] = rawQuestions.map((q: any) => {
      const options = (q?.options || []).map((o: any) => ({
        id: s(o?.id),
        text: s(o?.text),
      }));

      const ua = q?.userAnswer;
      const valUserAnswer = ua?.questionItemId || ua?.inputText || "";

      return {
        id: s(q?.id),
        questionText: s(q?.questionText),
        options: options,
        type: s(q?.type),
        solution: s(q?.solution),
        correctAnswerId: s(q?.correctAnswerId),
        correctAnswerText: s(q?.correctAnswerText),
        userAnswer: valUserAnswer,
      };
    });

    return {
      attemptId: effectiveAttemptId,
      tryoutTitle: s(raw?.tryoutTitle),
      subtestName: s(raw?.subtestName),
      durationMinutes: Number(raw?.durationMinutes || 0),
      questions,
    };
  };

  useEffect(() => {
    const load = async () => {
      if (!tryoutId || !subtestId) return;

      try {
        setLoading(true);
        setError("");

        // 1. PENTING: Reset timer ke null setiap ganti subtes
        // agar tidak memicu auto-finish dari nilai subtes sebelumnya
        setTimeRemainingSec(null);

        let effectiveAttemptId = attemptId || "";

        if (!isReviewMode) {
          effectiveAttemptId = await ensureAttempt();
        } else {
          effectiveAttemptId =
            effectiveAttemptId || (attemptIdFromQuery as string) || "";
        }

        const currentUserId = session?.user?.id || "";

        const url = `${BACKEND_URL}/tryout/${encodeURIComponent(
          tryoutId
        )}/exam/${encodeURIComponent(
          String(subtestId)
        )}?userId=${encodeURIComponent(
          currentUserId
        )}&attemptId=${encodeURIComponent(effectiveAttemptId)}`;

        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 404 || res.status === 500) {
          router.replace(`/tryout/${tryoutId}`);
          return;
        }

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(msg || "Gagal memuat data soal.");
        }

        const raw = await res.json();
        const mapped = mapQuestionsPayloadToUi(raw, effectiveAttemptId);

        setExamData(mapped);
        setCurrentQuestionIndex(0);

        const initialAnswers: AnswersMap = {};
        mapped.questions.forEach((q) => {
          if (q.userAnswer) {
            initialAnswers[q.id] = q.userAnswer;
          }
        });
        setAnswers(initialAnswers);

        setLastSyncedAnswers({});
        setMarkedQuestions([]);

        // 2. Timer akan di-set oleh SSE stream yang terkoneksi setelah ini
        // setTimeRemainingSec(mapped.durationMinutes * 60);
      } catch (e: any) {
        setError(e?.message || "Gagal memuat ujian");
      } finally {
        setLoading(false);
      }
    };

    load();
    // 3. Dependency Array harus lengkap agar fungsi load berjalan ulang saat subtestId berubah
  }, [
    tryoutId,
    subtestId,
    isReviewMode,
    session?.user?.id,
    attemptId,
    attemptIdFromQuery,
    router,
  ]);

  const submitAnswerWithAttempt = async (
    attemptIdParam: string,
    questionId: string,
    value: string,
    isText: boolean
  ) => {
    const payload: any = { questionId };
    if (isText) {
      payload.inputText = value;
      payload.answerId = null;
    } else {
      payload.answerId = value;
      payload.inputText = null;
    }

    const res = await fetch(
      `${BACKEND_URL}/exam/${encodeURIComponent(attemptIdParam)}/answer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) throw new Error("Gagal menyimpan jawaban");
  };

  const saveCurrentQuestionIfDirty = async () => {
    if (isReviewMode) return;
    if (!examData || !examData.questions[currentQuestionIndex]) return;

    const currentQ = examData.questions[currentQuestionIndex];
    const qid = currentQ.id;
    const chosen = answers[qid];

    if (!chosen) return;
    if (lastSyncedAnswers[qid] === chosen) return;

    setIsSaving(true);
    try {
      const effectiveAttemptId = await ensureAttempt();
      const isTextAnswer = currentQ.options.length === 0;
      await submitAnswerWithAttempt(
        effectiveAttemptId,
        qid,
        chosen,
        isTextAnswer
      );
      setLastSyncedAnswers((prev) => ({ ...prev, [qid]: chosen }));
    } catch (e) {
      console.error("Auto-save failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const finishCurrentSubtest = async () => {
    if (isReviewMode) return;

    if (!examData || !attemptId) return;
    setIsSubmittingFinish(true);
    setShowFinishConfirm(false);

    try {
      await saveCurrentQuestionIfDirty();

      if (hasNextSubtest) {
        router.push(
          `/tryout/${tryoutId}/exam/${nextSubtestParam}?attemptId=${encodeURIComponent(
            attemptId
          )}`
        );
      } else {
        await fetch(
          `${BACKEND_URL}/exam/${encodeURIComponent(attemptId)}/finish`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        router.replace(`/tryout/${tryoutId}`);
      }
    } catch (e: any) {
      setError(e?.message || "Terjadi kesalahan saat menyelesaikan subtes");
      setIsSubmittingFinish(false);
    }
  };

  const sseRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Jika review mode atau tidak ada attempt, jangan jalankan SSE
    if (isReviewMode || !attemptId) return;

    // Tutup koneksi lama jika ada sebelum membuka yang baru
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }

    // Buka koneksi SSE baru dengan menyertakan order subtest (subtestIndex + 1)
    const es = new EventSource(
      `${BACKEND_URL}/exam/${encodeURIComponent(attemptId)}/stream/${
        subtestIndex + 1
      }`
    );
    sseRef.current = es;

    es.onmessage = (evt) => {
      try {
        const raw =
          typeof evt.data === "string" ? JSON.parse(evt.data) : evt.data;
        const remainingSeconds = Number(
          raw?.remainingSeconds ?? raw?.data?.remainingSeconds
        );
        const status = raw?.status ?? raw?.data?.status;

        if (Number.isFinite(remainingSeconds)) {
          setTimeRemainingSec(remainingSeconds);
        }

        // Jika waktu subtes ini habis (Sinyal dari backend)
        if (status === "SUBTEST_FINISHED") {
          console.log("Waktu subtes habis, pindah otomatis...");
          finishCurrentSubtest(); // Jalankan fungsi selesai subtes
        }

        if (status === "FINISHED") {
          es.close();
          router.replace(`/tryout/${tryoutId}`);
        }
      } catch (err) {
        console.error("SSE Parse Error:", err);
      }
    };

    es.onerror = () => {
      console.error("SSE Connection Error. Reconnecting...");
      es.close();
    };

    return () => {
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
    };
    // TAMBAHKAN subtestId dan subtestIndex di sini agar useEffect jalan ulang saat pindah subtes
  }, [attemptId, isReviewMode, router, tryoutId, subtestId, subtestIndex]);

  useEffect(() => {
    if (isReviewMode || !examData || loading) return;
    if ((timeRemainingSec ?? 999) <= 0 && !isSubmittingFinish) {
      finishCurrentSubtest();
    }
  }, [timeRemainingSec, isReviewMode, examData, loading]);

  const handleAnswerSelect = (value: string) => {
    if (isReviewMode) return;
    if (!examData?.questions[currentQuestionIndex]) return;
    const qid = examData.questions[currentQuestionIndex].id;
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleNext = async () => {
    if (!examData) return;

    if (isReviewMode) {
      const isLastQuestion =
        currentQuestionIndex === examData.questions.length - 1;
      if (isLastQuestion) {
        if (hasNextSubtest) {
          router.push(
            `/tryout/${tryoutId}/exam/${nextSubtestParam}?attemptId=${attemptId}&review=true`
          );
        } else {
          router.push(`/tryout/${tryoutId}`);
        }
      } else {
        setCurrentQuestionIndex((i) => i + 1);
      }
      return;
    }

    // Normal Mode
    try {
      await saveCurrentQuestionIfDirty();
      const isLastQuestion =
        currentQuestionIndex === examData.questions.length - 1;
      if (isLastQuestion) {
        setShowFinishConfirm(true);
      } else {
        setCurrentQuestionIndex((i) => i + 1);
      }
    } catch (e: any) {
      setError(e?.message);
    }
  };

  const handlePrevious = async () => {
    if (!isReviewMode) await saveCurrentQuestionIfDirty();
    setCurrentQuestionIndex((i) => Math.max(0, i - 1));
  };

  const handleBackNavigation = async () => {
    if (!isReviewMode) await saveCurrentQuestionIfDirty();
    router.replace(`/tryout/${tryoutId}`);
  };

  // Tambahkan "| null" pada parameter seconds
  const formatTime = (seconds: number | null) => {
    // Guard clause: jika null, kembalikan teks default
    if (seconds === null) return "00 : 00 : 00";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")} : ${String(m).padStart(
      2,
      "0"
    )} : ${String(s).padStart(2, "0")}`;
  };
  const currentQuestion = examData?.questions[currentQuestionIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <div className="text-gray-600 font-medium">Memuat...</div>
      </div>
    );
  }

  if (error || !examData || !currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 p-6">
        <h3 className="text-lg font-bold text-gray-900">Gagal Memuat</h3>
        <p className="text-gray-600 text-center max-w-xl">
          {error || "Data tidak tersedia."}
        </p>
        <Button
          variant="outline"
          onClick={() => router.replace(`/tryout/${tryoutId}`)}
        >
          Kembali Dashboard
        </Button>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = examData.questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-gray-50 font-open-sans">
      <div className="bg-white border-b border-gray-200 px-4 py-3 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleBackNavigation}
              className="text-gray-600 hover:text-gray-900"
              disabled={isSaving || isSubmittingFinish}
            >
              <ChevronLeft className="w-5 h-5" />
              Kembali
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-lg font-bold text-gray-900 line-clamp-1">
              {examData.tryoutTitle} - {examData.subtestName}
              {isReviewMode && (
                <span className="ml-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-sm">
                  (Mode Pembahasan)
                </span>
              )}
            </h1>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 h-fit space-y-4">
            <Card className="bg-white shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="font-bold text-gray-900 mb-1">
                    {examData.subtestName}
                  </h2>
                  {!isReviewMode ? (
                    <div
                      className={`mt-4 p-4 rounded-xl border flex flex-col items-center justify-center ${
                        (timeRemainingSec ?? 999) < 300
                          ? "bg-red-50 border-red-200 text-red-900"
                          : "bg-blue-50 border-blue-200 text-blue-900"
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1">
                        Sisa Waktu
                      </p>
                      <div className="text-3xl font-mono font-bold">
                        {formatTime(timeRemainingSec)}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase text-gray-500 mb-2">
                        Pindah Subtes:
                      </p>
                      <div className="space-y-1">
                        {SUBTEST_FLOW.map((sub, idx) => (
                          <Button
                            key={sub}
                            variant={
                              subtestIndex === idx ? "primary" : "outline"
                            }
                            className="w-full justify-start"
                            onClick={() =>
                              router.push(
                                `/tryout/${tryoutId}/exam/${
                                  idx + 1
                                }?attemptId=${attemptId}&review=true`
                              )
                            }
                          >
                            <List className="w-3 h-3 mr-2" />
                            {sub}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Nomor Soal
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {examData.questions.map((q, index) => {
                      const isCurrent = currentQuestionIndex === index;
                      const userAnswer = answers[q.id];
                      const isAnswered =
                        userAnswer !== undefined && userAnswer !== "";

                      let btnClass =
                        "bg-gray-100 text-gray-700 hover:bg-gray-200";

                      if (isReviewMode) {
                        const isCorrectAnswer =
                          (q.correctAnswerId &&
                            userAnswer === q.correctAnswerId) ||
                          (q.correctAnswerText &&
                            userAnswer?.toLowerCase().trim() ===
                              q.correctAnswerText.toLowerCase().trim());

                        if (isCurrent) {
                          btnClass =
                            "ring-2 ring-offset-1 ring-blue-500 bg-white text-gray-900";
                        } else if (isAnswered) {
                          btnClass = isCorrectAnswer
                            ? "bg-emerald-500 text-white" // Jawaban user BENAR -> Hijau
                            : "bg-red-500 text-white"; // Jawaban user SALAH -> Merah
                        } else {
                          btnClass = "bg-gray-200 text-gray-400"; // Kosong
                        }
                      } else {
                        const isMarked = markedQuestions.includes(q.id);
                        if (isCurrent)
                          btnClass =
                            "bg-yellow-400 text-gray-900 ring-2 ring-yellow-200";
                        else if (isMarked)
                          btnClass =
                            "bg-red-100 text-red-600 border border-red-200";
                        else if (isAnswered)
                          btnClass = "bg-blue-500 text-white hover:bg-blue-600";
                      }

                      return (
                        <button
                          key={q.id}
                          disabled={isSaving || isSubmittingFinish}
                          onClick={async () => {
                            if (!isReviewMode)
                              await saveCurrentQuestionIfDirty();
                            setCurrentQuestionIndex(index);
                          }}
                          className={`aspect-square rounded-lg font-semibold text-sm transition-all ${btnClass}`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!isReviewMode && (
                  <Button
                    onClick={() => setShowFinishConfirm(true)}
                    disabled={isSaving || isSubmittingFinish}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl font-bold text-base shadow-sm"
                  >
                    {hasNextSubtest
                      ? "Selesai & Lanjut Subtes"
                      : "Selesai Ujian"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-9">
            <Card className="bg-white shadow-sm border-gray-200 min-h-[500px]">
              <CardContent className="p-8">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Soal No. {currentQuestionIndex + 1}
                    </h3>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300 ease-out"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            examData.questions.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mb-8 prose prose-lg max-w-none text-gray-800">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {currentQuestion.questionText}
                  </p>
                </div>

                <div className="space-y-3 mb-10">
                  {currentQuestion.options.map((opt) => {
                    const userAnswerId = answers[currentQuestion.id];
                    const isSelected = userAnswerId === opt.id;

                    const isCorrectKey =
                      currentQuestion.correctAnswerId === opt.id;

                    let containerClass =
                      "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50";
                    let dotClass = "border-gray-300 bg-white";
                    let textClass = "text-gray-700";

                    if (isReviewMode) {
                      if (isCorrectKey) {
                        containerClass =
                          "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200";
                        dotClass = "border-emerald-500 bg-emerald-500";
                        textClass = "text-emerald-900 font-bold";
                      } else if (isSelected && !isCorrectKey) {
                        containerClass =
                          "border-red-500 bg-red-50 ring-1 ring-red-200";
                        dotClass = "border-red-500 bg-red-500";
                        textClass =
                          "text-red-900 font-medium line-through decoration-red-500/50";
                      } else {
                        containerClass = "border-gray-100 bg-white opacity-60";
                      }
                    } else if (isSelected) {
                      containerClass =
                        "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500";
                      dotClass = "border-blue-500 bg-blue-500";
                      textClass = "text-blue-900 font-medium";
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleAnswerSelect(opt.id)}
                        disabled={isReviewMode}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all group ${containerClass} relative`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${dotClass}`}
                          >
                            {(isSelected || isCorrectKey) && (
                              <div className="w-2.5 h-2.5 bg-white rounded-full" />
                            )}
                          </div>
                          <span className={`text-base flex-1 ${textClass}`}>
                            {opt.text}
                          </span>

                          {isReviewMode && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {isCorrectKey && (
                                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                              )}
                              {isSelected && !isCorrectKey && (
                                <XCircle className="w-6 h-6 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {currentQuestion.options.length === 0 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                          className={`w-full p-3 border rounded-lg outline-none ${
                            isReviewMode
                              ? answers[currentQuestion.id]
                                  ?.toLowerCase()
                                  .trim() ===
                                currentQuestion.correctAnswerText
                                  ?.toLowerCase()
                                  .trim()
                                ? "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold"
                                : "border-red-500 bg-red-50 text-red-900"
                              : "focus:ring-2 focus:ring-blue-500"
                          }`}
                          placeholder="Ketik jawaban Anda..."
                          value={answers[currentQuestion.id] || ""}
                          onChange={(e) => handleAnswerSelect(e.target.value)}
                          disabled={isReviewMode}
                        />
                      </div>
                      {isReviewMode && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-sm font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Kunci Jawaban: {currentQuestion.correctAnswerText}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isReviewMode && currentQuestion.solution && (
                  <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      Pembahasan
                    </h4>
                    <div className="prose prose-sm max-w-none text-slate-700">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {currentQuestion.solution}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  {!isReviewMode ? (
                    <Button
                      onClick={() => {
                        const qid = currentQuestion.id;
                        setMarkedQuestions((prev) =>
                          prev.includes(qid)
                            ? prev.filter((x) => x !== qid)
                            : [...prev, qid]
                        );
                      }}
                      variant="outline"
                      disabled={isSaving || isSubmittingFinish}
                      className={`gap-2 ${
                        markedQuestions.includes(currentQuestion.id)
                          ? "text-red-600 border-red-200 bg-red-50"
                          : "text-gray-600"
                      }`}
                    >
                      <Flag className="w-4 h-4" />
                      {markedQuestions.includes(currentQuestion.id)
                        ? "Lepas Tanda"
                        : "Tandai Soal"}
                    </Button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-3 ml-auto">
                    <Button
                      onClick={handlePrevious}
                      disabled={
                        currentQuestionIndex === 0 ||
                        isSaving ||
                        isSubmittingFinish
                      }
                      variant="outline"
                      className="gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Sebelumnya
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={isSaving || isSubmittingFinish}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                    >
                      {currentQuestionIndex === examData.questions.length - 1
                        ? isReviewMode
                          ? hasNextSubtest
                            ? "Lanjut Subtes (Review)"
                            : "Selesai Review"
                          : hasNextSubtest
                          ? "Lanjut Subtes"
                          : "Selesai"
                        : "Selanjutnya"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {error && (
                  <p className="mt-4 text-center text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                    {error}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showFinishConfirm} onOpenChange={setShowFinishConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Selesaikan Subtes {examData?.subtestName}?
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengakhiri pengerjaan subtes ini?
              <br />
              <br />
              <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 block mt-2 text-center">
                Peringatan: Anda TIDAK DAPAT kembali ke subtes ini setelah
                selesai.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFinishConfirm(false)}
              disabled={isSubmittingFinish}
            >
              Batal
            </Button>
            <Button
              onClick={finishCurrentSubtest}
              disabled={isSubmittingFinish}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmittingFinish ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Ya, Selesaikan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// app/modules/AddSoalModule/components/QuestionCard.tsx

"use client";
import { useEffect, useState } from "react";
// Impor <Form> dari react-router, bukan <form> HTML
import { useParams, Form } from "react-router";

import katex from "katex";
import "katex/dist/katex.min.css";
import { TipeSoal } from "../enums";
import { Tick } from "~/components/icons";
import { Check } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

import { PlusGolden } from "~/components/icons";
import { deleteSoal } from "~/api/admin";

type Opsi = { teks: string; is_correct: boolean };

type SavedQuestion = {
  id?: string; // Add id for edit operations
  pertanyaan: string;
  pembahasan?: string;
  tipe: string;
  opsi: Opsi[];
};

// --- KOMPONEN QUESTION TYPE DIMODIFIKASI (tetap reuse) ---
const QuestionTypeEditor = ({
  tipe,
  defaultOpsi = [],
  onSelectCorrectIndex,
  selectedIndex,
  onChangeOpsiTexts,
}: {
  tipe: string;
  defaultOpsi?: Opsi[];
  selectedIndex?: number | null;
  onSelectCorrectIndex?: (i: number) => void;
  onChangeOpsiTexts?: (texts: string[]) => void;
}) => {
  const [selectedMetricsIndex, setSelectedMetricsIndex] = useState<
    number | null
  >(selectedIndex ?? null);
  const [totalOption, setTotalOption] = useState(defaultOpsi.length || 1);
  const [texts, setTexts] = useState<string[]>(
    defaultOpsi.length ? defaultOpsi.map((o) => o.teks) : []
  );

  useEffect(() => {
    if (tipe === "PG") {
      setTotalOption((p) => (p < 4 ? 4 : p));
    } else if (tipe === "BS") setTotalOption(2);
    else if (tipe === "IS") setTotalOption(1);
  }, [tipe]);

  useEffect(() => {
    setSelectedMetricsIndex(selectedIndex ?? null);
  }, [selectedIndex]);

  useEffect(() => {
    // Reset texts when tipe changes to prevent carrying over values from different question types
    setTexts((prevTexts) => {
      const newTexts = Array.from({ length: totalOption }).map((_, i) => {
        // If we have existing text for this index and it's the same tipe, keep it
        // Otherwise, use default placeholder or empty string
        if (prevTexts[i] && prevTexts.length === totalOption) {
          return prevTexts[i];
        }
        // Only use default values for BS, others should be empty
        return tipe === "BS" ? (i === 0 ? "Benar" : "Salah") : "";
      });
      return newTexts;
    });
  }, [tipe, totalOption]);

  useEffect(() => {
    // notify parent when texts change
    onChangeOpsiTexts?.(texts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts]);

  const handleTextChange = (i: number, v: string) => {
    setTexts((prev) => {
      const next = [...prev];
      next[i] = v;
      onChangeOpsiTexts?.(next);
      return next;
    });
  };

  const renderOptionInputs = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-row items-center gap-5">
        <input
          value={texts[i] ?? ""}
          onChange={(e) => handleTextChange(i, e.target.value)}
          // PERBAIKAN KRUSIAL: Tambahkan 'name' agar 'action' dapat membacanya
          name="opsi_teks"
          placeholder={
            tipe === "BS" ? (i === 0 ? "Benar" : "Salah") : `Opsi ${i + 1}`
          }
          className={`w-full p-3 rounded-xl text-left text-base transition-all border border-gray-300 ${
            selectedMetricsIndex === i && "bg-success/10 border-success"
          } `}
          required={tipe !== "IS"}
        />
        <input
          type="hidden"
          name="opsi_is_correct"
          value={selectedMetricsIndex === i ? "true" : "false"}
        />
        <Check
          className={`cursor-pointer transition-all ${
            selectedMetricsIndex === i
              ? "text-success scale-110"
              : "text-gray-300 hover:text-success/50"
          }`}
          onClick={() => {
            setSelectedMetricsIndex(i);
            onSelectCorrectIndex?.(i);
          }}
        />
      </div>
    ));

  if (tipe === "PG") {
    // ... (tidak ada perubahan di logika if/else ini)
    // ... (sisa logika renderOptionInputs, PG, IS, BS tetap sama) ...
    return (
      <div className="mt-5">
        <div className="flex items-center flex-row gap-5">
          <h1 className="font-semibold text-lg">
            Opsi Jawaban (Pilih kunci jawaban)
          </h1>
          <button
            type="button"
            onClick={() =>
              setTotalOption((prev) => (prev < 5 ? prev + 1 : prev))
            }
            className={`rounded-md hover:cursor-pointer px-1 py-1 ${
              totalOption === 5 ? "bg-white" : "bg-yellow-300"
            } `}
            disabled={totalOption === 5}
          >
            <Plus className="text-white" />
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          {renderOptionInputs(totalOption)}
        </div>
      </div>
    );
  } else if (tipe === "IS") {
    return (
      <div className="mt-5">
        <h1 className="font-semibold text-lg">Kunci Jawaban Singkat</h1>
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex flex-row items-center gap-5">
            <input
              value={texts[0] ?? ""}
              onChange={(e) => handleTextChange(0, e.target.value)}
              name="opsi_teks"
              placeholder="Masukkan kunci jawaban..."
              className="w-full p-3 rounded-xl border border-gray-300"
              required
            />
            <input type="hidden" name="opsi_is_correct" value="true" />
            <Check className="text-success opacity-50 cursor-not-allowed" />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mt-5">
        <h1 className="font-semibold text-lg">
          Opsi Jawaban (Pilih yang Benar)
        </h1>
        <div className="mt-5 flex flex-col gap-3">{renderOptionInputs(2)}</div>
      </div>
    );
  }
};

// --- KOMPONEN UTAMA ---
export const QuestionCard = ({
  tipe = "PG",
  currentQuestion = 1,
  onQuestionTypeChange,
  // HAPUS onSave, kita tidak lagi menyimpan ke state lokal
  // onSave,
  savedData,
  onCancel,
  isPending = false,
}: {
  tipe?: string;
  currentQuestion?: number;
  onQuestionTypeChange?: (type: string) => void;
  // onSave?: (qnum: number, payload: SavedQuestion) => void; // HAPUS
  savedData?: SavedQuestion | null;
  onCancel?: () => void;
  isPending?: boolean;
}) => {
  const { id, subtest } = useParams();
  const [editing, setEditing] = useState<boolean>(savedData ? false : true);

  useEffect(() => {
    setEditing(savedData ? false : true);
  }, [currentQuestion, savedData]);

  // State lokal ini tetap berguna untuk mengontrol input form
  const [pertanyaan, setPertanyaan] = useState(savedData?.pertanyaan ?? "");
  const [pembahasan, setPembahasan] = useState(savedData?.pembahasan ?? "");
  const [opsiTexts, setOpsiTexts] = useState<string[]>(
    savedData?.opsi.map((o) => o.teks) ?? []
  );
  const [correctIndex, setCorrectIndex] = useState<number | null>(
    savedData?.opsi.findIndex((o) => o.is_correct) ?? null
  );
  const [localTipe, setLocalTipe] = useState<string>(savedData?.tipe ?? tipe);

  useEffect(() => {
    setPertanyaan(savedData?.pertanyaan ?? "");
    setPembahasan(savedData?.pembahasan ?? "");
    setOpsiTexts(savedData?.opsi.map((o) => o.teks) ?? []);
    setCorrectIndex(savedData?.opsi.findIndex((o) => o.is_correct) ?? null);
    setLocalTipe(savedData?.tipe ?? tipe);
  }, [savedData, tipe]);

  const handleDeleteQuestion = async () => {
    console.log("Help help");
    try {
      await deleteSoal(savedData?.id);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // HAPUS FUNGSI handleSubmit
  // const handleSubmit = async (e: React.FormEvent) => { ... }

  if (!editing && savedData) {
    // PREVIEW MODE - Tampilkan konten lengkap soal
    const getTipeSoalLabel = (tipe: string) => {
      switch (tipe) {
        case "PG":
          return "Pilihan Ganda";
        case "BS":
          return "Benar Salah";
        case "IS":
          return "Isian Singkat";
        default:
          return tipe;
      }
    };

    const renderPreviewOptions = () => {
      if (savedData.tipe === "PG") {
        return (
          <div className="mt-5">
            <h1 className="font-semibold text-lg mb-3">Opsi Jawaban</h1>
            <div className="flex flex-col gap-3">
              {savedData.opsi.map((opsi, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border transition-all ${
                    opsi.is_correct
                      ? "bg-green-50 border-green-300 text-green-800"
                      : "bg-white border-1 border-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="flex-1">{opsi.teks}</span>
                    {opsi.is_correct && (
                      <Check className="text-green-600 w-5 h-5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      } else if (savedData.tipe === "BS") {
        return (
          <div className="mt-5">
            <h1 className="font-semibold text-lg mb-3">Opsi Jawaban</h1>
            <div className="flex flex-col gap-3">
              {savedData.opsi.map((opsi, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border transition-all ${
                    opsi.is_correct
                      ? "bg-green-50 border-green-300 text-green-800"
                      : "bg-white border-1 border-gray-50  text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      {index === 0 ? "Benar" : "Salah"}
                    </span>
                    {opsi.is_correct && (
                      <Check className="text-green-600 w-5 h-5 ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      } else if (savedData.tipe === "IS") {
        return (
          <div className="mt-5">
            <h1 className="font-semibold text-lg mb-3">Kunci Jawaban</h1>
            <div className="p-3 rounded-xl bg-green-50 border border-green-300 text-green-800">
              <div className="flex items-center gap-3">
                <span className="font-medium">Jawaban:</span>
                <span className="flex-1 font-semibold">
                  {savedData.opsi[0]?.teks}
                </span>
                <Check className="text-green-600 w-5 h-5" />
              </div>
            </div>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="p-6 w-full rounded-xl shadow-sm h-fit bg-white border-2">
        {/* Header dengan info soal */}
        <div className="w-full pb-4 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Soal {currentQuestion || 1}
            </h2>
            <span
              className={`px-3 py-1 ${
                savedData.tipe === "PG"
                  ? "bg-blue-300"
                  : savedData.tipe === "BS"
                  ? "bg-yellow-300"
                  : savedData.tipe === "IS"
                  ? "bg-green-300"
                  : ""
              } text-white rounded-full text-sm font-medium`}
            >
              {getTipeSoalLabel(savedData.tipe)}
            </span>
          </div>
        </div>

        {/* Pertanyaan */}
        <div className="mt-5">
          <h1 className="font-semibold text-lg mb-3">Pertanyaan</h1>

          {/* Tambahkan 'break-words' di sini */}
          <div className="p-4 bg-white rounded-xl  border-2">
            <p className="text-gray-800 whitespace-pre-wrap break-words">
              {savedData.pertanyaan}
            </p>
          </div>
        </div>

        {/* Opsi Jawaban */}
        {renderPreviewOptions()}

        {/* Pembahasan */}
        {savedData.pembahasan && (
          <div className="mt-5">
            <h1 className="font-semibold text-lg mb-3">Pembahasan</h1>
            <div className="p-4 bg-white rounded-xl border">
              <p className="text-gray-700 whitespace-pre-wrap">
                {savedData.pembahasan}
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="w-full flex gap-5 justify-end mt-6">
          <Button onClick={() => setEditing(true)} variant={"transparentBlack"}>
            Edit Soal
          </Button>
          <Button
            onClick={() => handleDeleteQuestion()}
            className="bg-red-400 hover:bg-red-700 border-red-400 hover:border-red-700 "
          >
            Hapus Soal
          </Button>
        </div>
      </div>
    );
  }

  // EDIT MODE (form)
  // Ganti <form> dengan <Form method="post">
  // Hapus onSubmit={handleSubmit}
  return (
    <Form
      method="post"
      className="p-6 w-full rounded-xl shadow-sm h-fit"
      // Hapus onSubmit
    >
      {/* Input hidden ini akan diambil oleh 'action' Anda */}
      {/* Ini sudah sesuai dengan 'action.ts' Anda */}
      <input type="hidden" name="tryoutId" value={id || ""} />
      <input
        type="hidden"
        name="subtest"
        value={subtest?.toUpperCase() || ""}
      />
      <input type="hidden" name="tipe" value={localTipe || "PG"} />
      {/* Add soalId for edit operations */}
      {savedData && (
        <input type="hidden" name="soalId" value={savedData.id || ""} />
      )}
      <input type="hidden" name="isEdit" value={savedData ? "true" : "false"} />

      <div className="w-full pb-8 border-b border-gray-300">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Soal {currentQuestion || 1}
          </h2>
          {/* ... (select tipe soal tetap sama) ... */}
        </div>
        <textarea
          placeholder="Masukkan pertanyaan disini..."
          name="pertanyaan"
          value={pertanyaan}
          onChange={(e) => setPertanyaan(e.target.value)}
          className="w-full px-9 py-5 border border-gray-300 rounded-xl h-48"
          required
        />
      </div>

      <QuestionTypeEditor
        tipe={localTipe}
        defaultOpsi={savedData?.opsi ?? []}
        selectedIndex={correctIndex}
        onSelectCorrectIndex={(i) => setCorrectIndex(i)}
        onChangeOpsiTexts={(texts) => setOpsiTexts(texts)}
      />

      <div className="mt-5">
        <h1 className="font-semibold text-lg mb-3">Pembahasan</h1>
        <textarea
          placeholder="Masukkan pembahasan disini..."
          name="pembahasan"
          value={pembahasan}
          onChange={(e) => setPembahasan(e.target.value)}
          className="w-full px-9 py-5 border border-gray-300 rounded-xl h-40"
        />
      </div>
      <div className="w-full flex justify-between mt-5">
        {isPending && (
          <Button type="button" variant={"transparentBlack"} onClick={onCancel}>
            Batal
          </Button>
        )}
        <div className="ml-auto">
          {/* Tombol ini sekarang akan otomatis men-submit <Form> ke 'action' */}
          <Button type="submit" variant={"blue"}>
            Simpan Soal & Opsi
          </Button>
        </div>
      </div>
    </Form>
  );
};

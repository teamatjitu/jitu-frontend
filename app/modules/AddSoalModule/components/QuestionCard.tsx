"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import katex from "katex";
import "katex/dist/katex.min.css";
import { TipeSoal } from "../enums";
import { Tick } from "~/components/icons";
import { Check } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

import { PlusGolden } from "~/components/icons";

type Opsi = { teks: string; is_correct: boolean };

type SavedQuestion = {
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
    // reset texts to defaults when tipe or totalOption changes
    const arr = Array.from({ length: totalOption }).map((_, i) =>
      tipe === "BS" ? (i === 0 ? "Benar" : "Salah") : ""
    );
    setTexts(arr);
    // notify parent
    onChangeOpsiTexts?.(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalOption, tipe]);

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
              totalOption === 5 ? "bg-gray-300" : "bg-yellow-300"
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

// --- KOMPONEN UTAMA DITINGKATKAN: view/edit/simpan lokal ---
export const QuestionCard = ({
  tipe = "PG",
  currentQuestion = 1,
  onQuestionTypeChange,
  onSave,
  savedData,
}: {
  tipe?: string;
  currentQuestion?: number;
  onQuestionTypeChange?: (type: string) => void;
  onSave?: (qnum: number, payload: SavedQuestion) => void;
  savedData?: SavedQuestion | null;
}) => {
  const { id, subtest } = useParams();
  const [editing, setEditing] = useState<boolean>(savedData ? false : true);

  useEffect(() => {
    // reset editing when question changes
    setEditing(savedData ? false : true);
  }, [currentQuestion, savedData]);

  // local editable inputs (for uncontrolled fallback)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // build opsi array from opsiTexts and correctIndex
    const opsi: Opsi[] = (opsiTexts.length ? opsiTexts : []).map((t, i) => ({
      teks: t,
      is_correct: i === correctIndex,
    }));

    // fallback to at least 1 opsi if none
    if (opsi.length === 0) {
      opsi.push({ teks: "Jawaban", is_correct: true });
    }

    const payload: SavedQuestion = {
      pertanyaan,
      pembahasan,
      tipe: localTipe,
      opsi,
    };

    // call parent save handler
    await onSave?.(currentQuestion ?? 1, payload);
    setEditing(false);
  };

  if (!editing && savedData) {
    // VIEW MODE
    return (
      <div className="p-6 w-full rounded-xl shadow-sm h-fit">
        <div className="w-full pb-8 border-b border-gray-300">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Soal {currentQuestion}
              </h2>
              <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                {savedData.pertanyaan}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{savedData.tipe}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Opsi</h3>
          <ul className="space-y-2">
            {savedData.opsi.map((o, i) => (
              <li
                key={i}
                className={`p-3 rounded-md border ${
                  o.is_correct ? "bg-blue-50 border-blue-300" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{o.teks}</span>
                  {o.is_correct && (
                    <span className="text-success text-sm font-medium">
                      Kunci
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Pembahasan</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700 whitespace-pre-wrap">
              {savedData.pembahasan || "-"}
            </p>
          </div>
        </div>

        <div className="w-full flex justify-end mt-5">
          <Button onClick={() => setEditing(true)} variant={"transparentBlack"}>
            Edit
          </Button>
        </div>
      </div>
    );
  }

  // EDIT MODE (form)
  return (
    <form
      className="p-6 w-full rounded-xl shadow-sm h-fit"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="tryoutId" value={id || ""} />
      <input
        type="hidden"
        name="subtest"
        value={subtest?.toUpperCase() || ""}
      />
      <input type="hidden" name="tipe" value={localTipe || "PG"} />

      <div className="w-full pb-8 border-b border-gray-300">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Soal {currentQuestion || 1}
          </h2>

          <div className="flex items-center gap-3">
            <select
              value={localTipe}
              onChange={(e) => {
                setLocalTipe(e.target.value);
                onQuestionTypeChange?.(e.target.value);
              }}
              className="p-2 border rounded-md"
            >
              <option value="PG">Pilihan Ganda</option>
              <option value="IS">Isian Singkat</option>
              <option value="BS">Benar Salah</option>
            </select>
          </div>
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
      <div className="w-full flex justify-end mt-5">
        <Button type="submit" variant={"blue"}>
          Simpan Soal & Opsi
        </Button>
      </div>
    </form>
  );
};

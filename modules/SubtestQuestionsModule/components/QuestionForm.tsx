"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { CreateQuestionPayload, Question } from "@/lib/api/AdminQuestionApi";
import { Loader2, Save, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuestionFormProps {
  onSave: (data: CreateQuestionPayload) => Promise<void>;
  onCancel: () => void;
  initialData?: Question | null;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<
    "PILIHAN_GANDA" | "ISIAN_SINGKAT" | "BENAR_SALAH"
  >(initialData?.type || "PILIHAN_GANDA");
  const [content, setContent] = useState(initialData?.content || "");
  const [explanation, setExplanation] = useState(
    initialData?.explanation || ""
  );
  const [points, setPoints] = useState(initialData?.points || 1);

  // State specific to PILIHAN_GANDA
  const sortedItems =
    initialData?.type === "PILIHAN_GANDA" && initialData.items
      ? [...initialData.items].sort((a, b) => a.order - b.order)
      : [];

  const [options, setOptions] = useState(
    sortedItems.length > 0
      ? sortedItems.map((it) => ({
          content: it.content,
          isCorrect: it.isCorrect,
        }))
      : [
          { content: "", isCorrect: false },
          { content: "", isCorrect: false },
          { content: "", isCorrect: false },
          { content: "", isCorrect: false },
          { content: "", isCorrect: false },
        ]
  );
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(
    sortedItems.length > 0 ? sortedItems.findIndex((it) => it.isCorrect) : null
  );

  // State specific to ISIAN_SINGKAT
  const [shortAnswer, setShortAnswer] = useState(
    initialData?.type === "ISIAN_SINGKAT" ? initialData.correctAnswer || "" : ""
  );

  // State specific to BENAR_SALAH
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(
    initialData?.type === "BENAR_SALAH" && initialData.items
      ? initialData.items.find((it) => it.content === "Benar")?.isCorrect ??
          null
      : null
  );

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].content = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      alert("Konten soal tidak boleh kosong");
      return;
    }

    setIsLoading(true);

    try {
      const payload: CreateQuestionPayload = {
        type,
        content,
        explanation,
        points,
      };

      if (type === "PILIHAN_GANDA") {
        if (correctOptionIndex === null) {
          alert("Pilih satu jawaban yang benar untuk Pilihan Ganda");
          setIsLoading(false);
          return;
        }

        // Validate first 4 options (A-D) must be filled
        const requiredOptionsFilled = options.slice(0, 4).every(o => o.content.trim() !== "");
        if (!requiredOptionsFilled) {
          alert("Opsi A, B, C, dan D wajib diisi.");
          setIsLoading(false);
          return;
        }

        // Filter out empty options (like empty E)
        const filledOptions = options.filter(o => o.content.trim() !== "");
        
        // Ensure the selected correct answer index still exists in filled options
        if (options[correctOptionIndex].content.trim() === "") {
          alert("Jawaban benar tidak boleh pada opsi yang kosong");
          setIsLoading(false);
          return;
        }

        payload.items = filledOptions.map((opt, idx) => ({
          content: opt.content,
          isCorrect: opt.content === options[correctOptionIndex].content,
          order: idx + 1,
        }));
      } else if (type === "ISIAN_SINGKAT") {
        if (!shortAnswer) {
          alert("Kunci jawaban isian singkat harus diisi");
          setIsLoading(false);
          return;
        }
        payload.correctAnswer = shortAnswer.toLowerCase().trim();
      } else if (type === "BENAR_SALAH") {
        if (trueFalseAnswer === null) {
          alert("Pilih jawaban Benar atau Salah");
          setIsLoading(false);
          return;
        }
        payload.items = [
          { content: "Benar", isCorrect: trueFalseAnswer === true, order: 1 },
          { content: "Salah", isCorrect: trueFalseAnswer === false, order: 2 },
        ];
      }

      await onSave(payload);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-lg font-semibold">
          {initialData ? "Edit Soal" : "Tambah Soal Baru"}
        </h3>
        <Button variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Batal
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Tipe Soal</Label>
            <Select
              value={type}
              onValueChange={(
                val: "PILIHAN_GANDA" | "ISIAN_SINGKAT" | "BENAR_SALAH"
              ) => setType(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tipe Soal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PILIHAN_GANDA">Pilihan Ganda</SelectItem>
                <SelectItem value="ISIAN_SINGKAT">Isian Singkat</SelectItem>
                <SelectItem value="BENAR_SALAH">Benar / Salah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Poin Soal</Label>
            <Input
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Konten Soal</Label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Tulis pertanyaan, masukkan gambar, atau rumus di sini..."
          />
        </div>

        {/* Dynamic Answer Section */}
        <div className="p-4 bg-muted/30 rounded-lg border space-y-4">
          <Label className="text-base font-semibold">Kunci Jawaban</Label>

          {type === "PILIHAN_GANDA" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-2">
                Isi opsi jawaban dan pilih lingkaran di sebelah kiri untuk
                menandai jawaban benar.
              </p>
              <RadioGroup
                value={correctOptionIndex?.toString()}
                onValueChange={(val) => setCorrectOptionIndex(parseInt(val))}
                className="space-y-2"
              >
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-md border transition-all duration-200 ${
                      correctOptionIndex === index
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-input hover:bg-accent/50"
                    }`}
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`opt-${index}`}
                      className="w-5 h-5 border-2"
                    />
                    <Label
                      htmlFor={`opt-${index}`}
                      className="font-bold text-lg w-6 cursor-pointer text-muted-foreground"
                    >
                      {String.fromCharCode(65 + index)}.
                    </Label>
                    <div className="flex-1">
                      <Input
                        placeholder={
                          index === 4
                            ? `Tulis teks jawaban opsi E... (Opsional)`
                            : `Tulis teks jawaban opsi ${String.fromCharCode(65 + index)}...`
                        }
                        value={option.content}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        className="bg-transparent border-transparent shadow-none focus-visible:ring-0 px-0 h-auto font-medium placeholder:font-normal"
                      />
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {type === "ISIAN_SINGKAT" && (
            <div className="space-y-2">
              <Label>Jawaban Benar (Teks)</Label>
              <Input
                placeholder="Masukkan jawaban singkat..."
                value={shortAnswer}
                onChange={(e) => setShortAnswer(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                *Jawaban akan otomatis disimpan dalam huruf kecil (lowercase)
                untuk pengecekan case-insensitive.
              </p>
            </div>
          )}

          {type === "BENAR_SALAH" && (
            <div className="space-y-2">
              <Label>Pernyataan ini adalah:</Label>
              <RadioGroup
                value={
                  trueFalseAnswer === null ? "" : trueFalseAnswer.toString()
                }
                onValueChange={(val) => setTrueFalseAnswer(val === "true")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="true" />
                  <Label htmlFor="true" className="font-normal cursor-pointer">
                    Benar
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="false" />
                  <Label htmlFor="false" className="font-normal cursor-pointer">
                    Salah
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Pembahasan (Opsional)</Label>
          <RichTextEditor
            content={explanation}
            onChange={setExplanation}
            placeholder="Tulis pembahasan soal di sini..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Soal
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;

"use client";
import { useEffect, useState } from "react";

import katex from "katex";
import "katex/dist/katex.min.css";
import { TipeSoal } from "../enums";
import { Tick } from "~/components/icons";
import { Check } from "lucide-react";
import { Plus } from "lucide-react";

import { PlusGolden } from "~/components/icons";

type QuestionTypeProps = {
  tipe: string;
};

const QuestionType = ({
  tipe,
  onQuestionTypeChange,
}: QuestionTypeProps & { onQuestionTypeChange?: (type: string) => void }) => {
  const [isAnswer, setIsAnswer] = useState<number | null>(null);
  const [totalOption, setTotalOption] = useState(1);

  useEffect(() => {
    setIsAnswer(null);
    setTotalOption(1);
  }, [tipe]);

  if (tipe === "PG") {
    return (
      <>
        <div className="mt-5">
          <div className="flex items-center flex-row gap-5">
            <h1 className="font-semibold text-lg">Opsi Jawaban</h1>
            <button
              onClick={() =>
                setTotalOption((prev) => (prev < 5 ? prev + 1 : prev))
              }
              className={`rounded-md hover:cursor-pointer  px-1 py-1 ${
                totalOption === 5 ? "bg-gray-300" : "bg-yellow-300"
              } `}
              disabled={totalOption === 5}
            >
              <Plus className=" text-white" />
            </button>
          </div>
          <div className="mt-5">
            <div className="flex flex-col gap-3">
              {Array.from({ length: totalOption }).map((_, i) => (
                <div key={i} className="flex flex-row items-center gap-5">
                  <input
                    placeholder="Meong Ipsum"
                    className={`w-full p-3 rounded-xl text-left text-base transition-all border border-gray-300 ${
                      isAnswer === i && "bg-success text-white"
                    } `}
                  />
                  <Check
                    className={`cursor-pointer hover:text-success ${
                      isAnswer === i && "text-success"
                    }`}
                    onClick={() => setIsAnswer(i)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  } else if (tipe === "IS") {
    return (
      <>
        <div className="mt-5">
          <h1 className="font-semibold text-lg">Jawaban</h1>
          <div className="mt-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row items-center gap-5">
                <input
                  placeholder="Meong Ipsum"
                  className={`w-full p-3 rounded-xl text-left text-base transition-all border border-gray-300`}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="mt-5">
          <h1 className="font-semibold text-lg">Opsi Jawaban</h1>

          <div className="mt-5">
            <div className="flex flex-col gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-row items-center gap-5">
                  <input
                    placeholder="Meong Ipsum"
                    className={`w-full p-3 rounded-xl text-left text-base transition-all border border-gray-300 ${
                      isAnswer === i && "bg-success text-white"
                    }`}
                  />
                  <Check
                    className={`cursor-pointer hover:text-success ${
                      isAnswer === i && "text-success"
                    }`}
                    onClick={() => setIsAnswer(i)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
};

export const QuestionCard = ({
  tipe = "BS",
  currentQuestion,
  onQuestionTypeChange,
}: {
  tipe?: string;
  currentQuestion?: number;
  onQuestionTypeChange?: (type: string) => void;
}) => {
  const [soal, setSoal] = useState("");
  return (
    <div className="p-6 w-full rounded-xl shadow-sm h-fit ">
      <div className="w-full pb-8 border-b border-gray-300">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Soal {currentQuestion || 1}
          </h2>
        </div>
        <textarea
          placeholder="Masukkan pertanyaan disini..."
          value={soal}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setSoal(e.target.value)
          }
          className="w-full px-9 py-5 border border-gray-300 rounded-xl h-48"
        />
      </div>
      <div>
        <QuestionType tipe={tipe} onQuestionTypeChange={onQuestionTypeChange} />
      </div>
      <div className="mt-5">
        <textarea
          placeholder="Masukkan pembahasan disini..."
          value={soal}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setSoal(e.target.value)
          }
          className="w-full px-9 py-5 border border-gray-300 rounded-xl h-40"
        />
      </div>
    </div>
  );
};

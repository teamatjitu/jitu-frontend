import { Check, Close } from "~/components/icons";
import { TipeSoal } from "../enums";

interface Props<R extends boolean = false> {
  soal: Soal;
  isReviewMode?: R;
  onAnswer?: R extends true ? undefined : (answer: string) => void;
  userAnswer?: string;
  correctAnswer?: R extends true ? string : undefined;
}

export function QuestionInput<R extends boolean = false>({
  soal,
  isReviewMode,
  onAnswer,
  userAnswer,
  correctAnswer,
}: Props<R>) {
  if (soal.tipeSoal === TipeSoal.BENAR_SALAH) {
    const benarOpsi = soal.opsi.find(o => o.teks === "Benar" || o.isCorrect);
    const salahOpsi = soal.opsi.find(o => o.teks === "Salah" || !o.isCorrect);

    return (
      <div className="flex flex-col gap-2 mb-5">
        {/* True Option */}
        <button
          disabled={isReviewMode ?? false}
          onClick={() => onAnswer?.(benarOpsi?.id || "")}
          className={`w-full cursor-pointer p-3 rounded-xl flex items-center gap-2 text-left text-base transition-all ${
            isReviewMode
              ? correctAnswer === benarOpsi?.id
                ? "border-2 border-success bg-[#35CA89]/30"
                : userAnswer === benarOpsi?.id
                  ? "border-2 border-error bg-[#D75353]/30"
                  : "border border-gray-300"
              : userAnswer === benarOpsi?.id
                ? "border-2 border-blue-500 bg-[#4292FD]/10"
                : "border border-gray-300"
          }`}
        >
          <Check />
          <p>Benar</p>
        </button>

        {/* False Option */}
        <button
          disabled={isReviewMode ?? false}
          onClick={() => onAnswer?.(salahOpsi?.id || "")}
          className={`w-full cursor-pointer p-3 rounded-xl flex items-center gap-2 text-left text-base transition-all ${
            isReviewMode
              ? correctAnswer === salahOpsi?.id
                ? "border-2 border-success bg-[#35CA89]/30"
                : userAnswer === salahOpsi?.id
                  ? "border-2 border-error bg-[#D75353]/30"
                  : "border border-gray-300"
              : userAnswer === salahOpsi?.id
                ? "border-2 border-blue-500 bg-[#4292FD]/10"
                : "border border-gray-300"
          }`}
        >
          <Close />
          <p>Salah</p>
        </button>
      </div>
    );
  }

  if (soal.tipeSoal === TipeSoal.ISIAN_SINGKAT) {
    if (isReviewMode) {
      const correctText = soal.opsi.find(o => o.id === correctAnswer)?.teks || correctAnswer || "";
      
      return (
        <>
          <div className="flex flex-col gap-5 mb-5">
            <p className="text-xl font-medium">Jawaban Anda</p>
            <input
              type="text"
              disabled
              className={`w-full p-3 rounded-xl text-left text-base border ${
                userAnswer === correctAnswer
                  ? "border-2 border-success bg-[#35CA89]/30"
                  : "border-2 border-error bg-[#D75353]/30"
              }`}
              value={userAnswer || ""}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.2)] mb-5"></div>

          <div className="flex flex-col gap-5">
            <p className="text-xl font-medium">Kunci Jawaban</p>
            <input
              type="text"
              disabled
              className="w-full p-3 rounded-xl text-left text-base border-2 border-success bg-[#35CA89]/30"
              value={correctText}
            />
          </div>
        </>
      );
    }

    return (
      <div className="mb-5 w-full p-3 rounded-xl text-left text-base border border-gray-300">
        <input
          type="text"
          disabled={isReviewMode ?? false}
          className="w-full bg-transparent outline-none"
          placeholder="Tuliskan jawaban anda di sini"
          value={userAnswer || ""}
          onChange={(e) => {
            onAnswer?.(e.target.value);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mb-5">
      {soal.opsi.map((opsi) => (
        <button
          key={opsi.id}
          disabled={isReviewMode ?? false}
          onClick={() => onAnswer?.(opsi.id)}
          className={`w-full p-3 rounded-xl text-left text-base transition-all ${
            isReviewMode
              ? opsi.isCorrect
                ? "border-2 border-success bg-[#35CA89]/30"
                : userAnswer === opsi.id
                  ? "border-2 border-error bg-[#D75353]/30"
                  : "border border-gray-300"
              : userAnswer === opsi.id
                ? "border-2 border-blue-500 bg-[#4292FD]/10"
                : "border border-gray-300"
          }`}
        >
          {opsi.teks}
        </button>
      ))}
    </div>
  );
}

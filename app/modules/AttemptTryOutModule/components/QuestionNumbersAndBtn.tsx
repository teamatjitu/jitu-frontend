interface Props {
  soals: Soal[];
  stateStyles: Record<string, string>;
  questionToStateFn: (questionIndex: number) => string;
  currentQuestion: number;
  onQuestionNumberClick: (questionIndex: number) => void;
  btnElement?: React.ReactNode;
}

export function QuestionNumbersAndBtn({ 
  soals, 
  stateStyles, 
  questionToStateFn, 
  currentQuestion, 
  onQuestionNumberClick, 
  btnElement 
}: Props) {
  return (
    <>
      {/* Question Numbers */}
      <div className="flex flex-wrap gap-2 mb-5">
        {Array.from({ length: soals.length }, (_, i) => i + 1).map(
          (num) => {
            const state = questionToStateFn(num);
            const className = stateStyles[state];
            return (
              <button
                key={num}
                onClick={() => onQuestionNumberClick(num)}
                className={`w-[45.6px] h-[45.6px] cursor-pointer rounded-lg flex items-center justify-center text-base transition-all ${
                  num === currentQuestion ? "border-2 border-blue-500" : ""
                } ${className}`}
              >
                {num}
              </button>
            );
          }
        )}
      </div>

      {/* Button Element */}
      {btnElement}
    </>
  );
}
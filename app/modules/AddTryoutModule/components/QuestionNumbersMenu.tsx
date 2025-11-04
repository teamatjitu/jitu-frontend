import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type QuestionNumbersMenuProps = {
  judul?: string;
  soal?: number;
  isActive?: boolean;
  onClickMenu?: () => void;
  tipe?: "menu" | "soal";
  currentQuestion?: number;
  onQuestionNumberClick?: (questionNum: number) => void;
};

export const QuestionNumbersMenu = ({
  judul = "",
  soal = 0,
  isActive = false,
  tipe = "menu",
  onClickMenu = () => {},
  currentQuestion = 1,
  onQuestionNumberClick = () => {},
}: QuestionNumbersMenuProps) => {
  return (
    <div
      onClick={onClickMenu}
      className="px-6 py-6 bg-white w-fit h-fit max-w-80 rounded-xl shadow-sm transition-colors"
    >
      <div
        className={`pb-4 mt-3 border-b ${
          isActive ? "border-blue-100" : "border-gray-100"
        }`}
      >
        {tipe === "menu" ? (
          <h1 className="text-xl font-semibold">{judul}</h1>
        ) : (
          <div className="mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <p className="py-2">Subtest</p>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Subtest</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>PU</DropdownMenuItem>
                  <DropdownMenuItem>PPU</DropdownMenuItem>
                  <DropdownMenuItem>PBM</DropdownMenuItem>
                  <DropdownMenuItem>PK</DropdownMenuItem>
                  <DropdownMenuItem>LBI</DropdownMenuItem>
                  <DropdownMenuItem>LBE</DropdownMenuItem>
                  <DropdownMenuItem>PM</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <p
          className={`text-sm ${isActive ? "text-blue-100" : "text-gray-100"}`}
        >
          {soal} Soal
        </p>
      </div>

      <div className="flex flex-wrap w-full justify-center py-4 gap-2">
        {Array.from({ length: 30 }).map((_, index) => {
          const num = index + 1;
          return (
            <button
              key={index}
              onClick={() => onQuestionNumberClick(num)}
              className={`w-[45.6px] h-[45.6px] cursor-pointer rounded-lg flex items-center justify-center text-base transition-all ${
                num === currentQuestion && tipe === "soal"
                  ? "border-2 border-blue-500 bg-blue-50"
                  : "hover:border-2 hover:border-blue-300 bg-gray-50"
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      <div className="w-full mt-4 flex justify-center items-center">
        <Button className="w-full py-5" variant={"blue"}>
          Edit
        </Button>
      </div>
    </div>
  );
};

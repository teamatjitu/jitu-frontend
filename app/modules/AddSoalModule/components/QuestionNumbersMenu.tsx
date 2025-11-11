"use client";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useRevalidator } from "react-router";

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
  savedQuestions?: Record<number, any>;
};

export const QuestionNumbersMenu = ({
  judul = "",
  soal = 0,
  isActive = false,
  tipe = "menu",
  onClickMenu = () => {},
  currentQuestion = 1,
  onQuestionNumberClick = () => {},
  savedQuestions = {},
}: QuestionNumbersMenuProps) => {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const { id, subtest } = useParams();
  const currentSubtest = subtest?.toUpperCase() || "KPU";
  const tryoutId = id;

  const handleSubtestChange = async (newSubtest: string) => {
    navigate(`/admin/add-soal/${tryoutId}/${newSubtest.toLowerCase()}`);
    // Auto-refresh data after navigation
    setTimeout(() => {
      revalidator.revalidate();
    }, 100);
  };

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
                <p className="py-2">{currentSubtest}</p>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Subtest</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {["PU", "PPU", "PBM", "PK", "LBI", "LBE", "PM"].map(
                    (item) => (
                      <DropdownMenuItem
                        key={item}
                        onClick={() => handleSubtestChange(item)}
                        className={
                          currentSubtest === item
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : ""
                        }
                      >
                        {item}
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <p
          className={`text-sm ${isActive ? "text-blue-100" : "text-gray-100"}`}
        >
          {Object.keys(savedQuestions).length} Soal
        </p>
      </div>

      <div className="flex flex-wrap w-full justify-center py-4 gap-2">
        {Array.from({ length: 30 }).map((_, index) => {
          const num = index + 1;
          const isSaved = !!savedQuestions[num];
          const isCurrent = num === currentQuestion && tipe === "soal";
          return (
            <button
              key={index}
              onClick={() => onQuestionNumberClick(num)}
              className={`w-[45.6px] h-[45.6px] cursor-pointer rounded-lg flex items-center justify-center text-base transition-all
                ${
                  isCurrent
                    ? "border-2 border-blue-500 bg-blue-50"
                    : "hover:border-2 hover:border-blue-300 bg-gray-50"
                }
                ${isSaved ? "bg-blue-500 text-white border-transparent" : ""}
              `}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
};

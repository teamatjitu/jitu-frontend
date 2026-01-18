import React from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Type } from "lucide-react";

interface FontSizeControlProps {
  fontSize: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export const FontSizeControl: React.FC<FontSizeControlProps> = ({
  fontSize,
  onIncrease,
  onDecrease,
}) => {
  return (
    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200 w-fit">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-600 hover:text-primary"
        onClick={onDecrease}
        title="Perkecil Tulisan"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <div className="h-4 w-px bg-gray-300 mx-1"></div>
      <div className="px-2 flex items-center gap-1.5 text-gray-500">
        <Type className="h-3.5 w-3.5" />
        <span className="text-[10px] font-bold w-6 text-center">{fontSize}</span>
      </div>
      <div className="h-4 w-px bg-gray-300 mx-1"></div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-600 hover:text-primary"
        onClick={onIncrease}
        title="Perbesar Tulisan"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
};

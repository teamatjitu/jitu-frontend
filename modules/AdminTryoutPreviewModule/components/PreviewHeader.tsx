import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";

interface PreviewHeaderProps {
  title: string;
  subtestName: string;
  batch: string;
  onExit: () => void;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  title,
  subtestName,
  batch,
  onExit,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 fixed top-0 left-0 right-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onExit}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
            Keluar Preview
          </Button>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-lg font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">
            {title} - {subtestName}
          </h1>
        </div>
        <div className="hidden sm:block">
          <Badge className="bg-blue-600 text-white font-bold uppercase text-[10px] tracking-widest px-3 py-1">
            Preview Mode
          </Badge>
        </div>
      </div>
    </div>
  );
};

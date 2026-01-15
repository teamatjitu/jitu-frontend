import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Lock, FileText, Pencil } from "lucide-react";
import { Subtest } from "@/lib/api/AdminTryoutApi";
import Link from "next/link";
import { EditSubtestDialog } from "./EditSubtestDialog";

interface SubtestListProps {
  subtests: Subtest[];
  createdTryoutId: string | null;
  handleFinish: () => void;
  onRefresh?: () => void;
}

export const SubtestList: React.FC<SubtestListProps> = ({
  subtests,
  createdTryoutId,
  handleFinish,
  onRefresh,
}) => {
  const [selectedSubtest, setSelectedSubtest] = React.useState<Subtest | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  return (
    <Card
      className={`border-border/50 shadow-sm transition-all duration-500 ${
        createdTryoutId
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-50 grayscale"
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Daftar Subtest UTBK
              {!createdTryoutId && (
                <Lock className="w-4 h-4 text-muted-foreground" />
              )}
            </CardTitle>
            <CardDescription>
              {createdTryoutId
                ? "7 Subtest standar telah dibuat secara otomatis."
                : "Subtest akan otomatis digenerate setelah data tryout disimpan."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {createdTryoutId && (
        <CardContent className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[80px]">Order</TableHead>
                  <TableHead>Nama Subtest</TableHead>
                  <TableHead>Durasi (Menit)</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subtests.map((subtest) => (
                  <TableRow key={subtest.id}>
                    <TableCell className="font-medium">
                      {subtest.order}
                    </TableCell>
                    <TableCell>{subtest.name}</TableCell>
                    <TableCell>{subtest.durationMinutes} Menit</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            setSelectedSubtest(subtest);
                            setIsEditDialogOpen(true);
                          }}
                          title="Edit Durasi"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Link
                          href={`/admin/tryout/${createdTryoutId}/s/${subtest.id}`}
                        >
                          <Button variant="outline" size="sm" className="h-8">
                            <FileText className="w-3.5 h-3.5 mr-2" />
                            Kelola Soal
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleFinish}
              className="font-semibold w-full md:w-auto"
            >
              Selesai & Kembali
            </Button>
          </div>
        </CardContent>
      )}

      <EditSubtestDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        subtest={selectedSubtest}
        onSuccess={() => onRefresh?.()}
      />
    </Card>
  );
};

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Clock } from "lucide-react";
import { updateSubtest, Subtest } from "@/lib/api/AdminTryoutApi";
import { toast } from "sonner";

interface EditSubtestDialogProps {
  subtest: Subtest | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditSubtestDialog: React.FC<EditSubtestDialogProps> = ({
  subtest,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    if (subtest) {
      setDuration(subtest.durationMinutes.toString());
    }
  }, [subtest, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtest) return;

    setIsLoading(true);
    try {
      await updateSubtest(subtest.id, {
        durationMinutes: parseInt(duration),
      });
      toast.success(`Durasi subtest ${subtest.name} berhasil diperbarui`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui durasi subtest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Edit Durasi Subtest
          </DialogTitle>
          <DialogDescription>
            Ubah durasi pengerjaan untuk subtest{" "}
            <strong>{subtest?.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Durasi (Menit)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className=" px-3 text-lg"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Coins, AlertCircle, CheckCircle2 } from "lucide-react";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tryoutTitle: string;
  tokenCost: number;
  isLoading: boolean;
  error?: string;
}

export function RegisterModal({
  isOpen,
  onClose,
  onConfirm,
  tryoutTitle,
  tokenCost,
  isLoading,
  error,
}: RegisterModalProps) {
  const isPaidSolution = tokenCost > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            Konfirmasi Pendaftaran
          </DialogTitle>
          <DialogDescription className="pt-2">
            Anda akan mendaftar untuk tryout:
            <br />
            <span className="font-bold text-gray-900 block mt-1 text-base">
              {tryoutTitle}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center mb-3">
            <p className="text-green-800 font-medium">
              Pengerjaan Tryout ini <span className="font-bold">GRATIS</span>!
            </p>
            <p className="text-sm text-green-600 mt-1">
              Anda bisa mengerjakan soal tanpa memotong token.
            </p>
          </div>

          {isPaidSolution && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 flex gap-2 items-start">
              <Coins className="w-4 h-4 mt-0.5 shrink-0" />
              <p>
                Jika ingin melihat <strong>Pembahasan Lengkap</strong> setelah selesai, 
                dibutuhkan <strong>{tokenCost} Token</strong>.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

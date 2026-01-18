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
  userBalance: number;
  isLoading: boolean;
  error?: string;
}

export function RegisterModal({
  isOpen,
  onClose,
  onConfirm,
  tryoutTitle,
  tokenCost,
  userBalance,
  isLoading,
  error,
}: RegisterModalProps) {
  const isFree = tokenCost <= 0;
  const isSufficient = userBalance >= tokenCost;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {isFree ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Coins className="w-6 h-6 text-yellow-500" />
            )}
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
          {!isFree && (
            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Biaya Pendaftaran</span>
                <span className="font-bold text-red-600 flex items-center gap-1">
                  {tokenCost} Token
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Saldo Anda</span>
                <span className="font-bold text-gray-900 flex items-center gap-1">
                  {userBalance} Token
                </span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between items-center font-bold">
                <span className="text-gray-700">Sisa Saldo</span>
                <span
                  className={`flex items-center gap-1 ${
                    isSufficient ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {userBalance - tokenCost} Token
                </span>
              </div>
            </div>
          )}

          {isFree && (
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
              <p className="text-green-800 font-medium">
                Tryout ini <span className="font-bold">GRATIS</span>!
              </p>
              <p className="text-sm text-green-600 mt-1">
                Langsung daftar dan kerjakan sekarang.
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
            disabled={isLoading || (!isFree && !isSufficient)}
            className={`${
              isFree
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : isFree ? (
              "Daftar Sekarang"
            ) : isSufficient ? (
              "Bayar & Daftar"
            ) : (
              "Saldo Tidak Cukup"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

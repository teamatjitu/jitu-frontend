"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircleIcon, CheckCircle2Icon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TokenCard from "./components/TokenCard";
import { tokenPackages } from "./payload";

import { BACKEND_URL } from "@/lib/api";

const ShopModule = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const [alerts, setAlerts] = useState<
    { type: "success" | "error"; title: string; message: string }[]
  >([]);

  function showAlert(
    type: "success" | "error",
    title: string,
    message: string,
  ) {
    setAlerts((prev) => [...prev, { type, title, message }]);

    setTimeout(() => {
      setAlerts((prev) => prev.slice(1));
    }, 5000);
  }

  return (
    <div className="min-h-screen pl-20 bg-gray-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="pt-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Beli Token Try Out
            </h1>
          </div>
          <p className="text-gray-600">
            Pilih paket token yang sesuai dengan kebutuhan latihan kamu
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              💡
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Apa itu Token Try Out?</h3>
              <p className="text-blue-100 text-sm">
                1 Token = 1x Akses Try Out Premium. Token dapat digunakan kapan
                saja dan tidak akan hangus. Semakin banyak token yang dibeli,
                semakin hemat harga per tokennya!
              </p>
            </div>
          </div>
        </div>

        {/* Token Packages */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Paket Token Tersedia
            </h2>
            <p className="text-gray-600">
              Pilih paket yang sesuai dengan intensitas belajar kamu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {tokenPackages.map((pkg, idx) => (
              <TokenCard
                key={pkg.id}
                pkg={pkg}
                onPressBuy={() => {
                  setSelectedPkg(idx);
                  setIsModalOpened(true);
                }}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            variant={alert.type === "success" ? "default" : "destructive"}
          >
            {alert.type === "success" ? (
              <CheckCircle2Icon className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircleIcon className="w-5 h-5 mr-2" />
            )}
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        ))}
      </div>

      <Dialog open={isModalOpened} onOpenChange={setIsModalOpened} modal>
        <DialogContent>
          {!isModalLoading && !transactionId && (
            <>
              <DialogHeader>
                <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
                <DialogDescription>
                  Silahkan pilih metode pembayaran untuk menyelesaikan pembelian
                  token kamu.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsModalLoading(true);

                    fetch(
                      `${BACKEND_URL}/api/shop/create/${tokenPackages[selectedPkg!].id}`,
                      {
                        method: "POST",
                        credentials: "include",
                      },
                    )
                      .then((res) => {
                        if (!res.ok) {
                          throw new Error(res.statusText);
                        }

                        return res.json();
                      })
                      .then((data: { id: string }) => {
                        console.log(data);
                        setIsModalLoading(false);
                        setTransactionId(data.id);
                      })
                      .catch((e: Error) => {
                        // console.error(e);
                        setIsModalLoading(false);
                        showAlert(
                          "error",
                          "Gagal Membuat Transaksi",
                          "Terjadi kesalahan saat membuat transaksi. Silahkan coba lagi.",
                        );
                      });
                  }}
                >
                  QRIS
                </Button>
              </div>
            </>
          )}

          {isModalLoading && (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500 mb-4" />
              <div className="text-gray-600">Memproses transaksi...</div>
            </div>
          )}

          {!isModalLoading && transactionId && (
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl font-bold mb-4">
                Silahkan Lakukan Pembayaran
              </h2>
              <div className="flex flex-col items-center gap-2">
                <div className="flex justify-center items-center py-32 w-full border border-black">
                  Ini gambar QRIS ceritanya
                </div>
                <p className="text-xs text-gray-500">
                  Transaction ID: {transactionId}
                </p>
              </div>
              <Button
                onClick={() => {
                  setIsModalLoading(true);

                  fetch(`${BACKEND_URL}/api/shop/check/${transactionId}`, {
                    method: "POST",
                    credentials: "include",
                  })
                    .then((res) => res.json())
                    .then((data: { type: string }) => {
                      console.log(data);
                      setIsModalLoading(false);

                      if (data.type === "PAID") {
                        showAlert(
                          "success",
                          "Pembayaran Berhasil",
                          "Terima kasih! Pembayaran kamu telah kami terima dan token sudah ditambahkan ke akun kamu.",
                        );
                        setIsModalOpened(false);
                        setTransactionId(null);
                        setSelectedPkg(null);
                      } else {
                        showAlert(
                          "error",
                          "Pembayaran Belum Diterima",
                          "Pembayaran kamu belum kami terima. Silahkan pastikan kamu sudah melakukan pembayaran dengan benar.",
                        );
                      }
                    })
                    .catch((e: Error) => {
                      console.error(e);
                      setIsModalLoading(false);
                      showAlert(
                        "error",
                        "Gagal Memeriksa Status Transaksi",
                        "Terjadi kesalahan saat memeriksa status transaksi. Silahkan coba lagi.",
                      );
                    });
                }}
              >
                Saya sudah melakukan pembayaran
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopModule;

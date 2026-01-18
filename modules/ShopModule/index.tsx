"use client";
"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertCircleIcon, Clock, History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import TokenCard from "./components/TokenCard";
import { contactInfos } from "./payload";

import { BACKEND_URL } from "@/lib/api";

interface TokenPackage {
  id: string;
  name: string;
  tokenAmount: number;
  price: number;
}

const ShopModule = () => {
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<TokenPackage | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [qrCode, setQrCode] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/shop/packages`);
        if (res.ok) {
          const data = await res.json();
          setPackages(data);
        } else {
          toast.error("Gagal memuat paket token");
        }
      } catch (error) {
        console.error(error);
        toast.error("Terjadi kesalahan jaringan");
      } finally {
        setLoadingPackages(false);
      }
    };

    fetchPackages();
  }, []);

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

        <div className="flex items-center gap-4">
          <div
            onClick={() => router.push("/shop/pending")}
            className="rounded-2xl p-6 text-gray-700 shadow-lg w-full cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">
                  Cek Transaksi Pending
                </h3>
                <p className="text-gray-500 text-sm">
                  Lihat transaksi token try out yang belum selesai dibayar
                </p>
              </div>
            </div>
          </div>
          <div
            onClick={() => router.push("/shop/past")}
            className="rounded-2xl p-6 text-gray-700 shadow-lg w-full cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Cek Transaksi Lama</h3>
                <p className="text-gray-500 text-sm">
                  Lihat riwayat pembelian token try out kamu sebelumnya
                </p>
              </div>
            </div>
          </div>
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

          {loadingPackages ? (
            <div className="text-center py-10">Memuat paket...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {packages.map((pkg) => {
                // Kalkulasi kosmetik untuk UI
                const originalPrice = Math.round(pkg.price * 1.2); // Asumsi diskon 20%
                const discount = 20;
                const savings = originalPrice - pkg.price;
                const pricePerToken = Math.round(pkg.price / pkg.tokenAmount);

                // Tentukan warna berdasarkan jumlah token
                let categoryBg = "from-blue-600 to-indigo-700";
                if (pkg.tokenAmount >= 50)
                  categoryBg = "from-purple-600 to-pink-600";
                else if (pkg.tokenAmount >= 25)
                  categoryBg = "from-emerald-600 to-teal-600";

                return (
                  <TokenCard
                    key={pkg.id}
                    pkg={{
                      id: Number(pkg.id),
                      title: pkg.name,
                      subtitle: "Akses Premium Tryout & Pembahasan",
                      tokenAmount: pkg.tokenAmount,
                      originalPrice: originalPrice,
                      finalPrice: pkg.price,
                      discount: discount,
                      savings: savings,
                      pricePerToken: String(pricePerToken),
                      categoryBg: categoryBg,
                      popular: pkg.tokenAmount === 50, // Tandai paket 50 sebagai populer
                      badge: pkg.tokenAmount >= 50 ? "Best Value" : undefined,
                    }}
                    onPressBuy={() => {
                      setSelectedPkg(pkg);
                      setIsModalOpened(true);
                    }}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Dialog
        open={isModalOpened}
        onOpenChange={(state) => {
          setIsModalOpened(state);

          if (!state) {
            setIsModalLoading(false);
            setTransactionId(null);
            setSelectedPkg(null);
            setShowContact(false);
          }
        }}
        modal
      >
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

                    fetch(`${BACKEND_URL}/shop/create/${selectedPkg?.id}`, {
                      method: "POST",
                      credentials: "include",
                    })
                      .then((res) => {
                        if (!res.ok) {
                          throw new Error(res.statusText);
                        }

                        return res.json();
                      })
                      .then((data: { id: string; qris: string }) => {
                        console.log(data);
                        setIsModalLoading(false);
                        setTransactionId(data.id);
                        setQrCode(data.qris);
                        setShowContact(false);
                      })
                      .catch((e: Error) => {
                        // console.error(e);
                        setIsModalLoading(false);

                        toast.error("Gagal Membuat Transaksi", {
                          description:
                            "Terjadi kesalahan saat membuat transaksi. Silahkan coba lagi.",
                        });
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

          {!isModalLoading && transactionId && !showContact && (
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl font-bold mb-4">
                Silahkan Lakukan Pembayaran
              </h2>
              <div className="flex flex-col items-center gap-2">
                <div className="flex justify-center items-center py-12 w-full border border-black">
                  {qrCode ? (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                        qrCode,
                      )}`}
                      alt="QRIS code"
                      className="w-48 h-48"
                    />
                  ) : (
                    <p>QRIS tidak tersedia</p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Transaction ID: {transactionId}
                </p>
              </div>
              <Button
                onClick={() => {
                  setShowContact(true);
                }}
              >
                Saya sudah melakukan pembayaran
              </Button>
            </div>
          )}

          {!isModalLoading && transactionId && showContact && (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4">Pembayaran Diproses</h2>
              <div className="flex flex-col items-center gap-2">
                <p className="text-center">
                  Pembayaran kamu akan segera kami proses. Apabila dalam 1x24
                  jam belum terverifikasi, silahkan hubungi kontak berikut:
                </p>
                {contactInfos.map((contact) => (
                  <Alert key={contact.name} className="w-full max-w-md">
                    <AlertCircleIcon className="h-5 w-5 shrink-0" />
                    <div>
                      <AlertTitle className="font-medium">
                        {contact.name}
                      </AlertTitle>
                      <AlertDescription className="text-sm mt-2">
                        {Object.entries(contact.contacts).map(
                          ([method, info]) => (
                            <div key={method}>
                              <strong>{method}:</strong> {info || "-"}
                            </div>
                          ),
                        )}
                      </AlertDescription>
                    </div>
                  </Alert>
                ))}
                <p className="text-xs text-gray-500">
                  Transaction ID: {transactionId}
                </p>
              </div>
              <Button
                className="mt-4"
                onClick={() => {
                  setShowContact(false);
                }}
              >
                Tunjukkan kembali QRIS
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopModule;

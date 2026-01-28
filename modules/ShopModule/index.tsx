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
import {
  AlertCircleIcon,
  Clock,
  History,
  Loader2,
  Smartphone,
  Monitor,
  XCircle,
} from "lucide-react";
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

interface EWalletPaymentResponse {
  transactionId: string;
  orderId: string;
  amount: number;
  tokenAmount: number;
  status: string;
  paymentMethod: string;
  qrCodeUrl?: string;
  deeplinkUrl?: string;
  expiryTime?: string;
  packageName: string;
}

interface PendingPayment {
  id: string;
  orderId: string;
  amount: number;
  tokenAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
  tokenPackage: {
    id: string;
    name: string;
    tokenAmount: number;
    price: number;
  };
  metadata?: {
    qr_code_url?: string;
    deeplink_url?: string;
    midtrans_transaction_id?: string;
  };
}

const ShopModule = () => {
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<TokenPackage | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [paymentData, setPaymentData] = useState<EWalletPaymentResponse | null>(
    null,
  );
  const [isMobile, setIsMobile] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");

  // Pending payment states
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(
    null,
  );
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const [cancellingPayment, setCancellingPayment] = useState(false);
  const [checkingPending, setCheckingPending] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const router = useRouter();

  // Detect if user is on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ),
      );
    };
    checkMobile();
  }, []);

  // Poll payment status when transaction is created
  useEffect(() => {
    if (!transactionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/shop/check/${transactionId}`, {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setPaymentStatus(data.status);

          if (data.status === "CONFIRMED") {
            clearInterval(pollInterval);
            toast.success("Pembayaran Berhasil!", {
              description: "Token telah ditambahkan ke akun kamu",
            });
            setIsModalOpened(false);
            // Refresh page to update token balance
            setTimeout(() => router.refresh(), 1000);
          } else if (
            data.status === "CANCELLED" ||
            data.status === "DECLINED"
          ) {
            clearInterval(pollInterval);
            toast.error("Pembayaran Gagal", {
              description: "Silahkan coba lagi atau hubungi customer service",
            });
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 3000); // Check every 3 seconds

    // Stop polling after 15 minutes
    const timeout = setTimeout(
      () => clearInterval(pollInterval),
      15 * 60 * 1000,
    );

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [transactionId, router]);

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

  // Check for pending payment
  const checkPendingPayment = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/shop/pending-payment`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        return data.pending;
      }
    } catch (error) {
      console.error("Failed to check pending payment:", error);
    }
    return null;
  };

  // Handle purchase button click
  const handlePurchaseClick = async (pkg: TokenPackage) => {
    setSelectedPkg(pkg);
    setCheckingPending(true);

    // Check for pending payment first (BEFORE opening any modal)
    const pending = await checkPendingPayment();
    setCheckingPending(false);

    if (pending) {
      // User has pending payment - show ONLY pending dialog
      setPendingPayment(pending);
      setShowPendingDialog(true);
    } else {
      // No pending payment, show payment selection modal
      setIsModalOpened(true);
    }
  };

  // Create new payment
  const handleCreatePayment = async () => {
    setIsModalLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/shop/create/${selectedPkg?.id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || res.statusText);
      }

      const data: EWalletPaymentResponse = await res.json();
      console.log("Payment data:", data);

      setPaymentData(data);
      setTransactionId(data.transactionId);
      setIsModalLoading(false);
      setShowContact(false);

      // If mobile and deeplink available, redirect to GoPay app
      if (isMobile && data.deeplinkUrl) {
        toast.info("Membuka aplikasi GoPay...");
        window.location.href = data.deeplinkUrl;
      }
    } catch (e: Error | any) {
      setIsModalLoading(false);
      toast.error("Gagal Membuat Transaksi", {
        description:
          e.message ||
          "Terjadi kesalahan saat membuat transaksi. Silahkan coba lagi.",
      });
    }
  };

  // Cancel pending payment
  const handleCancelPayment = async () => {
    if (!pendingPayment) return;

    setCancellingPayment(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/shop/cancel/${pendingPayment.id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to cancel payment");
      }

      const result = await response.json();
      toast.success("Pembayaran dibatalkan");

      // Close pending dialog and clear pending payment
      setShowPendingDialog(false);
      setPendingPayment(null);

      // Now open payment modal for new purchase
      setIsModalOpened(true);
    } catch (error: any) {
      toast.error(error.message || "Gagal membatalkan pembayaran");
    } finally {
      setCancellingPayment(false);
    }
  };

  // Continue with pending payment
  const handleContinuePendingPayment = () => {
    if (!pendingPayment?.metadata) {
      toast.error("Data pembayaran tidak lengkap");
      return;
    }

    // Set the payment data from pending payment
    setPaymentData({
      transactionId: pendingPayment.id,
      orderId: pendingPayment.orderId,
      amount: pendingPayment.amount,
      tokenAmount: pendingPayment.tokenAmount,
      status: pendingPayment.status,
      paymentMethod: pendingPayment.paymentMethod,
      qrCodeUrl: pendingPayment.metadata.qr_code_url,
      deeplinkUrl: pendingPayment.metadata.deeplink_url,
      expiryTime: pendingPayment.expiresAt,
      packageName: pendingPayment.tokenPackage.name,
    });

    setTransactionId(pendingPayment.id);

    // Close pending dialog and show payment modal
    setShowPendingDialog(false);
    setIsModalOpened(true);

    // If mobile and deeplink available, redirect
    if (isMobile && pendingPayment.metadata.deeplink_url) {
      window.location.href = pendingPayment.metadata.deeplink_url;
    }
  };

  const handleManualCheck = async () => {
    if (!paymentData?.orderId) return;

    setIsCheckingStatus(true);
    toast.info('Memeriksa status pembayaran di server...');

    try {
      const res = await fetch(
        `${BACKEND_URL}/shop/midtrans/check-status/${paymentData.orderId}`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Gagal memeriksa status');
      }

      const data = await res.json();

      // The polling mechanism will catch the 'CONFIRMED' status,
      // so we only need to handle the case where it's still pending.
      if (data.status === 'PENDING') {
        toast.warning('Pembayaran Belum Terkonfirmasi', {
          description:
            'Status pembayaran kamu masih pending. Coba lagi dalam beberapa saat.',
        });
      } else if (data.status === 'CONFIRMED') {
        // Let the poller handle the success message
      } else {
        toast.error('Status Pembayaran Tidak Valid', {
          description: `Status: ${data.status}. Hubungi customer service jika masalah berlanjut.`,
        });
      }
    } catch (e: any) {
      toast.error('Gagal Memeriksa Status', {
        description:
          e.message || 'Terjadi kesalahan. Silahkan coba lagi nanti.',
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };


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
                      popular: pkg.tokenAmount === 50,
                      badge: pkg.tokenAmount >= 50 ? "Best Value" : undefined,
                    }}
                    onPressBuy={() => handlePurchaseClick(pkg)}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Loading Dialog while checking pending */}
      {checkingPending && (
        <Dialog open={checkingPending} onOpenChange={() => {}}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="sr-only">Checking Payment</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500 mb-4" />
              <div className="text-gray-600">Memeriksa pembayaran...</div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Pending Payment Dialog */}
      <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircleIcon className="w-5 h-5 text-yellow-600" />
              Transaksi Pending Ditemukan
            </DialogTitle>
            <DialogDescription>
              Kamu memiliki transaksi yang belum selesai. Silahkan selesaikan
              atau batalkan terlebih dahulu.
            </DialogDescription>
          </DialogHeader>

          {pendingPayment && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Pembayaran ini akan kadaluarsa dalam waktu dekat. Selesaikan
                  sekarang atau batalkan untuk membuat pembayaran baru.
                </p>
              </div>

              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Order ID:</span>
                  <span className="font-mono text-xs">
                    {pendingPayment.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Paket:</span>
                  <span className="font-semibold text-sm">
                    {pendingPayment.tokenPackage.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Jumlah:</span>
                  <span className="font-semibold text-sm">
                    Rp {pendingPayment.amount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Token:</span>
                  <span className="font-semibold text-sm">
                    {pendingPayment.tokenAmount} tokens
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Berlaku hingga:</span>
                  <span className="text-xs text-red-600 font-medium">
                    {new Date(pendingPayment.expiresAt).toLocaleTimeString(
                      "id-ID",
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleContinuePendingPayment}
                  className="w-full"
                  size="lg"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Lanjutkan Pembayaran Ini
                </Button>

                <Button
                  onClick={handleCancelPayment}
                  variant="destructive"
                  className="w-full"
                  disabled={cancellingPayment}
                  size="lg"
                >
                  {cancellingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Membatalkan...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Batalkan Pembayaran Ini
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setShowPendingDialog(false)}
                  variant="outline"
                  className="w-full"
                >
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog
        open={isModalOpened}
        onOpenChange={(state) => {
          setIsModalOpened(state);

          if (!state) {
            setIsModalLoading(false);
            setTransactionId(null);
            setSelectedPkg(null);
            setShowContact(false);
            setPaymentData(null);
            setPaymentStatus("pending");
          }
        }}
        modal
      >
        <DialogContent className="max-w-2xl">
          {!isModalLoading && !transactionId && (
            <>
              <DialogHeader>
                <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
                <DialogDescription>
                  Silahkan pilih metode pembayaran untuk menyelesaikan pembelian
                  token kamu.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-md">
                  <Button
                    className="w-full h-auto py-4"
                    variant="primary"
                    onClick={handleCreatePayment}
                  >
                    <div className="flex items-center gap-3">
                      {isMobile ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <Monitor className="w-5 h-5" />
                      )}
                      <div className="text-left">
                        <div className="font-bold">GoPay / QRIS</div>
                        <div className="text-xs opacity-90">
                          {isMobile
                            ? "Bayar langsung di aplikasi GoPay"
                            : "Scan QR Code dengan aplikasi QRIS"}
                        </div>
                      </div>
                    </div>
                  </Button>
                </div>
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
              <h2 className="text-2xl font-bold mb-2">
                {isMobile && paymentData?.deeplinkUrl
                  ? "Pembayaran Dialihkan"
                  : "Scan QR Code untuk Membayar"}
              </h2>

              {isMobile && paymentData?.deeplinkUrl ? (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Kamu akan diarahkan ke aplikasi GoPay untuk menyelesaikan
                    pembayaran.
                  </p>
                  <Button
                    onClick={() => {
                      if (paymentData?.deeplinkUrl) {
                        window.location.href = paymentData.deeplinkUrl;
                      }
                    }}
                    size="lg"
                  >
                    Buka Aplikasi GoPay
                  </Button>
                  <p className="text-sm text-gray-500">
                    Atau scan QR code di bawah dengan aplikasi QRIS lainnya:
                  </p>
                </div>
              ) : null}

              {paymentData?.qrCodeUrl && (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex justify-center items-center p-4 border-2 border-gray-200 rounded-lg bg-white">
                    <img
                      src={paymentData.qrCodeUrl}
                      alt="QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Scan dengan GoPay, Gojek, atau aplikasi QRIS lainnya
                  </p>
                </div>
              )}

              {paymentStatus === "PENDING" && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menunggu pembayaran...</span>
                </div>
              )}

              <div className="text-center space-y-1">
                <p className="text-xs text-gray-500">
                  Order ID: {paymentData?.orderId}
                </p>
                <p className="text-xs text-gray-500">
                  Berlaku hingga:{" "}
                  {paymentData?.expiryTime
                    ? new Date(paymentData.expiryTime).toLocaleTimeString(
                        "id-ID",
                      )
                    : "15 menit"}
                </p>
              </div>

              <Button
                variant="outline"
                onClick={handleManualCheck}
                disabled={isCheckingStatus}
              >
                {isCheckingStatus ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memeriksa...
                  </>
                ) : (
                  'Saya sudah melakukan pembayaran'
                )}
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
                  Order ID: {paymentData?.orderId}
                </p>
              </div>
              <Button
                className="mt-4"
                onClick={() => {
                  setShowContact(false);
                }}
              >
                Tunjukkan kembali QR Code
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopModule;

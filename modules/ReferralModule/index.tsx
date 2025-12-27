"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCircle2,
  XCircle,
  Gift,
  Users,
  Sparkles,
} from "lucide-react";
import { ReferralData, ReferralCheckResult } from "./interface";
import { checkReferralCode } from "./payload";

const ReferralModule = () => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [checkResult, setCheckResult] = useState<ReferralCheckResult | null>(
    null
  );
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = () => {
    setIsChecking(true);

    // Simulate API call delay
    setTimeout(() => {
      const result = checkReferralCode(referralCode);
      setCheckResult(result);
      setIsChecking(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCheck();
    }
  };

  return (
    <div className="min-h-screen pl-20 bg-gray-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="pt-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Kode Referral</h1>
          </div>
          <p className="text-gray-600">
            Masukkan kode referral untuk mendapatkan benefit spesial
          </p>
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm border border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Dapatkan Benefit Eksklusif!
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Gunakan kode referral dari temanmu untuk mendapatkan diskon
                  spesial, bonus try out, dan akses gratis ke berbagai materi
                  pembelajaran premium.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Check Card */}
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Cek Kode Referral
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Input Section */}
              <div>
                <label
                  htmlFor="referralCode"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Masukkan Kode Referral
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="referralCode"
                      type="text"
                      placeholder="Contoh: JITU2026"
                      value={referralCode}
                      onChange={(e) =>
                        setReferralCode(e.target.value.toUpperCase())
                      }
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-12 text-base uppercase"
                    />
                  </div>
                  <Button
                    onClick={handleCheck}
                    disabled={isChecking || !referralCode.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 h-12 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChecking ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Mengecek...
                      </span>
                    ) : (
                      "Cek Kode"
                    )}
                  </Button>
                </div>
              </div>

              {/* Result Section */}
              {checkResult && (
                <div
                  className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                    checkResult.exists
                      ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                      : "bg-gradient-to-br from-red-50 to-orange-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                        checkResult.exists
                          ? "bg-gradient-to-br from-emerald-500 to-green-500"
                          : "bg-gradient-to-br from-red-500 to-orange-500"
                      }`}
                    >
                      {checkResult.exists ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <XCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-bold mb-2 ${
                          checkResult.exists
                            ? "text-emerald-900"
                            : "text-red-900"
                        }`}
                      >
                        {checkResult.message}
                      </h3>

                      {checkResult.exists && checkResult.ownerName && (
                        <p className="text-sm text-emerald-700 mb-4">
                          Kode dari:{" "}
                          <span className="font-semibold">
                            {checkResult.ownerName}
                          </span>
                        </p>
                      )}

                      {checkResult.exists && checkResult.benefits && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-emerald-900 mb-3">
                            Benefit yang kamu dapatkan:
                          </p>
                          <ul className="space-y-2">
                            {checkResult.benefits.map((benefit, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-sm text-emerald-800"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>

                          <Button className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
                            Gunakan Kode Ini
                          </Button>
                        </div>
                      )}

                      {!checkResult.exists && (
                        <p className="text-sm text-red-700 mt-2">
                          Pastikan kode yang kamu masukkan benar atau hubungi
                          teman yang membagikan kode referral.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Helper Text */}
              {!checkResult && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    💡 Kode referral biasanya terdiri dari huruf dan angka.
                    Tanyakan kepada teman yang sudah bergabung!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralModule;

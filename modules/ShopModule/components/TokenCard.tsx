import { Check, Coins, Sparkles } from "lucide-react";
import { TokenPackage } from "../interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TokenCard = ({
  pkg,
  onPressBuy,
}: {
  pkg: TokenPackage;
  onPressBuy?: () => void;
}) => (
  <Card
    className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-0 overflow-hidden border-2 ${
      pkg.popular
        ? "border-purple-300 ring-4 ring-purple-100"
        : "border-gray-100"
    }`}
  >
    <div
      className={`bg-gradient-to-r ${pkg.categoryBg} p-6 text-white relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

      <div className="relative z-10">
        {/* Token Amount - Big Display */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border-2 border-white/30">
            <div className="flex items-center gap-3">
              <Coins className="w-8 h-8" />
              <div>
                <div className="text-4xl font-black">{pkg.tokenAmount}</div>
                <div className="text-xs font-semibold opacity-90">Token</div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 text-center leading-tight">
          {pkg.title}
        </h3>
        <p className="text-sm opacity-90 text-center leading-relaxed">
          {pkg.subtitle}
        </p>
      </div>
    </div>

    <CardContent className="p-6">
      {/* Pricing */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-400 line-through text-sm font-medium">
            Rp {pkg.originalPrice.toLocaleString("id-ID")}
          </span>
          <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-lg">
            -{pkg.discount}%
          </span>
        </div>
        <div className="text-3xl font-bold text-emerald-600 mb-2">
          Rp {pkg.finalPrice.toLocaleString("id-ID")}
        </div>
        {pkg.pricePerToken && (
          <div className="text-xs text-gray-500 mb-3">
            Rp {pkg.pricePerToken} per token
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="inline-block">
            <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg">
              Hemat Rp {pkg.savings.toLocaleString("id-ID")}
            </div>
          </div>
          {pkg.badge && (
            <div className="inline-block">
              <div className="text-xs text-orange-700 font-semibold bg-orange-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {pkg.badge}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Buy Button */}
      <Button
        className={`w-full bg-gradient-to-r ${pkg.categoryBg} hover:opacity-90 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105`}
        onClick={onPressBuy}
      >
        Beli Sekarang
      </Button>
    </CardContent>
  </Card>
);

export default TokenCard;

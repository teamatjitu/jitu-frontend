import { Check } from "lucide-react";
import { Package } from "../interface";
import { Button } from "@/components/ui/button";

const BundleCard = ({ pkg }: { pkg: Package }) => (
  <div className="group bg-white rounded-2xl shadow-sm p-8">
    <div
      className={`bg-gradient-to-r ${pkg.categoryBg} p-6 text-white relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
            {pkg.category}
          </span>
          {pkg.badge && pkg.id === 5 && (
            <span className="text-xs font-bold bg-orange-500 px-3 py-1 rounded-full shadow-lg">
              Paling Populer
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2 leading-tight">{pkg.title}</h3>
        <p className="text-sm text-emerald-50 leading-relaxed">
          {pkg.subtitle}
        </p>
      </div>
    </div>

    <div className="p-6">
      <ul className="space-y-3 mb-6">
        {pkg.features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm text-gray-700"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-emerald-600" />
            </div>
            <span className="leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

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
        {pkg.badge && (
          <div className="text-xs text-gray-500 mb-3">Rp {pkg.badge}</div>
        )}
        <div className="inline-block">
          <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg">
            Hemat Rp {pkg.savings.toLocaleString("id-ID")}
          </div>
        </div>
      </div>

      <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-105">
        Lihat Paket
      </Button>
    </div>
  </div>
);

export default BundleCard;

"use client";
import { useSidebar } from "@/components/ui/sidebar";
import BundleCard from "./components/BundleCard";
import { belajarPackages, bundlePackages, tryOutPackages } from "./payload";
import { Package } from "@/types";

const ShopModule = () => {
  const { open } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-20 mt-24 p-8">
        {/* Bundle Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Bundle</h2>
            <p className="text-gray-600">
              Paket lengkap untuk persiapan UTBK maksimal
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundlePackages.map((pkg) => (
              <BundleCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>

        {/* Try Out Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Try Out</h2>
            <p className="text-gray-600">
              Latihan intensif dengan soal berkualitas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tryOutPackages.map((pkg) => (
              <BundleCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>

        {/* Belajar Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Belajar</h2>
            <p className="text-gray-600">Akses materi pembelajaran lengkap</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {belajarPackages.map((pkg) => (
              <BundleCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShopModule;

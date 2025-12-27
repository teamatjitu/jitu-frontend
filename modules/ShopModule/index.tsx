"use client";
import TokenCard from "./components/TokenCard";
import { tokenPackages } from "./payload";

const ShopModule = () => {
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
            {tokenPackages.map((pkg) => (
              <TokenCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShopModule;

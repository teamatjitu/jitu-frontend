import { TokenPackage } from "./interface";

export const tokenPackages: TokenPackage[] = [
  {
    id: 1,
    tokenAmount: 10,
    title: "Paket Starter",
    subtitle: "Cocok untuk mencoba Try Out UTBK pertama kali",
    originalPrice: 150000,
    discount: 33,
    finalPrice: 99000,
    savings: 51000,
    pricePerToken: "9.900",
    categoryBg: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    tokenAmount: 25,
    title: "Paket Reguler",
    subtitle: "Pilihan terbaik untuk persiapan rutin UTBK",
    originalPrice: 350000,
    discount: 43,
    finalPrice: 199000,
    savings: 151000,
    pricePerToken: "7.960",
    categoryBg: "from-purple-500 to-purple-600",
  },
  {
    id: 3,
    tokenAmount: 50,
    title: "Paket Intensif",
    subtitle: "Untuk persiapan maksimal menuju UTBK 2026",
    originalPrice: 650000,
    discount: 54,
    finalPrice: 299000,
    savings: 351000,
    pricePerToken: "5.980",
    categoryBg: "from-emerald-500 to-emerald-600",
  },
];

export const contactInfos = [
  {
    name: "Hakim Ninja Mie",
    contacts: {
      LINE: "@hakimnm",
      Email: "hakimnm@email.net",
      WhatsApp: "0812-3456-7890",
    },
  },
];

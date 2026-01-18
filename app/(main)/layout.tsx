"use client";
import Navbar from "@/components/elements/Navbar/Navbar";
// import Header from "@/components/elements/Navbar/Header"; // Header dihapus dari layout
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

const HIDDEN_NAVBAR_ROUTES = ["/"];

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbar = HIDDEN_NAVBAR_ROUTES.includes(pathname);

  return (
    <SidebarProvider defaultOpen={false}>
      {/* Container utama menggunakan flex agar Sidebar dan Content berdampingan.
        Class 'font-open-sans' dipertahankan sesuai layout aslimu.
      */}
      <div className="flex font-open-sans min-h-screen w-full bg-slate-50/50">
        {/* 1. Sidebar (Navbar) di kiri */}
        {!hideNavbar && <Navbar />}

        {/* 2. Area Konten Utama (Header + Children) */}
        {/* SidebarInset otomatis mengisi sisa ruang dan menghitung lebar yang pas */}
        <SidebarInset className="flex w-full flex-col overflow-hidden">
          {/* Header dihapus agar tampilan lebih bersih */}
          {/* {!hideNavbar && <Header />} */}

          {/* Konten halaman yang bisa discroll */}
          <main className="flex-1 overflow-y-auto  ">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

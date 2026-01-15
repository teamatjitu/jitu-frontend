import Navbar from "@/components/elements/Navbar/Navbar";
import Header from "@/components/elements/Navbar/Header"; // Pastikan file Header ini ada
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={false}>
      {/* Container utama menggunakan flex agar Sidebar dan Content berdampingan.
        Class 'font-open-sans' dipertahankan sesuai layout aslimu.
      */}
      <div className="flex font-open-sans min-h-screen w-full bg-slate-50/50">
        
        {/* 1. Sidebar (Navbar) di kiri */}
        <Navbar />

        {/* 2. Area Konten Utama (Header + Children) */}
        {/* SidebarInset otomatis mengisi sisa ruang dan menghitung lebar yang pas */}
        <SidebarInset className="flex w-full flex-col overflow-hidden">
          
          {/* Header menempel di atas */}
          <Header />
          
          {/* Konten halaman yang bisa discroll */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
          
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
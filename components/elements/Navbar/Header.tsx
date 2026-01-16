"use client";
import { Bell, Search, Menu, User, Settings, LogOut } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar"; // Import hook dari Shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function Header() {
  const { toggleSidebar } = useSidebar(); // Gunakan toggleSidebar bawaan Shadcn
  const router = useRouter();
  const pathname = usePathname();

  // Logika Judul (Bisa disesuaikan lagi)
  let pageTitle = "Dashboard";
  if (pathname.includes("/profile")) pageTitle = "Profil Saya";
  else if (pathname.includes("/tryout")) pageTitle = "Tryout";
  else if (pathname.includes("/history")) pageTitle = "Riwayat";
  else if (pathname.includes("/shop")) pageTitle = "Shop";

  return (
    // PENTING: Gunakan sticky top-0 dan w-full.
    // Hapus logic "w-[calc...]" dan "fixed right-0". SidebarInset akan mengurusnya.
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-white px-6 shadow-sm">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Cari..."
              className="w-64 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Notifikasi */}
          <button className="relative rounded-xl p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Hamburger / Toggle Sidebar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-xl p-2 hover:bg-gray-100 outline-none">
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white z-50">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" /> Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <Settings className="mr-2 h-4 w-4" /> Pengaturan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                 className="text-red-600 focus:text-red-600 focus:bg-red-50"
                 onClick={async () => {
                    await signOut({ fetchOptions: { onSuccess: () => router.push("/login") } });
                 }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
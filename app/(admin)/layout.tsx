import AdminNavbar from "@/components/elements/AdminNavbar/AdminNavbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AdminNavbar />
      <SidebarInset className="flex flex-col transition-all duration-300 ease-in-out">
        <main className="flex-1 font-open-sans p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

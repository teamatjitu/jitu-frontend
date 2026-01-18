import Navbar from "@/components/elements/Navbar/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="font-open-sans min-h-screen w-full">
        <Navbar />
        {children}
      </div>
    </SidebarProvider>
  );
}

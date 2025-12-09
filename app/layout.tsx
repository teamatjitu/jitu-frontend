import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Navbar from "@/components/elements/Navbar/Navbar";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "JituPTN",
  description: "Website Resmi JituPTN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`}>
        <SidebarProvider defaultOpen={false}>
          <div className="font-open-sans min-h-screen w-full">
            <Navbar />
            <SidebarTrigger className="bg-black" />
            {children}
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}

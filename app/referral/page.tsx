"use client";
import { useSidebar } from "@/components/ui/sidebar";

export default function ReferralPage() {
  const { open } = useSidebar();

  return (
    <div
      className={`${
        open ? "w-[calc(100%-16rem)]" : "w-[calc(100%-5rem)]"
      } transition-[width] duration-200 ease-linear ml-auto mt-24 h-full`}
    >
      Referral Page
    </div>
  );
}

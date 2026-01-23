"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  items: NavItem[];
  className?: string;
}

const BottomNav = ({ items, className }: BottomNavProps) => {
  const path = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg md:hidden pb-safe",
        className
      )}
    >
      <div className="flex justify-around items-center h-16">
        {items.map((item) => {
          // Check active state
          // For admin, paths might be "admin/" vs "admin/tryout"
          // We need robust checking.
          // Logic from Navbars: path.endsWith(item.path) or startsWith depending on context.
          // Let's stick to a simple check that works for both if possible, or accept minor deviation.
          // Navbar.tsx uses: path.endsWith(item.path)
          // AdminNavbar.tsx uses: path.endsWith(item.path)
          
          // However, for root paths like "dashboard" vs "dashboard/sub", endsWith might fail or be too specific.
          // Let's try to match loosely if exact match fails, but start with the existing logic.
          const isActive = path.endsWith(item.path) || path === `/${item.path}`;

          return (
            <button
              key={item.title}
              onClick={() => router.push(`/${item.path}`)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-primary transition-colors"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive ? "bg-primary/10" : "bg-transparent"
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px]">{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;

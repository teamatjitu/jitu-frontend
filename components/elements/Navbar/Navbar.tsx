"use client";
import {
  Home,
  ShoppingBag,
  NotebookPen,
  History,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Dashboard",
    path: "dashboard",
    icon: Home,
  },
  {
    title: "Tryout",
    path: "tryout",
    icon: NotebookPen,
  },
  {
    title: "History",
    path: "history",
    icon: History,
  },
  {
    title: "Shop",
    path: "shop",
    icon: ShoppingBag,
  },
];

const Navbar = () => {
  const path = usePathname();
  const router = useRouter();
  const { setOpen } = useSidebar();

  const hidden = ["/login", "/register", "/admin"];
  const isExamPage = path.includes("/exam/");

  if (hidden.includes(path) || isExamPage) {
    return null;
  }

  return (
    <Sidebar
      className="z-40 border-r border-gray-200"
      collapsible="icon"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* --- LOGO ORIGINAL (KEMBALI KE ASAL) --- */}
              <SidebarMenuItem className="mt-2 mb-6">
                <SidebarMenuButton className="hover:bg-transparent active:bg-transparent">
                  <Image src="/logo.png" alt="logo" width={48} height={48} />
                  <span className="text-2xl font-bold text-neutral-800">
                    JituPTN
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* --- MENU ITEMS (STYLE ORIGINAL) --- */}
              {items.map((item) => {
                const isPath = path.endsWith(item.path);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => router.push(`/${item.path}`)}
                        aria-disabled={isPath}
                        className={`${
                          isPath
                            ? "opacity-100!"
                            : "hover:bg-neutral-500/20 transition-colors text-neutral-700"
                        }`}
                      >
                        <div
                          className={`${
                            isPath
                              ? "border-2 border-primary-300 bg-primary-100/30 text-primary-300"
                              : ""
                          } w-12 flex justify-center items-center rounded-xl transition-all`}
                        >
                          <item.icon />
                        </div>
                        <span className="text-base font-semibold">
                          {item.title}
                        </span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default Navbar;
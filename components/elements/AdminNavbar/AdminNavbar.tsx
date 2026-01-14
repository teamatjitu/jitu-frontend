"use client";
import {
  BadgeQuestionMarkIcon,
  BanknoteIcon,
  CalendarDaysIcon,
  CoinsIcon,
  FileExclamationPointIcon,
  FileQuestionIcon,
  NotebookPenIcon,
  UserIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
    title: "Kelola Tryout",
    path: "admin/tryout",
    icon: NotebookPenIcon,
  },
  {
    title: "Kelola User",
    path: "admin/user",
    icon: UserIcon,
  },
  {
    title: "Kelola Pembayaran",
    path: "admin/payments",
    icon: BanknoteIcon,
  },
  {
    title: "Kelola Paket Token",
    path: "admin/packages",
    icon: CoinsIcon,
  },
  {
    title: "Kelola Daily Question",
    path: "admin/daily",
    icon: CalendarDaysIcon,
  },
];

const AdminNavbar = () => {
  const path = usePathname();
  const router = useRouter();
  const { open, setOpen } = useSidebar();

  return (
    <div>
      <Sidebar
        collapsible="icon"
        onMouseOver={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="mt-2 mb-6">
                  <SidebarMenuButton>
                    <Image src="/logo.png" alt="logo" width={48} height={48} />
                    <span className="text-2xl font-bold text-neutral-800">
                      JituPTN
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
                            } w-12 flex justify-center items-center rounded-xl`}
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
    </div>
  );
};

export default AdminNavbar;

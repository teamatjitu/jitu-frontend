"use client";
import {
  Menu,
  Bell,
  Search,
  Calendar,
  Home,
  Inbox,
  Settings,
  BookOpen,
  TrendingUp,
  ShoppingBag,
  NotebookPen,
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
import { usePathname } from "next/navigation";

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
    title: "Progress",
    path: "progress",
    icon: TrendingUp,
  },
  {
    title: "Toko",
    path: "toko",
    icon: ShoppingBag,
  },
];

const Navbar = () => {
  const path = usePathname();
  const { open, setOpen } = useSidebar();

  return (
    <div>
      <Sidebar
        className="z-9999"
        collapsible="icon"
        onMouseOver={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isPath = path.endsWith(item.path);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.path}
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
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Top Bar */}
      <header
        className={`${
          open ? "w-[calc(100%-16rem)]" : "w-[calc(100%-5rem)]"
        } bg-white border-b border-gray-200 fixed right-0 z-9999 transition-[left,right,width] duration-200 ease-linear`}
      >
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">
                Selamat datang kembali, Hakim! 👋
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari try out..."
                  className="w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A7BFF] focus:bg-white transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-all">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;

"use client";
import {
  ArrowRightFromLine,
  Banknote,
  BrushCleaning,
  Calendar,
  Clipboard,
  Home,
  House,
  Inbox,
  LogOut,
  LogOutIcon,
  Pill,
  Search,
  Settings,
  Sprout,
  SquarePen,
  Syringe,
  Users,
  Utensils,
  Warehouse,
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
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { useAuthStore } from "@/stores/authStore";

// Menu items.
const items = [
  {
    title: "Heo & Chuồng",
    url: "/barns",
    icon: SquarePen,
  },
  {
    title: "Vắc-xin",
    url: "/vaccines",
    icon: Syringe,
  },
  {
    title: "Heo bệnh",
    url: "/health",
    icon: Pill,
  },
  {
    title: "Xuất chuồng",
    url: "/export",
    icon: Settings,
  },
  {
    title: "Kho",
    url: "/inventory",
    icon: Warehouse,
  },
  {
    title: "Khẩu phần",
    url: "/feeding",
    icon: Utensils,
  },
  {
    title: "Vệ sinh",
    url: "/sanitation",
    icon: BrushCleaning,
  },
  {
    title: "Chi phí",
    url: "/costs",
    icon: Banknote,
  },
  {
    title: "Môi trường",
    url: "/environment",
    icon: Sprout,
  },
  {
    title: "Phân công",
    url: "/tasks",
    icon: Users,
  },
  {
    title: "Báo cáo",
    url: "/reports",
    icon: Clipboard,
  },
  {
    title: "Hệ thống và phân quyền",
    url: "#",
    icon: Settings,
  },
  {
    title: "Đăng xuất",
    url: "#",
    icon: LogOutIcon,
  },
];

const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  // teams: [
  //   {
  //     name: "Acme Inc",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   {
  //     name: "Acme Corp.",
  //     logo: AudioWaveform,
  //     plan: "Startup",
  //   },
  //   {
  //     name: "Evil Corp.",
  //     logo: Command,
  //     plan: "Free",
  //   },
  // ],
  navMain: [
    {
      title: "Heo & Chuồng",
      url: "/barns",
      icon: SquarePen,
      isActive: true,
      items: [{ title: "Nhập heo", url: "/barns/barns_in" }],
      key: "HEO_CHUONG",
    },
    {
      title: "Vắc-xin",
      url: "/vaccines",
      icon: Syringe,
      key: "VAC_XIN",
    },
    {
      title: "Heo bệnh",
      url: "/health",
      icon: Pill,
      key: "HEO_BENH",
    },
    {
      title: "Xuất chuồng",
      url: "/export",
      icon: ArrowRightFromLine,
      key: "XUAT_CHUONG",
    },
    {
      title: "Kho",
      url: "/inventory",
      icon: Warehouse,
      items: [
        // { title: 'Tồn kho', url: '/inventory' },
        { title: "Kho hàng", url: "/inventory/warehouses" },
        { title: "Sản phẩm", url: "/inventory/products" },
        { title: "Phiếu nhập", url: "/inventory/receipts" },
        { title: "Phiếu xuất", url: "/inventory/issues" },
        { title: "Nhà cung cấp", url: "/inventory/suppliers" },
        { title: "Lịch sử", url: "/inventory/history" },
      ],
      key: "KHO",
    },
    {
      title: "Khẩu phần",
      url: "/feeding",
      icon: Utensils,
      key: "KHAU_PHAN",
    },

    {
      title: "Chi phí",
      url: "/finance",
      icon: Banknote,
      items: [
        // { title: 'Tổng quan', url: '/finance' },
        { title: "Phiếu thu/chi", url: "/finance/transactions" },
        { title: "Tài khoản quỹ", url: "/finance/accounts" },
        { title: "Công nợ NCC", url: "/finance/supplier-debts" },
        // { title: 'Hóa đơn tháng', url: '/finance/monthly-bills' },
        // { title: 'Báo cáo', url: '/finance/reports' },
      ],
      key: "CHI_PHI",
    },
    {
      title: "Phân công",
      url: "/tasks",
      icon: Users,
      items: [
        { title: "Danh sách công việc", url: "/tasks" },
        { title: "Lịch của tôi", url: "/tasks/my-schedule" },
      ],
      key: "PHAN_CONG",
    },
    {
      title: "Báo cáo",
      url: "/reports",
      icon: Clipboard,
      items: [
        { title: "Tổng quan", url: "/reports" },
        { title: "Báo cáo heo", url: "/reports/pigs" },
        { title: "Báo cáo vắc-xin", url: "/reports/vaccines" },
        { title: "Báo cáo tồn kho", url: "/reports/inventory" },
        { title: "Báo cáo doanh thu", url: "/reports/revenue" },
        { title: "Báo cáo chi phí", url: "/reports/expenses" },
      ],
      key: "BAO_CAO",
    },
    {
      title: "Hệ thống và phân quyền",
      url: "/settings",
      icon: Settings,
      key: "SETTINGS",
    },
    // {
    //   title: "Đăng xuất",
    //   url: "#",
    //   icon: LogOutIcon,
    //   key: "LOGOUT"
    // },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const authStore = useAuthStore();
  const userPermissions = authStore.userPermissions;
  const filteredItems = data.navMain.filter((item) =>
    userPermissions.includes(item.key)
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={filteredItems} />
        <SidebarGroup>
          <SidebarMenuItem key={"Đăng xuất"}>
            <SidebarMenuButton
              asChild
              tooltip={"Đăng xuất"}
              onClick={() => authStore.logout()}
            >
              <div>
                <LogOutIcon />
                <span>{"Đăng xuất"}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

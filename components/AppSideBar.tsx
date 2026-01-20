"use client"
import { Banknote, BrushCleaning, Calendar, Clipboard, Home, House, Inbox, LogOut, LogOutIcon, Pill, Search, Settings, Sprout, SquarePen, Syringe, Users, Utensils, Warehouse } from "lucide-react"
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
 
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
]


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
      url: "#",
      icon: SquarePen,
      isActive: true,
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
    items: [
      // { title: 'Tồn kho', url: '/inventory' },
      { title: 'Kho hàng', url: '/inventory/warehouses' },
      { title: 'Sản phẩm', url: '/inventory/products' },
      { title: 'Phiếu nhập', url: '/inventory/receipts' },
      { title: 'Phiếu xuất', url: '/inventory/issues' },
      { title: 'Nhà cung cấp', url: '/inventory/suppliers' },
      { title: 'Lịch sử', url: '/inventory/history' },

    ]
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
    url: "/finance",
    icon: Banknote,
    items: [
      // { title: 'Tổng quan', url: '/finance' },
      { title: 'Phiếu thu/chi', url: '/finance/transactions' },
      { title: 'Tài khoản quỹ', url: '/finance/accounts' },
      { title: 'Công nợ NCC', url: '/finance/supplier-debts' },
      // { title: 'Hóa đơn tháng', url: '/finance/monthly-bills' },
      // { title: 'Báo cáo', url: '/finance/reports' },
    ]
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
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Đăng xuất",
    url: "#",
    icon: LogOutIcon,
  },
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
}
 
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}

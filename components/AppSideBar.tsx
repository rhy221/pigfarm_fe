 import { Banknote, BrushCleaning, Clipboard, LogOutIcon, Pill, Settings, SquarePen, Syringe, Users, Utensils, Warehouse } from "lucide-react"

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

const items = [
  { title: "Heo & Chuồng", url: "#", icon: SquarePen, key: "HEO_CHUONG" },
  { title: "Vắc-xin", url: "#", icon: Syringe, key: "VAC_XIN" },
  { title: "Heo bệnh", url: "/health", icon: Pill, key: "HEO_BENH" },
  { title: "Xuất chuồng", url: "/export", icon: Settings, key: "XUAT_CHUONG" },
  { title: "Kho", url: "#", icon: Warehouse, key: "KHO" },
  { title: "Khẩu phần", url: "#", icon: Utensils, key: "KHAU_PHAN" },
  { title: "Vệ sinh", url: "#", icon: BrushCleaning, key: "VE_SINH" },
  { title: "Chi phí", url: "#", icon: Banknote, key: "CHI_PHI" },
  { title: "Phân công", url: "#", icon: Users, key: "PHAN_CONG" },
  { title: "Báo cáo", url: "#", icon: Clipboard, key: "BAO_CAO" },
  { title: "Hệ thống và phân quyền", url: "/settings", icon: Settings, key: "SETTINGS" },
  { title: "Đăng xuất", url: "#", icon: LogOutIcon, key: "LOGOUT" },
]

export function AppSidebar({ userPermissions = [] }: { userPermissions?: string[] }) {
  const filteredItems = items.filter(item => 
    item.key === "LOGOUT" || userPermissions.includes(item.key)
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

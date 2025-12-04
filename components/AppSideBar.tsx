import { Banknote, BrushCleaning, Calendar, Clipboard, Home, House, Inbox, Pill, Search, Settings, Sprout, SquarePen, Syringe, Users, Utensils, Warehouse } from "lucide-react"
 
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
 
// Menu items.
const items = [
  {
    title: "Tiếp nhận",
    url: "#",
    icon: SquarePen,
  },
  {
    title: "Chuồng trại",
    url: "#",
    icon: House,
  },
  {
    title: "Vắc-xin",
    url: "#",
    icon: Syringe,
  },
  {
    title: "Heo bệnh",
    url: "#",
    icon: Pill,
  },
  {
    title: "Xuất chuồng",
    url: "#",
    icon: Settings,
  },
  {
    title: "Kho",
    url: "#",
    icon: Warehouse,
  },
  {
    title: "Khẩu phần",
    url: "#",
    icon: Utensils,
  },
  {
    title: "Vệ sinh",
    url: "#",
    icon: BrushCleaning,
  },
  {
    title: "Chi phí",
    url: "#",
    icon: Banknote,
  },
  {
    title: "Môi trường",
    url: "#",
    icon: Sprout,
  },
  {
    title: "Phân công",
    url: "#",
    icon: Users,
  },
  {
    title: "Báo cáo",
    url: "#",
    icon: Clipboard,
  },
]
 
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
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
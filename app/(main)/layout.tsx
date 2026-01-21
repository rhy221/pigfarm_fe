import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSideBar";
import QueryProvider from "@/providers/query-provider";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";
import { ChatWidget } from "@/components/ChatWidget";
import AuthGuard from "@/components/auth-guard";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
            <AuthGuard>
                <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              {/* <SidebarTrigger /> */}

              <Header />
              <main className="min-h-screen w-full p-8">{children}</main>
              {/* <Toaster /> */}
              <ChatWidget />
            </SidebarInset>
          </SidebarProvider>
            </AuthGuard>
          
        
      
    </div>
  );
}
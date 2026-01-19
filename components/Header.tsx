"use client"

import { Search, Settings, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "./ui/sidebar"

export function Header() {
  return (
    <header className="border-b-2 ">
        <nav className="mx-4 flex items-center justify-between py-4">
          <SidebarTrigger />
             <div className="flex flex-1 items-center max-w-md gap-4">
                <div className="">
                    <h1 className="text-2xl font-bold text-primary">VIETNAPIG</h1>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="text" placeholder="Tìm kiếm..." 
                    className="pl-10 bg-muted border-0 w-screen max-w-2xl" />
                </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="icon-lg">
          <Settings />
        </Button>
        <Button variant="ghost" size="icon-lg">
          <User  />
        </Button>
      </div>
        </nav>
     
    </header>
  )
}

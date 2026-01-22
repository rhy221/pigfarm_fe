"use client"

import { Button } from "@/components/ui/button"
import { FeedingTab } from "../page"
import { cn } from "@/lib/utils"

type Props = {
  tab: FeedingTab
  onChangeTab: (tab: FeedingTab) => void
}

export default function FeedingHeader({ tab, onChangeTab }: Props) {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        size="sm"
        onClick={() => onChangeTab("schedule")}
        className={cn(
            "transition-all",
            tab === "schedule" 
                ? "bg-[#53A88B] hover:bg-[#45b883] text-white shadow-md" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
        )}
      >
        📅 Lịch cho ăn
      </Button>

      <Button
        size="sm"
        onClick={() => onChangeTab("adjust")}
        className={cn(
            "transition-all",
            tab === "adjust" 
                ? "bg-[#53A88B] hover:bg-[#45b883] text-white shadow-md" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
        )}
      >
        ⚙️ Điều chỉnh
      </Button>
    </div>
  )
}
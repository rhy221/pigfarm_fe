"use client"

import { Button } from "@/components/ui/button"
import { FeedingTab } from "../page"

type Props = {
  tab: FeedingTab
  onChangeTab: (tab: FeedingTab) => void
}

export default function FeedingHeader({ tab, onChangeTab }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={tab === "schedule" ? "default" : "outline"}
        onClick={() => onChangeTab("schedule")}
      >
        Lịch cho ăn
      </Button>

      <Button
        size="sm"
        variant={tab === "adjust" ? "default" : "outline"}
        onClick={() => onChangeTab("adjust")}
      >
        Điều chỉnh
      </Button>
    </div>
  )
}

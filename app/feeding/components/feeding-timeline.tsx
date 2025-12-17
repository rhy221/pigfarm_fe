"use client"

import { Button } from "@/components/ui/button"

const feedingTimes = [
  { time: "3:00", status: "completed", icon: "⭕" },
  { time: "4:00", status: "completed", icon: "⭕" },
  { time: "5:00", status: "completed", icon: "⭕" },
  { time: "6:00", status: "error", icon: "🔴" },
  { time: "7:00", status: "warning", icon: "✅" },
  { time: "8:00", status: "pending", icon: "⏰" },
  { time: "9:00", status: "active", icon: "⏰" },
  { time: "10:00", status: "pending", icon: "⏰" },
  { time: "11:00", status: "pending", icon: "⏰" },
  { time: "12:00", status: "pending", icon: "⏰" },
  { time: "13:00", status: "pending", icon: "⏰" },
  { time: "14:00", status: "pending", icon: "⏰" },
]

interface FeedingTimelineProps {
  selectedTime: string
  onSelectTime: (time: string) => void
}

export function FeedingTimeline({ selectedTime, onSelectTime }: FeedingTimelineProps) {
  return (
    <div className="flex items-center gap-8 overflow-x-auto pb-2">
      {feedingTimes.map((item, index) => (
        <div key={item.time} className="flex flex-col items-center gap-2 shrink-0">
          {index > 0 && (
            <div className="absolute -left-4 top-0 w-8 h-0.5 bg-dotted border-t border-dashed border-muted-foreground/30" />
          )}

          <Button
            variant={selectedTime === item.time ? "default" : "ghost"}
            size="icon"
            className={`w-10 h-10 rounded-full ${
              item.status === "active"
                ? "bg-warning text-white"
                : item.status === "error"
                  ? "bg-destructive text-white"
                  : item.status === "warning"
                    ? "bg-success text-white"
                    : item.status === "completed"
                      ? "bg-muted text-muted-foreground"
                      : selectedTime === item.time
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
            }`}
            onClick={() => onSelectTime(item.time)}
          >
            <span className="text-lg">{item.icon}</span>
          </Button>

          <span className="text-xs font-semibold text-foreground">{item.time}</span>
        </div>
      ))}
    </div>
  )
}

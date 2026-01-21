"use client"

type StageType = "normal" | "alert" | "done" | "current"

type StageItem = {
  stage: string        // Giai đoạn 1, 2, 3...
  label?: string       // mô tả bên trên
  type?: StageType
}

const stages = [
  { stage: "GĐ 1", label: "Heo mới về (≤ 7 ngày)", type: "done" },
  { stage: "GĐ 2", label: "7 – 30 ngày", type: "done" },
  { stage: "GĐ 3", label: "30 – 60 ngày", type: "alert" },
  { stage: "GĐ 4", label: "60 – 100 ngày", type: "current" },
  { stage: "GĐ 5", label: "Xuất chuồng", type: "normal" },
]


function getDotStyle(type?: StageType) {
  switch (type) {
    case "done":
      return "bg-slate-500"
    case "alert":
      return "bg-red-500"
    case "current":
      return "bg-emerald-500"
    default:
      return "bg-orange-400"
  }
}

export default function FeedingTimeline() {
  return (
    <div className="relative w-full py-6">
      {/* đường nét đứt trung tâm */}
      <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-emerald-400" />

      <div className="flex justify-between items-center relative">
        {stages.map((item, index) => (
          <div key={index} className="flex flex-col items-center relative">
            {/* vạch đứng */}
            <div className="h-10 w-px bg-emerald-400" />

            {/* chấm tròn */}
            <div
              className={`w-6 h-6 rounded-full border-2 border-white ${getDotStyle(
                item.type
              )}`}
            />

            {/* tên giai đoạn */}
            <div className="mt-2 text-xs font-medium text-slate-600">
              {item.stage}
            </div>

            {/* bubble mô tả */}
            {item.label && (
              <div className="absolute -top-12 bg-emerald-500 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap shadow">
                <div className="font-semibold">{item.stage}</div>
                <div>{item.label}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

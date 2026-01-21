// "use client" // Bắt buộc có dòng này vì sử dụng useState

// import { Button } from "@/components/ui/button"
// import { useState } from "react"
// import AddVaccineModal from "./add_vaccine_modal"

// export default function CalendarHeader() {
//   // 1. Khai báo state để điều khiển Modal
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   return (
//     <div className="flex items-center justify-between mb-6">
//       {/* Tabs */}
//       <div className="flex gap-2">
//         <Button 
//           size="sm"
//         >
//           Lịch tiêm
//         </Button>
//         <Button 
//           size="sm" 
//           variant="outline"
//           className="text-slate-600 font-medium"
//         >
//           Mẫu tiêm
//         </Button>
//       </div>

//       {/* 2. Gắn sự kiện mở Modal vào nút Thêm lịch */}
//       <Button 
//         size="sm" 
//         onClick={() => setIsModalOpen(true)}
//       >
//         + Thêm lịch
//       </Button>

//       {/* 3. Chèn Modal vào đây */}
//       <AddVaccineModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//       />
//     </div>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import AddVaccineModal from "./add_vaccine_modal"
import { VaccineTab } from "../page"

type Props = {
  tab: VaccineTab
  onChangeTab: (tab: VaccineTab) => void
}

export default function CalendarHeader({ tab, onChangeTab }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={tab === "vaccines" ? "default" : "outline"}
          onClick={() => onChangeTab("vaccines")}
        >
          Lịch tiêm
        </Button>

        <Button
          size="sm"
          variant={tab === "vaccines_sample" ? "default" : "outline"}
          className={tab !== "vaccines_sample" ? "text-slate-600 font-medium" : ""}
          onClick={() => onChangeTab("vaccines_sample")}
        >
          Mẫu tiêm
        </Button>
      </div>

      {/* Nút thêm */}
      <Button
        size="sm"
        onClick={() => setIsModalOpen(true)}
        disabled={tab === "vaccines_sample"}
      >
        + Thêm lịch
      </Button>

      <AddVaccineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

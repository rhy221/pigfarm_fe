import { Card, CardContent } from "@/components/ui/card";
import {
  Warehouse,
  Syringe,
  Banknote,
  TrendingUp,
  PiggyBank,
} from "lucide-react";
import Link from "next/link";

const reports = [
  {
    title: "Heo",
    description: "Báo cáo đàn heo và heo tại chuồng",
    icon: PiggyBank,
    href: "/reports/pigs",
    color: "text-green-600",
  },
  {
    title: "Tồn kho",
    description: "Báo cáo tồn kho vật tư",
    icon: Warehouse,
    href: "/reports/inventory",
    color: "text-blue-600",
  },
  {
    title: "Vắc-xin",
    description: "Báo cáo hiệu quả vắc-xin",
    icon: Syringe,
    href: "/reports/vaccines",
    color: "text-purple-600",
  },
  {
    title: "Doanh thu",
    description: "Báo cáo doanh thu",
    icon: TrendingUp,
    href: "/reports/revenue",
    color: "text-emerald-600",
  },
  {
    title: "Chi phí",
    description: "Báo cáo chi phí",
    icon: Banknote,
    href: "/reports/expenses",
    color: "text-orange-600",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#53A88B]">Lập báo cáo</h1>
        <p className="text-gray-600 mt-1">Chọn loại báo cáo bạn muốn xem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Link key={report.href} href={report.href}>
              <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full">
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                  <div className={`${report.color} bg-gray-50 p-6 rounded-lg`}>
                    <Icon className="w-16 h-16" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                    <p className="text-sm text-gray-500">
                      {report.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

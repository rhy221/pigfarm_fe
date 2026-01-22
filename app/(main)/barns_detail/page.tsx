"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import TransferBarnModal from "@/app/(main)/barns_detail/barns_transfer_modal";
// Giả định bạn đã tạo file này ở bước trước

export default function BarnDetailPage() {
  const router = useRouter();
  const params = useParams();
  const penId = params.id as string;

  // --- States ---
  const [penData, setPenData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedPigIds, setSelectedPigIds] = useState<string[]>([]);
  const [openTransfer, setOpenTransfer] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Gọi API lấy chi tiết chuồng từ PensController
        // const data = await dashboardApi.getPenDetail(penId)
        // setPenData(data)
      } catch (err: any) {
        setError("Không thể tải thông tin chuồng heo.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (penId) fetchDetail();
  }, [penId]);

  // --- Logic Tìm kiếm ---
  const filteredPigs = useMemo(() => {
    const pigsList = penData?.pigs || [];
    if (!search.trim()) return pigsList;

    const keyword = search.toLowerCase();
    return pigsList.filter(
      (pig: any) =>
        pig.id.toLowerCase().includes(keyword) ||
        (pig.ear_tag && pig.ear_tag.toLowerCase().includes(keyword))
    );
  }, [search, penData]);

  // --- Logic Chọn nhiều ---
  const isAllSelected =
    filteredPigs.length > 0 &&
    filteredPigs.every((pig: any) => selectedPigIds.includes(pig.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPigIds((prev) =>
        prev.filter((id) => !filteredPigs.some((p: any) => p.id === id))
      );
    } else {
      setSelectedPigIds((prev) => {
        const ids = filteredPigs.map((p: any) => p.id);
        return Array.from(new Set([...prev, ...ids]));
      });
    }
  };

  // --- Render logic ---
  if (loading)
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Đang tải dữ liệu chuồng...
        </p>
      </div>
    );

  if (error || !penData)
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">
          {error || "Dữ liệu không tồn tại"}
        </p>
        <Button onClick={() => router.back()}>Quay lại</Button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-xl font-bold">{penData.pen_name}</h1>
          <p className="text-xs text-muted-foreground">ID: {penId}</p>
        </div>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log("Edit pen", penId)}>
                Chỉnh sửa thông tin
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => console.log("Delete pen", penId)}
              >
                Xóa chuồng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ===== THÔNG TIN TỔNG QUAN ===== */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Số lượng heo</p>
          <p className="text-2xl font-bold">
            {penData.pigs?.length || 0} / {penData.capacity || 100}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">🌡 Nhiệt độ</p>
          <p
            className={`text-2xl font-bold ${penData.temperature > 32 ? "text-red-500" : "text-green-600"}`}
          >
            {penData.temperature}°C
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">💧 Độ ẩm</p>
          <p className="text-2xl font-bold text-blue-600">
            {penData.humidity}%
          </p>
        </div>
      </div>

      {/* ===== DANH SÁCH HEO TRONG CHUỒNG ===== */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo ID hoặc mã tai..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Đang chọn <b>{selectedPigIds.length}</b> / {filteredPigs.length} con
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>STT</TableHead>
                <TableHead>Mã số (ID)</TableHead>
                <TableHead>Mã tai</TableHead>
                <TableHead className="text-right">Trọng lượng (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPigs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Không có heo nào trong chuồng này.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPigs.map((pig: any, index: number) => (
                  <TableRow key={pig.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPigIds.includes(pig.id)}
                        onCheckedChange={(checked) => {
                          setSelectedPigIds((prev) =>
                            checked
                              ? [...prev, pig.id]
                              : prev.filter((id) => id !== pig.id)
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {pig.id}
                    </TableCell>
                    <TableCell>{pig.ear_tag || "---"}</TableCell>
                    <TableCell className="text-right font-medium">
                      {pig.weight || 0}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ===== NÚT THAO TÁC NỔI (Sticky Action Bar) ===== */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          disabled={selectedPigIds.length === 0}
          onClick={() => setOpenTransfer(true)}
        >
          Chuyển chuồng ({selectedPigIds.length})
        </Button>
        <Button onClick={() => router.push("/barns_in")}>
          Tiếp nhận heo mới
        </Button>
      </div>

      {/* MODAL CHUYỂN CHUỒNG */}
      <TransferBarnModal
        isOpen={openTransfer}
        onClose={() => setOpenTransfer(false)}
        selectedPigIds={selectedPigIds}
        // Barns này nên được fetch từ api.getPens() trong thực tế
        barns={[]}
        onSubmit={async (payload) => {
          console.log("Gửi API chuyển chuồng:", payload);
          // barnsApi.transferPigs(payload)
          setOpenTransfer(false);
          setSelectedPigIds([]);
        }}
      />
    </div>
  );
}

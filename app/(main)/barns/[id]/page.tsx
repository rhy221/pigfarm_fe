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
  Save,
  X,
  Pencil,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

// Notification
import { toast } from "sonner";

// API & Types
import { barnsApi } from "@/app/api/barns";
import type { Pig } from "@/app/api/barns";
import TransferBarnModal from "../barns_transfer_modal";

// ✅ 1. Định nghĩa kiểu dữ liệu Disease ngay tại đây để tránh lỗi type import
type Disease = {
  id: string;
  name: string;
};

export default function BarnDetailPage() {
  const router = useRouter();
  const params = useParams();
  const penId = params.id as string;

  // ===== STATE DATA =====
  const [pen, setPen] = useState<any>(null);
  const [pigs, setPigs] = useState<Pig[]>([]);
  
  // State cho Modal chuyển chuồng
  const [regularPens, setRegularPens] = useState<any[]>([]);
  const [isolationPens, setIsolationPens] = useState<any[]>([]);
  
  // ✅ 2. State danh sách bệnh (Sử dụng type Disease vừa định nghĩa)
  const [diseases, setDiseases] = useState<Disease[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===== STATE UI =====
  const [search, setSearch] = useState("");
  const [selectedPigIds, setSelectedPigIds] = useState<string[]>([]);
  const [openTransfer, setOpenTransfer] = useState(false);

  // ===== STATE EDIT =====
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState<{ [id: string]: { earTag: string; weight: number } }>({});

  // ===== FETCH DATA =====
  const fetchData = async () => {
    if (!penId) return;
    try {
      setLoading(true);

      // ✅ 3. Gọi API lấy danh sách bệnh cùng lúc với các dữ liệu khác
      // (Đảm bảo bạn đã thêm hàm getDiseases vào file barns.ts như hướng dẫn trước)
      const [pensData, pigsData, regPens, isoPens, diseaseList] = await Promise.all([
        barnsApi.getPens(),
        barnsApi.getPigsByPenId(penId),
        barnsApi.getRegularPens(),
        barnsApi.getIsolationPens(),
        barnsApi.getDiseases(), 
      ]);

      const currentPen = pensData.find((p) => p.id === penId);
      if (!currentPen) throw new Error("Không tìm thấy chuồng");

      setPen(currentPen);
      setPigs(pigsData);
      
      // Lọc bỏ chuồng hiện tại khỏi danh sách chuyển đến
      setRegularPens(regPens.filter((p: any) => p.id !== penId));
      setIsolationPens(isoPens.filter((p: any) => p.id !== penId));

      // ✅ 4. Set dữ liệu bệnh vào State
      // (QUAN TRỌNG: Đã xóa dòng setDiseases([]) gây lỗi mất dữ liệu ở code cũ)
      setDiseases(diseaseList);

      setEdits({});
    } catch (err: any) {
      console.error(err);
      setError("Không thể tải dữ liệu chuồng");
      toast.error("Lỗi", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [penId]);

  // ===== EDIT HANDLERS =====
  const handleStartEdit = () => {
    const initialEdits: any = {};
    pigs.forEach((p) => {
      initialEdits[p.id] = {
        earTag: p.earTagNumber || "",
        weight: p.weight || 0,
      };
    });
    setEdits(initialEdits);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const itemsToUpdate = Object.entries(edits).map(([id, data]) => ({
        id,
        earTag: data.earTag,
        weight: Number(data.weight),
      }));

      await barnsApi.updatePigDetails({ items: itemsToUpdate });

      toast.success("Đã cập nhật thông tin");
      setIsEditing(false);
      fetchData(); // Reload lại dữ liệu
    } catch (error) {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleEditChange = (id: string, field: "earTag" | "weight", value: string) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // ===== SEARCH & FILTER =====
  const filteredPigs = useMemo(() => {
    if (!search.trim()) return pigs;
    const keyword = search.toLowerCase();

    return pigs.filter(
      (pig) =>
        pig.id.toLowerCase().includes(keyword) ||
        pig.earTagNumber?.toLowerCase().includes(keyword)
    );
  }, [search, pigs]);

  // ===== SELECT ALL =====
  const isAllSelected =
    filteredPigs.length > 0 &&
    filteredPigs.every((pig) => selectedPigIds.includes(pig.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPigIds((prev) =>
        prev.filter((id) => !filteredPigs.some((p) => p.id === id))
      );
    } else {
      setSelectedPigIds((prev) => {
        const ids = filteredPigs.map((p) => p.id);
        return Array.from(new Set([...prev, ...ids]));
      });
    }
  };

  // ===== RENDER =====
  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang tải dữ liệu chuồng...</p>
      </div>
    );
  }

  if (error || !pen) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">{error || "Dữ liệu không tồn tại"}</p>
        <Button onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-xl font-bold">{pen.name}</h1>
            <p className="text-xs text-muted-foreground">ID: {pen.id}</p>
          </div>
        </div>

        {/* Cụm nút Edit */}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="text-red-600">
                <X className="mr-2 h-4 w-4" /> Hủy
              </Button>
              <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" /> Lưu
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleStartEdit}>
              <Pencil className="mr-2 h-4 w-4" /> Cập nhật nhanh
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log("Delete pen", penId)}>
                Xóa chuồng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ===== OVERVIEW ===== */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Số lượng heo</p>
          <p className="text-2xl font-bold">
            {pen.currentPigs} / {pen.capacity}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">🌡 Nhiệt độ</p>
          <p
            className={`text-2xl font-bold ${
              pen.status === "danger"
                ? "text-red-500"
                : pen.status === "warning"
                ? "text-orange-500"
                : "text-green-600"
            }`}
          >
            {pen.temperature}°C
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">💧 Độ ẩm</p>
          <p className="text-2xl font-bold text-blue-600">{pen.humidity}%</p>
        </div>
      </div>

      {/* ===== PIG LIST ===== */}
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

          <div className="flex gap-2 items-center">
            <div className="text-sm text-muted-foreground mr-2">
              Đang chọn <b>{selectedPigIds.length}</b> con
            </div>
            <Button
              variant="destructive"
              disabled={selectedPigIds.length === 0}
              onClick={() => setOpenTransfer(true)}
            >
              Chuyển chuồng ({selectedPigIds.length})
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">
                  <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                </TableHead>
                <TableHead className="text-center">STT</TableHead>
                <TableHead className="text-center">Mã số (ID)</TableHead>
                <TableHead className="text-center">Giống</TableHead>
                <TableHead className="text-center">Mã tai</TableHead>
                <TableHead className="text-center">Cân nặng (kg)</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredPigs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Không có heo nào trong chuồng này
                  </TableCell>
                </TableRow>
              ) : (
                filteredPigs.map((pig, index) => (
                  <TableRow key={pig.id}>
                    <TableCell className="text-center">
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

                    <TableCell className="text-center">{index + 1}</TableCell>

                    <TableCell className="font-mono text-xs text-muted-foreground text-center" title={pig.id}>
                      {pig.id}
                    </TableCell>

                    <TableCell className="text-center">{pig.breed?.name || "---"}</TableCell>

                    <TableCell className="text-center">
                      {isEditing ? (
                        <Input
                          className="h-8 w-24 mx-auto text-center"
                          value={edits[pig.id]?.earTag}
                          onChange={(e) => handleEditChange(pig.id, "earTag", e.target.value)}
                        />
                      ) : (
                        <span className="font-medium">{pig.earTagNumber || "---"}</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {isEditing ? (
                        <Input
                          type="number"
                          className="h-8 w-20 mx-auto text-center"
                          value={edits[pig.id]?.weight}
                          onChange={(e) => handleEditChange(pig.id, "weight", e.target.value)}
                        />
                      ) : (
                        <span>{pig.weight}</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant={
                          pig.status?.name?.toLowerCase().includes("bệnh")
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {pig.status?.name || "Bình thường"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ===== TRANSFER MODAL ===== */}
        <TransferBarnModal
          isOpen={openTransfer}
          onClose={() => setOpenTransfer(false)}
          selectedPigIds={selectedPigIds}
          
          // ✅ 5. Truyền danh sách bệnh và chuồng vào Modal
          diseases={diseases}
          regularPens={regularPens}
          isolationPens={isolationPens}
          
          onSubmit={async (payload: any) => {
            try {
              await barnsApi.transferPig({
                pigIds: payload.pigIds,
                targetPenId: payload.targetBarnId,
                isIsolation: payload.type === "isolation",

                diseaseDate: payload.diseaseDate,
                
                // Gửi diseaseId (UUID) hoặc undefined nếu không chọn
                diseaseId: payload.diseaseType || undefined,
                symptoms: payload.symptom,
              });

              toast.success("Chuyển chuồng thành công");
              setOpenTransfer(false);
              setSelectedPigIds([]);
              fetchData();
            } catch (err: any) {
              toast.error("Lỗi chuyển chuồng", { description: err.message });
            }
          }}
        />
      </div>
    </div>
  );
}
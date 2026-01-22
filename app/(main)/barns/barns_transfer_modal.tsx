"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { barnsApi } from "@/app/api/barns";
import { fetchVaccines } from "@/app/api/vaccines";

/* ================= TYPES ================= */
type Pen = {
  id: string;
  name: string;
};

type Vaccine = {
  id: string;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedPigIds: string[];
  currentBarnId: string;
  onTransferred: () => void;
};

/* ================= COMPONENT ================= */
export default function TransferBarnModal({
  isOpen,
  onClose,
  selectedPigIds,
  currentBarnId,
  onTransferred,
}: Props) {
  const [type, setType] = useState<"normal" | "isolation">("normal");
  const [loading, setLoading] = useState(false);

  const [pens, setPens] = useState<Pen[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);

  const [targetPenId, setTargetPenId] = useState("");
  const [diseaseDate, setDiseaseDate] = useState("");
  const [vaccineId, setVaccineId] = useState("");
  const [symptom, setSymptom] = useState("");

  /* ================= FETCH PENS + VACCINES ================= */
  useEffect(() => {
    if (!isOpen || !currentBarnId) return;

    const fetchData = async () => {
      try {
        const pensPromise =
          type === "normal" ? barnsApi.getPens() : barnsApi.getIsolationPens();

        const [penData, vaccineData] = await Promise.all([
          pensPromise,
          fetchVaccines(),
        ]);

        setPens(penData);
        setVaccines(vaccineData);
      } catch (err) {
        console.error("Fetch transfer data error:", err);
      }
    };

    fetchData();
  }, [isOpen, currentBarnId, type]);

  /* ================= RESET WHEN TYPE CHANGE ================= */
  useEffect(() => {
    setTargetPenId("");
    setDiseaseDate("");
    setVaccineId("");
    setSymptom("");
  }, [type]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (selectedPigIds.length === 0) {
      alert("Chưa chọn heo");
      return;
    }

    if (!targetPenId) {
      alert("Vui lòng chọn chuồng");
      return;
    }

    if (type === "isolation" && (!diseaseDate || !vaccineId)) {
      alert("Vui lòng nhập đầy đủ thông tin cách ly");
      return;
    }

    try {
      setLoading(true);

      const payload: any = {
        pigIds: selectedPigIds, // UUID[]
        targetPenId, // UUID
        isIsolation: type === "isolation", // boolean
      };

      if (type === "isolation") {
        payload.diseaseDate = diseaseDate;
        payload.diseaseId = vaccineId;
        payload.symptoms = symptom;
      }

      await barnsApi.transferPigs(payload);

      onTransferred();

      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Chuyển chuồng thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Chuyển chuồng</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">
          {/* TYPE */}
          <div className="space-y-2">
            <label className="font-semibold text-sm">Hình thức chuyển</label>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={type === "normal"}
                onCheckedChange={(v) => v && setType("normal")}
              />
              Chuyển chuồng thường
            </label>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={type === "isolation"}
                onCheckedChange={(v) => v && setType("isolation")}
              />
              Chuyển sang chuồng cách ly
            </label>
          </div>

          {/* SELECT PEN */}
          <div>
            <label className="font-semibold text-sm">
              {type === "normal" ? "Chuồng mới" : "Chuồng cách ly"}
            </label>
            <select
              className="w-full border rounded p-2 text-sm mt-1"
              value={targetPenId}
              onChange={(e) => setTargetPenId(e.target.value)}
            >
              <option value="">-- Chọn chuồng --</option>
              {pens.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* ISOLATION INFO */}
          {type === "isolation" && (
            <div className="space-y-3 bg-red-50 border rounded-lg p-4">
              <div>
                <label className="font-semibold text-sm">Ngày phát bệnh</label>
                <input
                  type="date"
                  className="w-full border rounded p-2 text-sm"
                  value={diseaseDate}
                  onChange={(e) => setDiseaseDate(e.target.value)}
                />
              </div>

              <div>
                <label className="font-semibold text-sm">
                  Vaccine liên quan
                </label>
                <select
                  className="w-full border rounded p-2 text-sm"
                  value={vaccineId}
                  onChange={(e) => setVaccineId(e.target.value)}
                >
                  <option value="">-- Chọn vaccine --</option>
                  {vaccines.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-sm">Triệu chứng</label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Đang xử lý..." : "Xác nhận chuyển"}
          </Button>
        </div>
      </div>
    </div>
  );
}

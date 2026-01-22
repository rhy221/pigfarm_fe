"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { barnsApi } from "@/app/api/barns"
import { ArrowLeft, ChevronDown, Loader2, X, Plus } from "lucide-react"

/* ================= TYPES ================= */
type PigRow = {
  id: string
  code: string
  earTag: string
  weight?: number
}

type Pen = {
  id: string
  pen_name: string
}

/* ================= PAGE ================= */
export default function PigIntakePage() {
  const router = useRouter()

  /* ===== META ===== */
  const [breeds, setBreeds] = React.useState<{ id: string; name: string }[]>([])
  const [vaccines, setVaccines] = React.useState<{ id: string; name: string }[]>([])
  const [breedId, setBreedId] = React.useState("")
  const [vaccineIds, setVaccineIds] = React.useState<string[]>([])

  /* ===== LỨA ===== */
  const availableBatches = ["01", "02", "03", "04"]
  const [batch, setBatch] = React.useState("")
  const [isNewBatch, setIsNewBatch] = React.useState(false)
  const [batches, setBatches] = React.useState<{
    id: string
    batch_name: string
    arrival_date: string
    breed_id?: string 
    days_old?: number
    vaccineIds?: string[] 
  }[]>([])

  /* ===== FORM ===== */
  const [arrivalDate, setArrivalDate] = React.useState("")
  const [daysOld, setDaysOld] = React.useState(0)
  const [count, setCount] = React.useState(0)

  /* ===== CHUỒNG ===== */
  const [selectedBarn, setSelectedBarn] = React.useState<Pen | null>(null)
  const [emptyBarns, setEmptyBarns] = React.useState<Pen[]>([])
  const [loadingBarns, setLoadingBarns] = React.useState(true)

  /* ===== FLOW ===== */
  const [showDetail, setShowDetail] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  /* ===== DATA ===== */
  const [rows, setRows] = React.useState<PigRow[]>([])

  /* ===== HANDLERS VACCINE ===== */
  const handleSelectVaccine = (id: string) => {
    if (!vaccineIds.includes(id)) {
      setVaccineIds([...vaccineIds, id])
    }
  }

  const handleRemoveVaccine = (id: string) => {
    setVaccineIds(vaccineIds.filter(v => v !== id))
  }

  const availableVaccines = vaccines.filter(v => !vaccineIds.includes(v.id))

  /* ================= FETCH ================= */
  React.useEffect(() => {
      barnsApi.getEmptyMeatPens().then((data: any[]) => {
      setEmptyBarns(data.map((p: any) => ({ id: p.id, pen_name: p.name })))
      setLoadingBarns(false)
    })
    barnsApi.getBreeds().then(setBreeds)
    barnsApi.getVaccines().then(setVaccines)

    barnsApi.getPigBatches().then((data: any[]) => {
      setBatches(data.map(b => ({
      id: b.id,
      batch_name: b.name || b.batch_name || "Lứa không tên", 
      
      arrival_date: b.arrivalDate || b.arrival_date, 
      
      breed_id: b.breedId || b.breed_id || "",
      days_old: b.daysOld || b.days_old,
      vaccineIds: b.vaccineIds || []
    })))
    })
  }, [])

  /* ================= STEP 1: IMPORT ================= */
  const handleContinue = async () => {
    console.log("IMPORT PAYLOAD", {
      batch,
      selectedBarn,
      count,
    })
    if (!selectedBarn || !batch || !arrivalDate || !breedId || count <= 0) return

    try {
      setIsSubmitting(true)

      const res = await barnsApi.importBatch({
        existingBatchId: isNewBatch ? null : batch,
        batchName: isNewBatch ? `Lứa nhập ngày ${arrivalDate}` : undefined,
        penId: selectedBarn.id,
        breedId,
        arrivalDate,
        quantity: count,
        daysOld,
        vaccineIds,
      })


      console.log("IMPORT RESPONSE", res)

      setRows(
        res.pigs.map((p: any) => ({
          id: p.id,
          code: p.id, // ✅ dùng id làm mã tạm
          earTag: "",
          weight: 0,
        }))
      )


      setShowDetail(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ================= STEP 2: UPDATE DETAIL ================= */
 const handleSave = async () => {
  const invalid = rows.some(r => !r.earTag || !r.weight)
    if (invalid) {
      alert("Vui lòng nhập đầy đủ mã tai và trọng lượng")
      return
    }

  try {
    setIsSubmitting(true)

    await barnsApi.updatePigDetails({
      items: rows.map(r => ({
        id: r.id,
        earTag: r.earTag,
        weight: r.weight ?? 0,
      })),
    })

    alert("Lưu thành công!")
    router.push(`/barns/${selectedBarn?.id}`)
  } catch (err) {
    console.error(err)
    alert("Lỗi khi lưu chi tiết heo")
  } finally {
    setIsSubmitting(false)
  }
}

  const updateRow = (id: string, field: keyof PigRow, value: any) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const handleSelectBatch = (selectedBatch: any) => {
    setBatch(selectedBatch.id)
    setIsNewBatch(false)

    if (selectedBatch.breed_id) {
        setBreedId(selectedBatch.breed_id)
    }

    if (selectedBatch.arrival_date) {
        const dateStr = typeof selectedBatch.arrival_date === 'string'
            ? selectedBatch.arrival_date.split("T")[0]
            : new Date(selectedBatch.arrival_date).toISOString().split("T")[0]
        setArrivalDate(dateStr)
    }

    if (selectedBatch.days_old !== undefined) {
        setDaysOld(selectedBatch.days_old)
    }

    if (selectedBatch.vaccineIds && Array.isArray(selectedBatch.vaccineIds)) {
        setVaccineIds(selectedBatch.vaccineIds)
    } else {
        setVaccineIds([])
    }
  }

  /* ================= RENDER ================= */
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold">Tiếp nhận heo</span>
      </div>

      {!showDetail && (
        <>
          <Field label="Lứa">
          <div className="space-y-2 w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {batch
                    ? batches.find(b => b.id === batch)?.batch_name || "Lứa mới"
                    : "Chọn lứa"}
                  <ChevronDown className="size-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-[260px]">
                {batches.map(b => (
                  <DropdownMenuItem
                  key={b.id}
                  onClick={() => handleSelectBatch(b)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{b.batch_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {b.arrival_date 
                        ? new Date(b.arrival_date).toLocaleDateString("vi-VN") 
                        : "--/--/----"}
                    </span>
                  </div>
                </DropdownMenuItem>
                ))}

                <DropdownMenuItem
                  onClick={() => {
                  setBatch("")
                  setIsNewBatch(true)
                  setBreedId("")       
                  setArrivalDate("")  
                  setDaysOld(0)        
                  setVaccineIds([])    
                }}
                  className="text-primary"
                >
                  ➕ Tạo lứa mới
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* INPUT CHỈ HIỆN KHI TẠO LỨA MỚI */}
            {isNewBatch && (
              <input
                type="text"
                className="input"
                placeholder="Nhập mã lứa (vd: 05)"
                value={batch}
                onChange={e => setBatch(e.target.value)}
              />
            )}
          </div>
        </Field>


          <Field label="Chuồng">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedBarn?.pen_name || "Chọn chuồng"}
                  <ChevronDown className="size-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {emptyBarns.map(b => (
                  <DropdownMenuItem key={b.id} onClick={() => setSelectedBarn(b)}>
                    {b.pen_name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Field>
          <Field label="Giống">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  disabled={!isNewBatch && !!batch} 
                >
                  {breeds.find(b => b.id === breedId)?.name || "Chọn giống"}
                  <ChevronDown className="size-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-full">
                {breeds.map(b => (
                  <DropdownMenuItem
                    key={b.id}
                    onClick={() => setBreedId(b.id)}
                  >
                    {b.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Field>

          <Field label="Vaccine đã tiêm">
            <div className="w-full space-y-3">
              {/* 1. Nút Dropdown để thêm vaccine */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-dashed">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Plus className="size-4" /> Thêm loại vaccine
                    </span>
                    <ChevronDown className="size-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-[300px]" align="start">
                  {availableVaccines.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Đã chọn hết các loại vaccine
                    </div>
                  ) : (
                    availableVaccines.map(v => (
                      <DropdownMenuItem
                        key={v.id}
                        onClick={() => handleSelectVaccine(v.id)}
                        className="cursor-pointer"
                      >
                        {v.name}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {vaccineIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {vaccineIds.map(id => {
                    const vaccine = vaccines.find(v => v.id === id)
                    if (!vaccine) return null
                    
                    return (
                      <div 
                        key={id} 
                        className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium border animate-in fade-in zoom-in duration-200"
                      >
                        {vaccine.name}
                        <button
                          onClick={() => handleRemoveVaccine(id)}
                          className="ml-1 rounded-full hover:bg-black/10 p-0.5 transition-colors"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Field>

          <Field label="Ngày nhập">
          <input 
            type="date" 
            className="input disabled:opacity-70 disabled:bg-slate-100" 
            value={arrivalDate} 
            onChange={e => setArrivalDate(e.target.value)} 
            disabled={!isNewBatch && !!batch} 
          />
        </Field>

          <Field label="Ngày tuổi">
            <input 
              type="number" 
              className="input disabled:opacity-70 disabled:bg-slate-100" 
              value={daysOld} 
              onChange={e => setDaysOld(+e.target.value)} 
              disabled={!isNewBatch && !!batch} // 🔒 Khóa
            />
          </Field>
          

          <Field label="Số lượng">
            <input type="number" className="input" value={count} onChange={e => setCount(+e.target.value)} />
          </Field>

          <div className="flex justify-end">
            <Button onClick={handleContinue} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tiếp tục
            </Button>
          </div>
        </>
      )}

      {showDetail && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Mã tai</TableHead>
                <TableHead>Trọng lượng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.code}</TableCell>
                  <TableCell>
                    <input className="table-input" onChange={e => updateRow(r.id, "earTag", e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <input type="number" className="table-input" onChange={e => updateRow(r.id, "weight", +e.target.value)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

/* ================= UI ================= */
function Field({ label, children }: any) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 items-center">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}

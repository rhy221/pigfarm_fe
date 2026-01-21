import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

type VaccinationPen = {
  penName: string
  status: string
}

type VaccinationGroup = {
  vaccineName: string
  stage: number
  totalPens: number
  pens: VaccinationPen[]
}

export function exportVaccinationPdf(
  date: Date,
  groups: VaccinationGroup[]
) {
  const doc = new jsPDF()

  // ===== HEADER =====
  doc.setFontSize(16)
  doc.text("LỊCH TIÊM VACCINE", 14, 18)

  doc.setFontSize(11)
  doc.text(
    `Ngày: ${date.toLocaleDateString("vi-VN")}`,
    14,
    26
  )

  let startY = 32

  // ===== EACH GROUP =====
  groups.forEach((group, index) => {
    doc.setFontSize(12)
    doc.text(
      `${index + 1}. ${group.vaccineName} – Mũi ${group.stage}`,
      14,
      startY
    )

    const tableData = group.pens.map((pen, i) => [
      i + 1,
      pen.penName,
      pen.status === "completed" ? "Đã tiêm" : "Chưa tiêm",
    ])

    autoTable(doc, {
      startY: startY + 4,
      head: [["#", "Chuồng", "Trạng thái"]],
      body: tableData,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [83, 168, 139], // xanh giống UI
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
      },
    })

    // cập nhật vị trí Y cho group tiếp theo
    startY = (doc as any).lastAutoTable.finalY + 10
  })

  // ===== SAVE =====
  doc.save(
    `lich-tiem-${date.toISOString().slice(0, 10)}.pdf`
  )
}

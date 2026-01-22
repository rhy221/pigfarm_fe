import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Helper function to remove Vietnamese diacritics for better PDF compatibility
const removeVietnameseTones = (str: string): string => {
  const from =
    "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ" +
    "ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ";
  const to =
    "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd" +
    "AAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYD";
  
  return str.split("").map((char) => {
    const index = from.indexOf(char);
    return index !== -1 ? to[index] : char;
  }).join("");
};

export interface TableColumn {
  header: string;
  dataKey: string;
  width?: number;
}

export interface PDFExportOptions {
  title: string;
  subtitle?: string;
  columns: TableColumn[];
  data: any[];
  filename?: string;
  orientation?: "portrait" | "landscape";
  summaryData?: Array<{ label: string; value: string | number }>;
  chartImage?: string; // base64 image data
}

export const exportToPDF = ({
  title,
  subtitle,
  columns,
  data,
  filename = "report.pdf",
  orientation = "portrait",
  summaryData,
  chartImage,
}: PDFExportOptions) => {
  const doc = new jsPDF(orientation, "mm", "a4");
  let currentY = 15;

  // Title (remove tones for better display)
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(removeVietnameseTones(title), 15, currentY);
  currentY += 10;

  // Subtitle
  if (subtitle) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(removeVietnameseTones(subtitle), 15, currentY);
    currentY += 8;
  }

  // Date
  doc.setFontSize(9);
  const dateText = `Ngay xuat: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: vi })}`;
  doc.text(removeVietnameseTones(dateText), 15, currentY);
  currentY += 10;

  // Summary section
  if (summaryData && summaryData.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Thong ke tong quan", 15, currentY);
    currentY += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    summaryData.forEach((item) => {
      const label = removeVietnameseTones(item.label.toString());
      doc.text(`${label}: ${item.value}`, 15, currentY);
      currentY += 6;
    });
    currentY += 5;
  }

  // Chart image
  if (chartImage) {
    try {
      const imgWidth = orientation === "landscape" ? 260 : 180;
      const imgHeight = 80;
      doc.addImage(chartImage, "PNG", 15, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 10;
    } catch (error) {
      console.error("Error adding chart image:", error);
    }
  }

  // Table (convert headers to non-accented text)
  autoTable(doc, {
    head: [columns.map((col) => removeVietnameseTones(col.header))],
    body: data.map((row) => 
      columns.map((col) => {
        const value = row[col.dataKey] ?? "";
        // Keep numbers and currency as is, only convert Vietnamese text
        return typeof value === "string" && /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(value)
          ? removeVietnameseTones(value)
          : value;
      })
    ),
    startY: currentY,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [83, 168, 139], // #53A88B
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: columns.reduce((acc, col, index) => {
      if (col.width) {
        acc[index] = { cellWidth: col.width };
      }
      return acc;
    }, {} as any),
  });

  // Save
  doc.save(filename);
};

// Helper function to convert chart to base64 image
export const chartToImage = async (
  chartElement: HTMLElement
): Promise<string | null> => {
  try {
    // Use html2canvas if available (you may need to install it)
    // For now, return null and handle chart export separately
    return null;
  } catch (error) {
    console.error("Error converting chart to image:", error);
    return null;
  }
};

// Format currency for PDF
export const formatCurrencyForPDF = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// Format number for PDF
export const formatNumberForPDF = (value: number): string => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

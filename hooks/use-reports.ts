import { useQuery } from "@tanstack/react-query";
import { reportApi } from "@/lib/api/reports";

interface InventoryReportParams {
  month: string;
  warehouseId?: string;
  categoryId?: string;
}

interface VaccineReportParams {
  month: string;
  vaccine?: string;
}

interface HerdReportParams {
  date?: string;
  month?: string;
  pen?: string;
  batch?: string;
}

export const REPORT_KEYS = {
  all: ["reports"] as const,
  inventory: (params: InventoryReportParams) =>
    [...REPORT_KEYS.all, "inventory", params] as const,
  vaccines: (params: VaccineReportParams) =>
    [...REPORT_KEYS.all, "vaccines", params] as const,
  herd: (params: HerdReportParams) =>
    [...REPORT_KEYS.all, "herd", params] as const,
};

export function useInventoryReport(params: InventoryReportParams) {
  return useQuery({
    queryKey: REPORT_KEYS.inventory(params),
    queryFn: () => reportApi.getInventoryReport(params),
    enabled: !!params.month,
  });
}

export function useVaccineReport(params: VaccineReportParams) {
  return useQuery({
    queryKey: REPORT_KEYS.vaccines(params),
    queryFn: () => reportApi.getVaccineReport(params),
    enabled: !!params.month,
  });
}

export function useHerdReport(params: HerdReportParams) {
  return useQuery({
    queryKey: REPORT_KEYS.herd(params),
    queryFn: () => reportApi.getHerdReport(params),
  });
}

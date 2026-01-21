import http from "@/lib/http";
import { CreateMaterialDto, ImportMaterialDto, Material, MaterialBatch, UseMaterialDto } from "@/schemas/inventory.schema";


const inventoryService = {
  // Lấy danh sách vật tư
  getMaterials: async (): Promise<Material[]> => {
    const response = await http.get(`/inventory/materials`);
    return response.data;
  },

  // Tạo vật tư mới
  createMaterial: async (dto: CreateMaterialDto): Promise<Material> => {
    const response = await http.post(`/inventory/materials`, dto);
    return response.data;
  },

  // Nhập kho
  importMaterial: async (dto: ImportMaterialDto): Promise<MaterialBatch> => {
    const response = await http.post(`/inventory/import`, dto);
    return response.data;
  },

  // Lấy chi tiết vật tư
  getMaterialDetail: async (id: string): Promise<Material> => {
    const response = await http.get(`/inventory/materials/${id}`);
    return response.data;
  },

  // Sử dụng vật tư
  useMaterial: async (dto: UseMaterialDto): Promise<any> => {
    const response = await http.post(`/inventory/use`, dto);
    return response.data;
  },

  // Kiểm tra vật tư hết hạn
  checkExpiredMaterials: async (): Promise<MaterialBatch[]> => {
    const response = await http.get(`/inventory/check-expired`);
    return response.data;
  },

  // Kiểm tra vật tư sắp hết hạn
  checkExpiringMaterials: async (): Promise<MaterialBatch[]> => {
    const response = await http.get(`/inventory/check-expiring`);
    return response.data;
  }
};

export default inventoryService;
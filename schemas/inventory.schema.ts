export interface Material {
  id: string;
  name: string;
  type: string;
  unit: string;
  totalStock: number;
  minStock: number;
  batches?: MaterialBatch[];
  createdAt: string;
  updatedAt: string;
}

export interface MaterialBatch {
  id: string;
  materialId: string;
  batchNumber: number;
  quantity: number;
  usedQuantity: number;
  remainQuantity: number;
  unitPrice: number;
  totalPrice: number;
  importDate: string;
  expiryDate?: string;
  isExpired: boolean;
  supplier?: string;
  note?: string;
  material?: Material;
}

export interface CreateMaterialDto {
  name: string;
  type: string;
  unit: string;
  minStock?: number;
}

export interface ImportMaterialDto {
  materialId: string;
  quantity: number;
  unitPrice: number;
  importDate: string;
  expiryDate?: string;
  supplier?: string;
  note?: string;
}

export interface UseMaterialDto {
  materialId: string;
  quantity: number;
  purpose?: string;
  note?: string;
}
// =====================================================
// NEW STOCK RECEIPT PAGE - app/(dashboard)/inventory/receipts/new/page.tsx
// =====================================================

import StockReceiptForm from '@/components/inventory/stock-receipt-form';

const FARM_ID = 'demo-farm-id';

export default function NewStockReceiptPage() {
  return <StockReceiptForm farmId={FARM_ID} />;
}
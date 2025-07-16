export interface LineItem {
  key: string;
  quantity: number;
  shipped: number;
  inventoryItemId: string;
  description: string;
  unitPrice: number;
  glAccountId: string;
  project?: string;
  phase?: string;
  taxId?: string;
  taxRate?: number;
}

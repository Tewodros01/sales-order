import type { TransactionType, TransactionOrigin, ShipVia } from "./enums";

export interface SalesOrderPayload {
  soNumber?: string;
  customerId?: string;
  oneTimeCustomerName?: string;
  date?: string;
  customerPO?: string;
  arAccountId: string;
  shipBy?: string;
  transactionType: TransactionType;
  transactionOrigin?: TransactionOrigin;
  shipVia?: ShipVia;
  status: "DRAFT" | "SUBMITTED";
  lineItems: {
    inventoryItemId?: string | null;
    glAccountId: string;
    taxId?: string;
    quantity: number;
    shipped?: number;
    description: string;
    unitPrice: number;
    project?: string;
    phase?: string;
  }[];
  totalAmount?: number | null;
}

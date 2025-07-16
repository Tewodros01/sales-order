export type TransactionType = "GOODS" | "SERVICES";

export type TransactionOrigin = "LOCAL" | "IMPORTED";

export type ShipVia = "CUSTOMER_VEHICLE" | "COMPANY_VEHICLE";

export type SalesOrderStatus = "DRAFT" | "SUBMITTED";

export type VendorOrCustomer = "VENDOR" | "CUSTOMER";

export interface Customer {
  id: string;
  name: string;
  email?: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  title: string;
  type: "AccountsPayable" | "AccountsReceivable" | "Other";
  isAR: boolean;
  isGL: boolean;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
}

export interface Tax {
  id: string;
  taxType: string;
  rate: number;
  taxAuthorityName?: string;
  vendorOrCustomer: VendorOrCustomer;
}

export interface SalesOrderLineItem {
  id: string;
  quantity: number;
  shipped: number;
  inventoryItemId?: string;
  inventoryItem?: InventoryItem;
  description: string;
  unitPrice: number;
  glAccountId: string;
  glAccount: Account;
  taxId?: string;
  tax?: Tax;
  project?: string;
  phase?: string;
  amount: number;
}

export interface SalesOrder {
  id: string;
  soNumber: number;
  customerId?: string;
  customer: Customer;
  oneTimeCustomerName?: string;
  date: Date;
  customerPO?: string;
  arAccountId: string;
  totalAmount: number;
  arAccount: Account;
  shipBy?: Date;
  transactionType: TransactionType;
  transactionOrigin?: TransactionOrigin;
  shipVia?: ShipVia;
  status: SalesOrderStatus;
  lineItems: SalesOrderLineItem[];
  createdAt: Date;
  updatedAt: Date;
}

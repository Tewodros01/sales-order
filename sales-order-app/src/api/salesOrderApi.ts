import { api } from "./axiosInstance";
import type { SalesOrderPayload } from "../types/SalesOrderPayload";

/**
 * Customers
 */
export const getCustomers = () =>
  api.get("/customers");

export const createCustomer = (data: { name: string; email?: string }) =>
  api.post("/customers", data);

/**
 * Accounts
 */
export const getAccounts = () =>
  api.get("/accounts");

export const createAccount = (data: {
  accountNumber: string;
  title: string;
  type: string;
  inactive: boolean;
}) =>
  api.post("/accounts", data);

/**
 * Inventory
 */
export const getInventoryItems = () =>
  api.get("/inventory-items");

export const createInventoryItem = (data: {
  sku: string;
  name: string;
  description?: string;
  unitPrice: number;
}) =>
  api.post("/inventory-items", data);

/**
 * Taxes
 */
export const getTaxes = () =>
  api.get("/taxes");

/**
 * Sales Orders
 */
export const createSalesOrder = (data: SalesOrderPayload) =>
  api.post("/sales-orders", data);

export const getSalesOrders = (params?: {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  skip?: number;
  take?: number;
}) =>
  api.get("/sales-orders", { params });

export const getSalesOrder = (id: string) =>
  api.get(`/sales-orders/${id}`);

export const updateSalesOrder = (
  id: string,
  data: Partial<SalesOrderPayload>
) =>
  api.patch(`/sales-orders/${id}`, data);

export const deleteSalesOrder = (id: string) =>
  api.delete(`/sales-orders/${id}`);

export const submitSalesOrder = (id: string) =>
  api.patch(`/sales-orders/${id}/submit`);

export const createTax = (data: any) => api.post("/taxes", data);

export const exportSalesOrdersToExcel = async (data: any) => {
  // Logic to export sales orders to Excel
  const response = await fetch("/api/export-sales-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

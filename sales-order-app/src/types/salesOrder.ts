export interface SalesOrder {
  id: string;
  soNumber: number;
  date: string;
  status: string;
  customer?: {
    name: string;
  } | null;
  oneTimeCustomerName?: string | null;
}

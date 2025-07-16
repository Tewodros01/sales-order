import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSalesOrders, createSalesOrder, deleteSalesOrder } from '../api/salesOrderApi';
import type { SalesOrder } from '../types'; // Import the SalesOrder type

export interface SalesOrderState {
  salesOrders: SalesOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: SalesOrderState = {
  salesOrders: [],
  loading: false,
  error: null,
};

// Fetch sales orders action
export const fetchSalesOrders = createAsyncThunk(
  'salesOrder/fetchSalesOrders',
  async (params?: { search?: string; dateFrom?: string; dateTo?: string; transactionType?: string; arAccountId?: string }) => {
    const response = await getSalesOrders(params);
    return response.data;
  }
);

// Create a new sales order action
export const addSalesOrder = createAsyncThunk('salesOrder/addSalesOrder', async (newOrder: any) => {
  const response = await createSalesOrder(newOrder);
  return response.data;
});

// Delete a sales order action
export const removeSalesOrder = createAsyncThunk(
  'salesOrder/removeSalesOrder',
  async (orderId: string) => {
    await deleteSalesOrder(orderId);
    return orderId;
  }
);

const salesOrderSlice = createSlice({
  name: 'salesOrder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.salesOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchSalesOrders.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to load sales orders';
        state.loading = false;
      })
      .addCase(addSalesOrder.fulfilled, (state, action) => {
        state.salesOrders.push(action.payload);
      })
      .addCase(removeSalesOrder.fulfilled, (state, action) => {
        state.salesOrders = state.salesOrders.filter(
          (order) => order.id !== action.payload
        );
      });
  },
});

export default salesOrderSlice.reducer;

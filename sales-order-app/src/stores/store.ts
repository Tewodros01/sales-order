import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import salesOrderReducer, { type SalesOrderState } from './salesOrderSlice';

// Define the store's state type
export interface RootState {
  salesOrder: SalesOrderState;
}

// Create the store
const store = configureStore({
  reducer: {
    salesOrder: salesOrderReducer,
  },
});

// TypeScript hooks for useDispatch and useSelector
export type AppDispatch = typeof store.dispatch; // Type for dispatching actions
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Custom hook to use dispatch with correct types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // Custom hook to use selector with correct types

export default store;

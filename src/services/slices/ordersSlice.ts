import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const fetchFeeds = createAsyncThunk('orders/fetchFeeds', async () => {
  const data = await getFeedsApi();
  return data;
});

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

interface OrdersState {
  feeds: TOrder[];
  total: number;
  totalToday: number;
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  feeds: [],
  total: 0,
  totalToday: 0,
  userOrders: [],
  currentOrder: null,
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch feeds
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.feeds = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feeds';
      })
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user orders';
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Failed to create order';
      })
      // Fetch order by number
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order';
      });
  }
});

export const { clearOrderModalData, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

// Selectors
export const selectFeeds = (state: { orders: OrdersState }) =>
  state.orders.feeds;

export const selectTotal = (state: { orders: OrdersState }) =>
  state.orders.total;

export const selectTotalToday = (state: { orders: OrdersState }) =>
  state.orders.totalToday;

export const selectUserOrders = (state: { orders: OrdersState }) =>
  state.orders.userOrders;

export const selectCurrentOrder = (state: { orders: OrdersState }) =>
  state.orders.currentOrder;

export const selectOrderRequest = (state: { orders: OrdersState }) =>
  state.orders.orderRequest;

export const selectOrderModalData = (state: { orders: OrdersState }) =>
  state.orders.orderModalData;

export const selectOrdersLoading = (state: { orders: OrdersState }) =>
  state.orders.loading;

export const selectOrdersError = (state: { orders: OrdersState }) =>
  state.orders.error;

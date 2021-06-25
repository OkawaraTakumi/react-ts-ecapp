import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../appSlice'
import commonSliceReducer from '../appComponent/common/commonSlice';
import cartSliceReducer from '../pages/Cart/Slice/cartSlice'
import orderHistoryReducer from '../pages/OrderHistory/Slice/orderHistorySlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    commonSlice: commonSliceReducer,
    cartSlice: cartSliceReducer,
    orderHistorySlice: orderHistoryReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../appSlice'
import commonSliceReducer from '../appComponent/common/commonSlice';
import cartSliceReducer from '../pages/Cart/Slice/cartSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    commonSlice: commonSliceReducer,
    cartSlice: cartSliceReducer,
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

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState} from '../../../app/store';
import { db } from '../../../firebase';
import { cartInfo } from '../Type/cartType';
import { userInfo } from '../Type/cartType';

export interface CartSliceType {
  cartInfo:cartInfo;
}

const initialState: CartSliceType = {
  cartInfo:{},
};


//ログイン時にカートにデータが残っていたら取得する
export const fetchCart = createAsyncThunk<cartInfo,string>(
    'CartSlice/fetchCart',
    async (uid) => {
      console.log('フェッチがうごいてます');
      const snapShot = await db.collection(`users/${uid}/orders`).get();
      let cartInfo:cartInfo = {}
      snapShot.forEach(doc => {
           if(doc.data().status === 0) {
            doc.data() 
            cartInfo = doc.data();
            cartInfo.id = doc.id;
           }
      }) 
      // The value we return becomes the `fulfilled` action payload
      return  cartInfo;
    }
  );

//ログインしていたらカートを作る
export const createCart = createAsyncThunk<cartInfo,{newCartInfo:cartInfo, uid:string}>(
  'CartSlice/createCart',
  async ({newCartInfo, uid}) => {
    console.log('クリエイトがうごいてます');
    if(uid){
      const doc = await db.collection(`users/${uid}/orders`).add(newCartInfo)
      newCartInfo.id = doc.id;
      return newCartInfo
    } else {
      newCartInfo.id = null;
      return newCartInfo
    }
  }
)

//カートに商品を追加する処理
export const updateCart = createAsyncThunk<cartInfo,{newCartInfo:cartInfo, uid:string}>(
  'CartSlice/updateCart',
  async ({newCartInfo, uid}) => {
    if(uid){
      if (newCartInfo.id !== null){
        console.log('アップデートがうごいてます');
      await db.collection(`users/${uid}/orders`).doc(newCartInfo.id).update({iteminfo: newCartInfo.iteminfo})
      }
      return newCartInfo
    } else {
      return newCartInfo
    }
  }
)

//ログインしてない人のカート取得処理
export const fetchCartNoUser = createAsyncThunk<cartInfo,cartInfo>(
  'CartSlice/fetchCartNoUser',
  async (newCartInfo) => {
      return newCartInfo
  }
)

export const deleteCart = createAsyncThunk<cartInfo,{newCartInfo:cartInfo, uid:string|null}>(
  'CartSlice/fetchDeleteCart',
  async ({newCartInfo,uid}) => {
    if (uid && newCartInfo.id) { 
      console.log(newCartInfo)
      await db.collection(`users/${uid}/orders`)
              .doc(newCartInfo.id)
              .update({iteminfo: newCartInfo.iteminfo})
              console.log('削除語')
            }
    return newCartInfo
  }
)

export const order = createAsyncThunk<cartInfo, {userdata:userInfo,uid:string,cartId:string}>(
  'CartSlice/order',
  async ({ userdata, uid, cartId }) => {
    db.collection(`users/${uid}/orders`)
    .doc(cartId)
    .update(userdata)
    return {}
  }
)



export const CartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartInfo = action.payload;
      }).addCase(createCart.fulfilled,(state, action) => {
        state.cartInfo = action.payload;
      }).addCase(updateCart.fulfilled, (state, action) => {
        state.cartInfo = action.payload;
      }).addCase(fetchCartNoUser.fulfilled,(state, action) => {
        state.cartInfo = action.payload
      }).addCase(deleteCart.fulfilled,(state,action) => {
        state.cartInfo = action.payload
      }).addCase(order.fulfilled, (state,action) => {
        state.cartInfo = action.payload
      })
  },
});

// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCartInfoBox = (state: RootState) => state.cartSlice.cartInfo;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount: number): AppThunk => (
//   dispatch,
//   getState
// ) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default CartSlice.reducer;

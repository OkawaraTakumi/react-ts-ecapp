import reducer , {
    unset
} from "./cartSlice"
import { cartInfo } from "../Type/cartType";
import { iteminfoArrayType } from "../Type/cartType";
import { db } from "../../../firebase";
import { fetchCart } from "./cartSlice";

let toppingDummy = [
    {
        toppingId:1,
        toppingSize:0,
    }
]
let iteminfoArrayDummy:iteminfoArrayType[] = [
{
    id:'1',
    itemId:1,
    itemNum:2,
    itemSize:1,
    toppings:toppingDummy
}
]

let cartInfoDummy :cartInfo ={
    address:'群馬県高崎市寺尾町',
    email:'blackbaby.8-cp@ezweb.ne.jp',
    iteminfo:iteminfoArrayDummy,
    orderDate:1624610024855,
    password:"blackbaby8_cp",
    payment:1,
    status:0,
    tel:'090-6175-0675',
    totalPrice:1490,
    userId:"UYThWgYXAvTWdDSLDqO2NHETiBw1",
    zip:"376-0034",
    id:"1"
}

let fireStoreDummy :cartInfo[] = [
    cartInfoDummy,cartInfoDummy
] 

describe("Reducer of ReduxToolkit", () => {
    describe("unset action", () => {
        interface CartSliceType {
            cartInfo:cartInfo;
          }

        const initialState: CartSliceType = {
            cartInfo:{},
          };
        
        it("shuould Update cartinfo", () => {
            const action = { type: unset.type, payload: cartInfoDummy }
            const state = reducer(initialState, action)
            expect(state.cartInfo).toEqual(cartInfoDummy)  
        })
    })
})


jest.mock('../../../firebase', () => ({
    collection:jest.fn().mockImplementation((uid) => {
        return {
            get:jest.fn(() => {
                return fireStoreDummy
            })
        }
    })
}))


describe("extraReducers of fetchCart", () => {
    describe("fetchCart", () => {
        interface CartSliceType {
            cartInfo:cartInfo;
          }

        const initialState: CartSliceType = {
            cartInfo:{},
          };
        
        it("should Fetch CartInfo", async () => {
            const newCart = await fetchCart('')
            console.log(newCart)
            const action =  { type: fetchCart.fulfilled.type, payload:newCart}
            const state = reducer(initialState, action)
            expect(state.cartInfo).toEqual(cartInfoDummy)  
        })
    })
})


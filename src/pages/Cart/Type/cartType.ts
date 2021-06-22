type toppings = {
    toppingId: number;
    toppingSize: number;
}

export type iteminfoArrayType = {
    id?:string;
    itemId?: number;
    itemNum?: number;
    itemSize?: number;
    toppings?: toppings[];
}


export type cartInfo = {
    address?:string;
    email?: string;
    iteminfo?: iteminfoArrayType[];
    name?: string;
    orderDate?:number;
    password?: string;
    payment?: number;
    status?: number;
    tel?: string;
    totalPrice?: number;
    userId?: string;
    zip?: string;
}

export type cartInfoBox = {
    cartInfo?:cartInfo;
    id?: string;
}
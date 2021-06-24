type toppings = {
    toppingId: number;
    toppingSize: number;
}

export type iteminfoArrayType = {
    id?:string|null;
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
    id?:string|null
}

export type userInfo = {
    name: string
    address: string
    email: string
    cardNo?: string
    date: Date|string
    payment: number
    status: number
    tel:string
    zip: string
    orderDate?:number
    totalPrice?:number
}

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


export type orderInfo = {
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

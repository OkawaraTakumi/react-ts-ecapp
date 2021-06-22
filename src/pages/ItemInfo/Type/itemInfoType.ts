
export type toppingFlagType = {
    [key: string]:boolean
}

export type newToppingSizeType = {
    [key: string]:number
}

export type toppingWillAddType = {
    [key: string]:number
}

export type sendItemType = {
    [key:string]:number|string|toppingWillAddType[];
    
}

//firebaseのitemDataの配列のindex単位に含まれるオブジェクトの型
export type ItemdataObj = {
    id:number;
    img?: string;
    lprice: number;
    mprice: number;
    name:string;
    text?: string;
}

export type Toppingdataobj = {
    id:number;
    lprice: number;
    mprice: number;
    name: string;
    text: string;
}


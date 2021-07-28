// export const ADMIN_ID = "HdPaXiBx3VTswieJGJlFxLYOs092";
// export const ITEMS_TABLE_ID = "NZHyDjbIod0bUOEyaEW0";
// export const TOPPINGS_TABLE_ID = "Jc8Ne4Bnwxjd286jYN50";
// export const USERS_TABLE_ID = "U0Aa4TNozNxJWRpjD6gx";

export const timestampToDate = (timestamp:number) => {
    let dateTime = new Date(timestamp)
  let date = dateTime.toLocaleDateString(); // => 2019/9/4
    let time = dateTime.toLocaleTimeString("ja-JP"); // => 12:03:35
  return date + " " + time;
};

//商品のサイズ
export const SIZE_M = 0;
export const SIZE_L = 1;

//orderのステータス
export const ORDER_STATUS_CART = 0;
export const ORDER_STATUS_UNPAID = 1;
export const ORDER_STATUS_PAID = 2;
export const ORDER_STATUS_UNDELIVERIED = 3;
export const ORDER_STATUS_DELIVERIED = 4;
export const ORDER_STATUS_CANCELED = 9;

//リダイレクト用トークン
export const TOKEN_CHECK = "45e8cmtymhwxep94"
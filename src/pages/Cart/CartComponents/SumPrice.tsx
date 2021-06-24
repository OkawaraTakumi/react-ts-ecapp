import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Button } from "@material-ui/core";
import { cartInfo } from "../Type/cartType";
import { Toppingdataobj, ItemdataObj } from "../../../appComponent/common/commonType";

interface Props {
  cartInfo: cartInfo;
  toppings: Toppingdataobj[];
  items: ItemdataObj[];
  uid: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
}

export const SumPrice = (props:Props) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const history = useHistory();
  //合計金額計算処理
  useEffect(() => {
    if (props.cartInfo) {
      let totalPrice = 0;
      if (props.cartInfo.iteminfo !== undefined){
        props.cartInfo.iteminfo.forEach((itemIn) => {
          props.items
            .filter((item) => itemIn.itemId === item.id)
            .forEach((item) => {
              if (itemIn.itemSize === 0) {
                if(itemIn.itemNum !== undefined){
                  totalPrice += item.mprice * itemIn.itemNum;
                }
              } else {
                if(itemIn.itemNum !== undefined){
                  totalPrice += item.lprice * itemIn.itemNum;
                }
              }
            });
          //もしトッピング入ってたらトッピングも計算
          if (itemIn.toppings) {
            itemIn.toppings.forEach((toppingIn) => {
              props.toppings
                .filter((topping) => toppingIn.toppingId === topping.id)
                .forEach((topping) => {
                  if (toppingIn.toppingSize === 0) {
                      if(itemIn.itemNum !== undefined){
                        totalPrice += topping.mprice * itemIn.itemNum;
                      }
                  } else {
                    if(itemIn.itemNum !== undefined){
                      totalPrice += topping.lprice * itemIn.itemNum;
                    }
                  }
                });
            });
          }
        });
      }
      setTotalPrice(totalPrice);
      props.setTotal(totalPrice);
    }
  }, [props.cartInfo]);

  const proceedToOrder = () => {
    if (props.uid) {
      props.setShow(true);
    } else {
      localStorage.setItem("itemInfo", JSON.stringify(props.cartInfo.iteminfo));
      history.push("/login");
    }
  };
  return (
    <Grid> 
      {/* これが聞かなくなる理由がわからないcontainer item cpacing={0} direction="column" */}
      <Grid container item justify="center">
        <h3>
          合計金額(税込)：{Math.floor(totalPrice * 1.1).toLocaleString()}円
        </h3>
      </Grid>
      <Grid container item justify="center">
        <h3>内消費税：{Math.floor(totalPrice * 0.1).toLocaleString()}円</h3>
      </Grid>
      <Grid container item justify="center">
        <Button variant="contained" onClick={proceedToOrder}>
          注文に進む
        </Button>
      </Grid>
    </Grid>
  );
};
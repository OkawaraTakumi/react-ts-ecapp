import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../../firebase"; 
import React from "react";
import { timestampToDate } from "../Cart/statusConstant/statusConstant";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { fetchItemData, fetchToppingData } from "../../appComponent/common/commonSlice";
import { fetchOrderInfo, updateOder } from "./Slice/orderHistorySlice";
import {  
    ORDER_STATUS_PAID,
    ORDER_STATUS_UNPAID,
    ORDER_STATUS_UNDELIVERIED,
    ORDER_STATUS_DELIVERIED,
    ORDER_STATUS_CANCELED, } from "../Cart/statusConstant/statusConstant";
import { orderInfo } from "./Type/orderHistoryType";

export const OrderHistory = () => {
  const uid = useSelector((state:RootState) => state.user.uid);
  const items = useSelector((state:RootState) => state.commonSlice.itemData);
  const toppings = useSelector((state:RootState) => state.commonSlice.toppingData);
  const orders = useSelector((state:RootState) => state.orderHistorySlice.orders);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchItemData());
    dispatch(fetchToppingData());
  }, [dispatch]);

  useEffect(() => {
    if (uid) {
      dispatch(fetchOrderInfo(uid));
    }else {
        dispatch(fetchOrderInfo(null))
    }
  }, [uid,dispatch]);

  const statechange = (index:number, orderId:string) => {
    if (window.confirm("キャンセルしてもよろしいですか？")) {
      let newOrders:orderInfo[] = JSON.parse(
        JSON.stringify(orders)
      ); 
      newOrders[index].status = ORDER_STATUS_CANCELED;
      db.collection(`users/${uid}/orders`)
        .doc(orderId)
        .update({ status: ORDER_STATUS_CANCELED })
        .then(() => {
          dispatch(updateOder(newOrders));
        });
    }
  };
  return (
    <div>
      <Grid container>
        <Button
          style={{ marginBottom: "20px" }}
          onClick={() => history.push("/")}
        >
          <ArrowBackIcon />
        </Button>
        <h2>注文履歴一覧</h2>
      </Grid>
      {orders.length !== 0 && (
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  注文日時
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  合計金額(税抜)
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  ステータス
                </TableCell>
                <TableCell align="center" colSpan={6}>
                  商品情報
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell align="center" colSpan={2}>
                    {console.log(order.orderDate)}
                    {timestampToDate((order.orderDate) as number)}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    <h3>{order.totalPrice? order.totalPrice.toLocaleString():null}円</h3>
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {order.status === ORDER_STATUS_UNPAID && (
                      <div>
                        <h3 style={{ color: "red" }}>未入金</h3>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => statechange(index, (order.id) as string)}
                        >
                          注文キャンセル
                        </Button>
                      </div>
                    )}
                    {order.status === ORDER_STATUS_PAID && (
                      <div>
                        <h3 style={{ color: "orange" }}>入金済み</h3>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => statechange(index, (order.id) as string)}
                        >
                          注文キャンセル
                        </Button>
                      </div>
                    )}
                    {order.status === ORDER_STATUS_UNDELIVERIED && (
                      <div>
                        <h3 style={{ color: "orange" }}>発送前</h3>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => statechange(index, (order.id) as string)}
                        >
                          注文キャンセル
                        </Button>
                      </div>
                    )}
                    {order.status === ORDER_STATUS_DELIVERIED && (
                      <h3 style={{ color: "gray" }}>発送済み</h3>
                    )}
                    {order.status === ORDER_STATUS_CANCELED && (
                      <h3 style={{ color: "gray" }}>キャンセル済み</h3>
                    )}
                  </TableCell>
                  <TableCell>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" colSpan={2}>
                            商品名
                          </TableCell>
                          <TableCell align="center" colSpan={2}>
                            価格(税抜)/個数
                          </TableCell>
                          <TableCell align="center" colSpan={2}>
                            トッピング
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.iteminfo ? order.iteminfo.map((item, index) =>
                          items.map(
                            (it) =>
                              it.id === item.itemId && (
                                <TableRow key={index}>
                                    {/* colSpan={6} */}
                                  <TableCell
                                    component="th"
                                    scope="items"
                                    align="center"
                                    colSpan={2}
                                  >
                                    <div>
                                      <img
                                        src={it.img}
                                        height="120"
                                        alt="カレー"
                                      />
                                    </div>
                                    <div>{it.name}</div>
                                  </TableCell>
                                  {item.itemSize === 0 ? (
                                    <TableCell align="center" colSpan={2}>
                                      <h4>
                                        {it.mprice.toLocaleString()}円(Mサイズ)
                                        /{item.itemNum}個
                                      </h4>
                                    </TableCell>
                                  ) : (
                                    <TableCell align="center" colSpan={2}>
                                      <h4>
                                        {it.lprice.toLocaleString()}円(Lサイズ)
                                        /{item.itemNum}個
                                      </h4>
                                    </TableCell>
                                  )}
                                  <TableCell align="center" colSpan={2}>
                                    {item.toppings ? (
                                      <div>
                                        {item.toppings.map((topping, index) =>
                                          toppings.map(
                                            (top) =>
                                              topping.toppingId === top.id && (
                                                <div key={index}>
                                                  <span>{top.name}:</span>
                                                  {topping.toppingSize === 0 ? (
                                                    <span>{top.mprice}円</span>
                                                  ) : (
                                                    <span>{top.lprice}円</span>
                                                  )}
                                                </div>
                                              )
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <div>なし</div>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                          ) 
                        ) :null}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {orders.length === 0 && <h3>注文履歴がありません</h3>}
    </div>
  );
};
import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { fetchCart, createCart, updateCart } from "../Cart/Slice/cartSlice";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Button, Grid, Select, MenuItem } from "@material-ui/core";
import { RootState } from '../../app/store'
import { fetchItemData, fetchToppingData } from "../../appComponent/common/commonSlice";
import { ItemdataObj, Toppingdataobj } from "../../appComponent/common/commonType";
import { 
        toppingFlagType, 
        newToppingSizeType, 
        sendItemType, 
        toppingWillAddType 
        } from "./Type/itemInfoType";
import { iteminfoArrayType } from "../Cart/Type/cartType";
import { cartInfo } from "../Cart/Type/cartType";

export const ItemInfo = () => {
  let uid = useSelector((state:RootState) => state.user.uid);
  const cartInfo = useSelector((state:RootState) => state.cartSlice.cartInfo); //オブジェクト
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (uid) {
      dispatch(fetchCart(uid));
    }
  }, [uid ,dispatch]);
  //ここで商品情報を読み込んでおく必要あり
  useEffect(() => {
    dispatch(fetchItemData());
    dispatch(fetchToppingData());
  }, [dispatch]);

  const { itemid } = useParams<{itemid:string}>();
  const items = useSelector((state:RootState) => state.commonSlice.itemData);
  const toppings = useSelector((state:RootState) => state.commonSlice.toppingData);
  const [itemRendering, setItemRendering] = useState<ItemdataObj | ''>('');
  const [toppingsRendering, setToppings] = useState<Toppingdataobj[]>([]);
  const [toppingFlag, setToppingFlag] = useState<toppingFlagType>({});

  useEffect(() => {
    items.forEach((item) => {
      if (`${item.id}` === itemid) {
        setItemRendering(item);
      }
    });
  }, [items,itemid]);

  useEffect(() => {
    setToppings(toppings);
  }, [toppings]);

  //トッピングの数量選択欄の表示切り替え
  useEffect(() => {
    const newToppingFlag:toppingFlagType = {};
    toppingsRendering.forEach((topping) => {
      newToppingFlag[topping.name] = false;
    });
    setToppingFlag(newToppingFlag);
  }, [toppingsRendering]);

  const changeFlag = (e:React.ChangeEvent<HTMLInputElement>) => {
    if (toppingFlag[e.target.name] === false) {
      setToppingFlag({ ...toppingFlag, [e.target.name]: true });
    } else if (toppingFlag[e.target.name] === true) {
      //チェックボックスを閉じた時にトッピングの数は0になる
      setCalcToppingSize((prevSize) => {
        return { ...prevSize, [e.target.name]: 0 };
      });
      setToppingFlag({ ...toppingFlag, [e.target.name]: false });
    }
  };

  //トッピングのサイズを取得
  const [calcToppingSize, setCalcToppingSize] = useState<newToppingSizeType>({});

  useEffect(() => {
    const newToppingSize:newToppingSizeType = {};
    toppingsRendering.forEach((topping) => {
      newToppingSize[topping.name] = 0;
    });
    setCalcToppingSize(newToppingSize);
  }, [toppingsRendering]);
  //トッピングのサイズを切り替える
  const changeToppingSize = (e:React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "1") {
      setCalcToppingSize((prevSize) => {
        return { ...prevSize, [e.target.name]: 1 };
      });
    } else if (e.target.value === "2") {
      setCalcToppingSize((prevSize) => {
        return { ...prevSize, [e.target.name]: 2 };
      });
    }
  };

  const [selectValue, setSelectValue] = useState<number>(1);
  //セレクトボックスの値を取得
  const getSelectValue = (e:any) => {
    const value:number = Number(e.target.value)
    setSelectValue(value);
  };

  const [totalPrice, setTotalPrice] = useState(0);
  const [sizeValue, setSizeValue] = useState(0);
  const setSize0 = () => {
    setSizeValue(0);
  };

  const setSize1 = () => {
    setSizeValue(1);
  };
  const [calcPrice, setCalcPrice] = useState<number>(0);
  useEffect(() => {
    if (typeof itemRendering !== 'string'){
        setCalcPrice(itemRendering.mprice);
    }else{
    }
  }, [itemRendering]);

  useEffect(() => {
    if (sizeValue === 0) {
        if (typeof itemRendering !== 'string'){
            setCalcPrice(itemRendering.mprice);
        }
    } else if (sizeValue === 1) {
        if (typeof itemRendering !== 'string'){
            setCalcPrice(itemRendering.lprice);
        }
    }
  }, [sizeValue,itemRendering]);

  //表示合計金額の計算
  useEffect(() => {
    let toppingObjValues = Object.values(calcToppingSize);
    let mCount = 0;
    let lCount = 0;
    toppingObjValues.forEach((value) => {
      if (value === 1) {
        mCount += 1;
      } else if (value === 2) {
        lCount += 1;
      }
    });
    let calculation =
      calcPrice * selectValue + selectValue * (mCount * 200 + lCount * 300);
    setTotalPrice(calculation);
  }, [selectValue, calcPrice, calcToppingSize]);

  //ランダム文字生成
  const getUniqueStr = () => {
    return (
      new Date().getTime().toString(16) +
      Math.floor(1000 * Math.random()).toString(16)
    );
  };

  //カートにアイテムを追加する処理
  const doAddCart = () => {
    console.log(cartInfo,'カートインフォ');
    //カートに送るデータの準備
    const item:sendItemType = {};
    item.itemId = parseInt(itemid);
    item.itemNum = selectValue;
    item.itemSize = sizeValue;
    item.toppings = [];
    let toppingObjKeys = Object.keys(calcToppingSize);
    toppingObjKeys.forEach((key) => {
      if (calcToppingSize[key] !== 0) {
        const toppingWillAdd:toppingWillAddType = {};
        if (calcToppingSize[key] === 1) {
          toppings.forEach((topping) => {
            if (topping.name === key) {
              toppingWillAdd.toppingId = topping.id;
              toppingWillAdd.toppingSize = 0;
            }
          });
        } else if (calcToppingSize[key] === 2) {
          toppings.forEach((topping) => {
            if (topping.name === key) {
              toppingWillAdd.toppingId = topping.id;
              toppingWillAdd.toppingSize = 1;
            }
          });
        }
        if(typeof (item.toppings) !== 'number'&& typeof (item.toppings) !== 'string'){
            item.toppings.push(toppingWillAdd);
        } 
      }
    });
    item.id = getUniqueStr();
    //ログイン確認してログインしていたらuidを渡す
    if (!uid) {
      uid = '';
    } 
    //カートにアイテムが入っていたら中身も一緒に渡す。
    if (cartInfo.iteminfo !== undefined) {
      if (typeof cartInfo !== 'undefined'){
        console.log(cartInfo.iteminfo !== undefined)
      let newCartInfo:any = JSON.stringify(cartInfo);
      newCartInfo = JSON.parse(newCartInfo);
      newCartInfo.iteminfo = [...(cartInfo.iteminfo), item as iteminfoArrayType]
      console.log('アップデートを呼び出し') 
      dispatch(updateCart({newCartInfo, uid}));
      }
      history.push("/cart");
      //入ってなかったら配列に格納して渡す。
    } else {
      console.log('アイテムインフォがない')
      let newCartInfo:cartInfo = {
        iteminfo: [item],
        status: 0, //カート(あとで定数に置き換える)
        userId: uid,
      };
      dispatch(createCart({newCartInfo, uid}));
      history.push("/cart");
    }
  };

  return (
    <div>
      <div>
        <Grid container>
          <Button
            // styel={{ marginBottom: "20px" }}
            onClick={() => history.push("/")}
          >
            <ArrowBackIcon />
          </Button>
          <h2>商品詳細</h2>
        </Grid>
        <Grid>
        {/* container align="left" style={{ marginBottom: "50px" }} */}
          <Grid item xs={6}>
            <Grid container justify="center">
              <img src={typeof itemRendering !== 'string' ? itemRendering.img : '#'} alt='商品画像'  width="300" />
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <h3>{typeof itemRendering !== 'string' ? itemRendering.name : null}</h3>
            <p>{typeof itemRendering !== 'string' ? itemRendering.text : null}</p>
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Grid item xs={2}>
            <Grid container justify="center">
              <h4 style={{ margin: 0 }}>サイズ選択：</h4>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Grid container>
              <label>
                <input
                  type="radio"
                  name="responsibleCompany"
                  checked={sizeValue === 0}
                  onChange={() => {
                    setSize0();
                  }}
                />
                <span>
                  Mサイズ：
                  <strong>{typeof itemRendering !== 'string' ? itemRendering.mprice : null}円</strong>(税抜)
                </span>
              </label>
            </Grid>
            <Grid container>
              <label>
                <input
                  type="radio"
                  name="responsibleCompany"
                  checked={sizeValue === 1}
                  onChange={() => {
                    setSize1();
                  }}
                />
                <span>
                  Lサイズ：
                  <strong>{typeof itemRendering !== 'string' ? itemRendering.lprice : null}円</strong>(税抜)
                </span>
              </label>
            </Grid>
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
        <Grid container justify="center" style={{ marginTop: " 20px" }}>
          <Grid item xs={2}>
            <label>
              <h4 style={{ margin: 0 }}>トッピング：</h4>
            </label>
          </Grid>
          <Grid item xs={2}>
            <Grid container>
              普通：<strong>200円</strong>(税抜)
            </Grid>
            <Grid container>
              多め：<strong>300円</strong>(税抜)
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container>
              <h5 style={{ margin: "0" }}>
                ※以下よりトッピングを選択してください
              </h5>
            </Grid>
            <Grid container>
              {toppingsRendering.map((topping, index) => {
                return (
                  <Grid
                    item
                    key={index}
                    style={{ marginBottom: "10px", marginLeft: "20px" }}
                  >
                    <label>
                      <input
                        name={toppingsRendering[index].name}
                        type="checkbox"
                        onChange={(e) => {
                          changeFlag(e);
                        }}
                      />
                      {topping.name}
                      <span
                        style={{
                          display: toppingFlag[topping.name] ? "block" : "none",
                        }}
                      >
                        <input
                          type="radio"
                          value="1"
                          name={toppingsRendering[index].name}
                          checked={
                            calcToppingSize[toppingsRendering[index].name] === 1
                          }
                          onChange={(e) => {
                            changeToppingSize(e);
                          }}
                        />
                        普通
                        <input
                          type="radio"
                          value="2"
                          name={toppingsRendering[index].name}
                          checked={
                            calcToppingSize[toppingsRendering[index].name] === 2
                          }
                          onChange={(e) => {
                            changeToppingSize(e);
                          }}
                        />
                        多め
                      </span>
                    </label>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
        <Grid container justify="center" style={{ marginTop: " 20px" }}>
          <Grid item xs={2}>
            <label>
              <h4 style={{ margin: 0 }}>数量選択：</h4>
            </label>
          </Grid>
          <Grid item xs={2}>
            <Select
              value={selectValue}
              onChange={(e) => {
                getSelectValue(e);
              }}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={11}>11</MenuItem>
              <MenuItem value={12}>12</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
        <h3>合計：{totalPrice} 円(税抜)</h3>
        <div className="row">
          <div className="col-xs-offset-2 col-xs-3">
            <div className="form-group">
              <p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => doAddCart()}
                >
                  カートに追加
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
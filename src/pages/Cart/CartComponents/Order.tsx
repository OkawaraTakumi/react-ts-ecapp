import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import axios from "axios";
import { userInfo } from "../Type/cartType";
import { order } from "../Slice/cartSlice";
import {
  Button,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormHelperText,
  Box,
} from "@material-ui/core";
import { db } from "../../../firebase/index";
import { cartInfo } from "../Type/cartType";
import {
  ORDER_STATUS_PAID,
  ORDER_STATUS_UNPAID,
  TOKEN_CHECK,
} from "../statusConstant/statusConstant";
// import {sendEmail} from '../../status/functions'

interface Props {
    cartInfo: cartInfo;
    uid: string; 
    totalPrice: number;
}


export const Order = (props:Props) => {
  //バリデージョン
  const [nameError, setNameError] = useState("");
  const [nameFlag, setNameFlag] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [emailFlag, setEmailFlag] = useState(true);
  const [zipError, setZipError] = useState("");
  const [zipFlag, setZipFlag] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [addressFlag, setAddressFlag] = useState(true);
  const [tellError, setTellError] = useState("");
  const [tellFlag, setTellFlag] = useState(true);
  const [creditcardError, setCreditcardError] = useState("");
  const [cardNoFlag, setCardNoflag] = useState(false); //カードナンバーの判定用
  const [timeError, setTimeError] = useState("");
  const [timeFlag, setTimeFlag] = useState(false);
  const [paymentFlag, setPaymentFlag] = useState(ORDER_STATUS_UNPAID); //支払い方法の判定用 1ならカード 2なら代引き
  const [creditShowFlag, setcreditShowFlag] = useState(false);
  const items = useSelector((state:RootState) => state.commonSlice.itemData);
  const toppings = useSelector((state:RootState) => state.commonSlice.toppingData);

  //firestoreからデータ取得
  const [userdata, setUserdata] = useState<userInfo>({
    name: "",
    address: "",
    email: "",
    cardNo: "",
    date: "",
    payment: ORDER_STATUS_UNPAID as number,
    status: ORDER_STATUS_UNPAID as number,
    tel: "",
    zip: "",
  });
  
  const dispatch = useDispatch();
  const history = useHistory();
  const handleLink = (path:string) => history.push(path);

  useEffect(() => {
    db.collection(`users/${props.uid}/userInfo`)
      .get()
      .then((snapShot) => {
        console.log(snapShot.docs[0].data())
        setUserdata({
          ...snapShot.docs[0].data() as userInfo,
          status: ORDER_STATUS_UNPAID,
          payment: ORDER_STATUS_UNPAID,
        });
      });
  }, [props.uid]);

  //名前のバリデーションーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const checkname = (e:React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setUserdata({ ...userdata, name: name });
    if (name === "") {
      setNameError("名前を入力して下さい");
      setNameFlag(false);
    } else {
      setNameError("");
      setNameFlag(true);
    }
  };

  //メールアドレスのバリデーションーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const checkmail = (e:React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    const Validate = /.+@.+/;
    setUserdata({ ...userdata, email: email });
    if (email === "") {
      setEmailError("メールアドレスを入力して下さい");
      setEmailFlag(false);
    } else if (!email.match(Validate)) {
      setEmailError("メールアドレスの形式が不正です");
      setEmailFlag(false);
    } else {
      setEmailError("");
      setEmailFlag(true);
    }
  };

  //郵便番号のバリデーションーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const checkzip = (e:React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value;
    const Validate = /^\d{3}[-]\d{4}$/;
    setUserdata({ ...userdata, zip: zip });
    if (zip === "") {
      setZipError("郵便番号を入力して下さい");
      setZipFlag(false);
    } else if (!zip.match(Validate)) {
      setZipError("郵便番号はXXX-XXXXの形式で入力して下さい");
      setZipFlag(false);
    } else {
      setZipError("");
      setZipFlag(true);
    }
  };

  //電話番号のバリデーションーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const checktel = (e:React.ChangeEvent<HTMLInputElement>) => {
    const tel = e.target.value;
    const Validate = /\d{2,5}[-(]\d{1,4}[-)]\d{4}$/;
    setUserdata({ ...userdata, tel: tel });
    if (tel === "") {
      setTellError("電話番号を入力して下さい");
      setTellFlag(false);
    } else if (!tel.match(Validate)) {
      setTellError("電話番号はXXX-XXXX-XXXXの形式で入力して下さい");
      setTellFlag(false);
    } else {
      setTellError("");
      setTellFlag(true);
    }
  };

  //住所のバリデーションーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  //【住所検索処理】(エラー文の実装の余地あり)
  const searchAddress = () => {
    axios
      .get(`https://api.zipaddress.net/?zipcode=${userdata.zip}`)
      .then((res) => {
        setUserdata({ ...userdata, address: res.data.data.fullAddress });
        checkaddress(res.data.data.fullAddress);
      })
      .catch(() => {
        setUserdata({ ...userdata, address: "取得に失敗しました" });
        checkaddress("取得に失敗しました");
      });
  };

  const checkaddress = (address:string) => {
    setUserdata({ ...userdata, address: address });
    if (address === "") {
      setAddressError("住所を入力して下さい");
      setAddressFlag(false);
    } else if (address === "取得に失敗しました") {
      setAddressError("正しい住所を入力して下さい");
      setAddressFlag(false);
    } else {
      setAddressError("");
      setAddressFlag(true);
    }
  };

  //配達日時のバリデーションーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  let today:Date|string = new Date(); //日付選択で今日より前の日付を選べないようにする
  let thisYear = today.getFullYear();
  let thisMonth = ("00" + (today.getMonth() + 1)).slice(-2);
  let thisDate = ("00" + today.getDate()).slice(-2);
  today = `${thisYear}-${thisMonth}-${thisDate}T00:00`;

  const checkdate = (e:React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    //今から3時間以内が選択されたらエラーメッセージ
    let clickday = new Date();
    let nowTimestamp = clickday.getTime();
    nowTimestamp = Math.floor(nowTimestamp / 1000);

    const checkyear = Number(date.slice(0, 4));
    const checkmonth = Number(date.slice(5, 7));
    const checkday = Number(date.slice(8, 10));
    const checkhour = Number(date.slice(11, 13));
    const checkminutes = Number(date.slice(14, 16)); 
    const selectedDay = new Date(
      checkyear,
      checkmonth - 1,
      checkday,
      checkhour - 3, //後々の条件式のために3時間分減らしている
      checkminutes
      );
    const selectedTimestamp = Math.floor(Number(selectedDay) / 1000);
    setUserdata({ ...userdata, date: date });
    if (date === "") {
      setTimeError("配達日時を入力して下さい");
      setTimeFlag(false);
    } else if (nowTimestamp > selectedTimestamp) {
      setTimeError("今から3時間後の日時をご入力ください");
      setTimeFlag(false);
    } else {
      setTimeError("");
      setTimeFlag(true);
    }
  };

  //クレカのバリデーションーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  const setPayment = (e:React.ChangeEvent<HTMLInputElement>) => {
    //カード払いがチェックされた時
    if (Number(e.target.value)  === ORDER_STATUS_PAID) {
      setUserdata({
        ...userdata,
        status: ORDER_STATUS_PAID,
        payment: ORDER_STATUS_PAID,
      });
      setPaymentFlag(ORDER_STATUS_PAID);
      setcreditShowFlag(true);
      setCreditcardError("クレジットカード番号を入力して下さい");
    } else if (ORDER_STATUS_UNPAID) {
      setUserdata({
        ...userdata,
        status: ORDER_STATUS_UNPAID,
        payment: ORDER_STATUS_UNPAID,
        cardNo: "",
      });
      setPaymentFlag(ORDER_STATUS_UNPAID);
      setcreditShowFlag(false);
    }
  };

  const checkCard = (e:React.ChangeEvent<HTMLInputElement>) => {
    const cardNo = e.target.value;
    const Validate = /\d[0-9]{13}/g;
    if (cardNo === "") {
      setCreditcardError("クレジットカード番号を入力して下さい");
      setCardNoflag(false);
    } else if (!cardNo.match(Validate)) {
      setCreditcardError(
        "クレジットカード番号は14〜16桁の半角数字で入力してください"
      );
      setCardNoflag(false);
    } else {
      setUserdata({ ...userdata, cardNo: e.target.value });
      setCreditcardError("");
      setCardNoflag(true);
    }
  };

  const checkInput = () => {
    //カード払いの時
    if (paymentFlag === ORDER_STATUS_PAID) {
      if (
        nameFlag &&
        emailFlag &&
        zipFlag &&
        addressFlag &&
        tellFlag &&
        timeFlag &&
        cardNoFlag
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        nameFlag &&
        emailFlag &&
        zipFlag &&
        addressFlag &&
        tellFlag &&
        timeFlag
      ) {
        return true;
      } else {
        return false;
      }
    }
  };


    
    //checkCardで取得したinputのvalueがcash(代引き)ならstatus=1,credit(クレカ)ならstatus=2
    const confirmOrder = () => {
      let check = checkInput();
      if (check) {
      if (window.confirm("注文してもよろしいですか？")) {
        //とってきたデータそのままだとなぜかstatusがundefinedになるので入れ替えしている。
        let now = new Date();
        const orderDate = now.getTime();
        const totalPrice = props.totalPrice;
        setUserdata({...userdata,orderDate:orderDate,totalPrice:totalPrice})
        //dispatchに渡すために変数にいれてる
        const uid = props.uid;
        const cartId = props.cartInfo.id as string
        dispatch(order({userdata, uid, cartId}));
        // sendEmail(props,toppings,items,userdata)
        handleLink(`/ordercomp/${TOKEN_CHECK}`);
      }
    } else {
      alert("入力内容にエラーがあります");
    }
  };

  return (
    <React.Fragment>
      <Grid container alignItems="center" justify="center" spacing={0}>
        <br />
        <div>
          <Box fontSize="h4.fontSize" textAlign="center">
            お届け先情報
          </Box>
          <div>
            <label>お名前</label>
          </div>
          <TextField
            type="text"
            id="name"
            variant="outlined"
            value={userdata.name}
            onChange={checkname}
            helperText={nameError}
          />
          <div>メールアドレス</div>
          <TextField
            type="text"
            id="mail"
            variant="outlined"
            value={userdata.email}
            onChange={checkmail}
            helperText={emailError}
          />
          <div>郵便番号</div>
          <TextField
            type="text"
            variant="outlined"
            value={userdata.zip}
            onChange={checkzip}
            helperText={zipError}
          />
          <Button variant="contained" type="button" onClick={searchAddress}>
            住所検索
          </Button>
          <div>住所</div>
          <TextField
            type="text"
            value={userdata.address}
            onChange={(e) => checkaddress(e.target.value)}
            helperText={addressError}
            variant="outlined"
          />
          <div>電話番号</div>
          <TextField
            type="text"
            variant="outlined"
            value={userdata.tel}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => checktel(e)}
            helperText={tellError}
          />
          <div>配達日時</div>
          <TextField
            type="datetime-local"
            variant="outlined"
            onChange={checkdate}
            helperText={timeError}
          />
          <div>支払方法</div>
          <FormControl>
            <RadioGroup 
            onChange={setPayment} value={paymentFlag}
            >
              <FormControlLabel
                control={<Radio />}
                value={ORDER_STATUS_UNPAID}
                label="代金引換"
                labelPlacement="end"
              />
              <FormControlLabel
                control={<Radio />}
                value={ORDER_STATUS_PAID}
                label="クレジットカード決済"
                labelPlacement="end"
              />
            </RadioGroup>
          </FormControl>
          {creditShowFlag && (
            <div>
              <div>カード番号</div>
              <TextField
                type="text"
                variant="outlined"
                onChange={checkCard}
                helperText={creditcardError}
                inputProps={{
                  maxLength: 16,
                }}
              />
            </div>
          )}
          <div>
            <Button variant="contained" type="button" 
            onClick={confirmOrder}
            >
              この内容で注文する
            </Button>
          </div>
        </div>
      </Grid>
    </React.Fragment>
  );
};
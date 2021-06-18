import  React  from "react"
import { useState } from "react"
import { auth, db } from "../../firebase"
import axios from "axios"
import { useHistory } from "react-router-dom";
import {
    TextField,
    Button,
    Grid,
} from "@material-ui/core"




export const Register = () => {

    const [name, setName] = useState<string>("");
    const [nameError, setNameError] = useState<string>("");
    const [nameFlag, setNameFlag] = useState<boolean>(true);
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [emailFlag, setEmailFlag] = useState<boolean>(true);
    const [zip, setZip] = useState<string>("");
    const [zipError, setZipError] = useState<string>("");
    const [zipFlag, setZipFlag] = useState<boolean>(true);
    const [address, setAddress] = useState<string>("");
    const [addressError, setAddressError] = useState<string>("");
    const [addressFlag, setAddressFlag] = useState<boolean>(true);
    const [tell, setTell] = useState<string>("");
    const [tellError, setTellError] = useState<string>("");
    const [tellFlag, setTellFlag] = useState<boolean>(true);
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [passwordFlag, setPasswordFlag] = useState<boolean>(true);
    const [confirm, setConfirm] = useState<string>("");
    const [confirmError, setConfirmError] = useState<string>("");
    const [confirmFlag, setConfirmFlag] = useState<boolean>(true);
    const history = useHistory();
    const handleLink = (path:string) => history.push(path);

    //クリアボタン処理
  const clearText = () => {
    setName("");
    setEmail("");
    setZip("");
    setAddress("");
    setTell("");
    setPassword("");
    setConfirm("");
    setNameError("");
    setEmailError("");
    setZipError("");
    setAddressError("");
    setTellError("");
    setPasswordError("");
    setConfirmError("");
  };

  const ClearName = (e:React.ChangeEvent<HTMLInputElement>) => {
    const Check:string = e.target.value;
    setName(e.target.value);
    if (Check === "") {
      setNameError("名前を入力して下さい");
      setNameFlag(false);
    } else {
      setNameError("");
      setNameFlag(true);
    }
  };

  const ClearEmail = (e:React.ChangeEvent<HTMLInputElement>) => {
    const Check:string = e.target.value;
    const Validate = /.+@.+/;
    setEmail(e.target.value);
    if (Check === "") {
      setEmailError("メールアドレスを入力して下さい");
      setEmailFlag(false);
    } else if (!Check.match(Validate)) {
      setEmailError("メールアドレスの形式が不正です");
      setEmailFlag(false);
    } else {
      setEmailError("");
      setEmailFlag(true);
    }
  };

  const ClearZip = (e:React.ChangeEvent<HTMLInputElement>) => {
    const Check:string = e.target.value;
    const Validate = /^\d{3}[-]\d{4}$/;
    setZip(e.target.value);
    if (Check === "") {
      setZipError("郵便番号を入力して下さい");
      setZipFlag(false);
    } else if (!Check.match(Validate)) {
      setZipError("郵便番号はXXX-XXXXの形式で入力して下さい");
      setZipFlag(false);
    } else {
      setZipError("");
      setZipFlag(true);
    }
  };

  const ClearAddress = (e:React.ChangeEvent<HTMLInputElement>) => {
    const Check:string = e.target.value;
    setAddress(e.target.value);
    if (Check === "") {
      setAddressError("住所を入力して下さい");
      setAddressFlag(false);
    } else {
      setAddressError("");
      setAddressFlag(true);
    }
  };

  const ClearTell = (e:React.ChangeEvent<HTMLInputElement>) => {
    const Check:string = e.target.value;
    const Validate = /\d{2,5}[-(]\d{1,4}[-)]\d{4}$/;
    setTell(e.target.value);
    if (Check === "") {
      setTellError("電話番号を入力して下さい");
      setTellFlag(false);
    } else if (!Check.match(Validate)) {
      setTellError("電話番号はXXX-XXXX-XXXXの形式で入力して下さい");
      setTellFlag(false);
    } else {
      setTellError("");
      setTellFlag(true);
    }
  };

  const ClearPassword = (e:React.ChangeEvent<HTMLInputElement>) => {
    const Check:string = e.target.value;
    const Validate = /^[a-zA-Z0-9!#$%&()*+,.:;=?@[\]^_{}-]+$/;
    setPassword(e.target.value);
    if (Check === "") {
      setPasswordError("パスワードを入力して下さい");
      setPasswordFlag(false);
    } else if (!Check.match(Validate)) {
      setPasswordError(
        "パスワードは半角英数字と記号「!@#$%^&*()_+-=[]{};:?,.」のみです"
      );
      setPasswordFlag(false);
    } else {
      setPasswordError("");
      setPasswordFlag(true);
    }
  };

  const ClearConfirm = (e:React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.target.value);
    const Check:string = e.target.value;
    const passwordValue:string = (document.getElementById("password") as HTMLInputElement).value;
    const Validate = /^[a-zA-Z0-9!#$%&()*+,.:;=?@[\]^_{}-]+$/;

    if (Check === "") {
      setConfirmError("確認用パスワードを入力して下さい");
      setConfirmFlag(false);
    } else if (!Check.match(Validate)) {
      setConfirmError(
        "確認用パスワードは半角英数字と記号「!@#$%^&*()_+-=[]{};:?,.」のみです"
      );
      setConfirmFlag(false);
    } else if (Check !== passwordValue) {
      setConfirmError("パスワードが一致しません");
      setConfirmFlag(false);
    } else {
      setConfirmError("");
      setConfirmFlag(true);
    }
  };
  //ユーザー登録処理（エラー文の実装の余地あり）
  const handleRegist = () => {
    let listElements:HTMLInputElement[] = Array.from(document.getElementsByTagName("input"));
    const valueList :{
          [key: string]:string
    }= {};
    listElements.forEach((item) => {
      if (item.name) {
        valueList[item.name] = item.value;
      }
    });
    console.log(nameFlag,'名前')
    console.log(emailFlag,'メール')
    console.log(zipFlag,'郵便番号')
    console.log(addressFlag,'住所')
    console.log(tellFlag,'電話')
    console.log(passwordFlag,'パスワード')
    console.log(confirmFlag,'確認')
    if (
      nameFlag &&
      emailFlag &&
      zipFlag &&
      addressFlag &&
      tellFlag &&
      passwordFlag &&
      confirmFlag
    ) {
      const email:string = valueList.email;
      const password:string = valueList.password;
      let uid:string = "";
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          let user = auth.currentUser;
          if (user != null) {
            uid = user.uid;
            valueList.userId = user.uid;
          }
        })
        .then(() => {
          db.collection(`users/${uid}/userInfo`).add(valueList);
          //新しく追加しました（管理者テーブルへの情報追加
          // db.collection(`admin/${ADMIN_ID}/user`)
          // .doc(USERS_TABLE_ID)
          // .update({
          //   users: firebase.firestore.FieldValue.arrayUnion(valueList),
          // });
          handleLink("/");
        },
        error=>{
          if(error.message === 'The email address is already in use by another account.'){
            console.log(error.message)
            setEmailError('※このメールアドレスはすでに使われています')
          }else{
            alert('入力に不備があります');
          }
        });
    }else{
      alert('入力に不備があります');
    }
  };

  const searchAddress = () => {
    const zipValue = (document.getElementById("zip") as HTMLInputElement).value;
    //不正な値の場合処理をはじく
    axios
      .get(`https://api.zipaddress.net/?zipcode=${zipValue}`)
      .then((res) => {
        setAddress(res.data.data.fullAddress as string);
        setAddressError("");
        setAddressFlag(true);
      })
      .catch(() => setAddress("取得に失敗しました"));
  };


    return(
        <React.Fragment>
            <form  autoComplete="off">
      <Grid container spacing={1} justify="center">
        <Grid>
          <div>
            <TextField
              label="名前"
              name="name"
              value={name}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => ClearName(e)}
              helperText={nameError}
            />
          </div>
        </Grid>

        <Grid item xs>
          <div>
            <TextField
              label="メールアドレス"
              name="email"
              value={email}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => ClearEmail(e)}
              helperText={emailError}
            />
          </div>
        </Grid>

        <Grid item xs>
          <div>
            <TextField
              label="郵便番号"
              id="zip"
              name="zip"
              value={zip}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => ClearZip(e)}
              helperText={zipError}
            />
          </div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => searchAddress()}
          >
            住所検索
          </Button>
        </Grid>

        <Grid item xs>
          <div>
            <TextField
              label="住所"
              name="address"
              value={address}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => ClearAddress(e)}
              helperText={addressError}
            />
          </div>
        </Grid>

        <Grid item xs>
          <div>
            <TextField
              label="電話番号"
              name="tel"
              value={tell}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => ClearTell(e)}
              helperText={tellError}
            />
          </div>
        </Grid>

        <Grid item xs>
          <div>
            <TextField
              label="パスワード"
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => ClearPassword(e)}
              helperText={passwordError}
            />
          </div>
        </Grid>

        <Grid item xs>
          <div>
            <TextField
              label="確認用パスワード"
              type="password"
              value={confirm}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => ClearConfirm(e)}
              helperText={confirmError}
            />
          </div>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleRegist()}
      >
        登録
      </Button>
      <Button variant="contained" color="secondary" onClick={() => clearText()}>
        クリア
      </Button>
    </form>
        </React.Fragment>
    )
}
import { auth } from "../../firebase"
import React from "react"
import { Link } from 'react-router-dom'
import { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from '../../app/store'
import { db, sessionPersistance } from "../../firebase"; 
import { updateCart, createCart } from "../Cart/Slice/cartSlice";
import {
  TextField,
  Button,
  Container,
  Box,
} from "@material-ui/core";


export const Login = () => {
    const [email,setEmail]= useState<string>('')
    const [emailError,setEmailError]= useState<string>('')
    const [emailFlag,setEmailFlag] = useState<boolean>(true)
    const [password,setPassword]= useState<string>('')
    const [passwordError,setPasswordError]= useState<string>('')
    const [passwordFlag,setPasswordFlag] = useState<boolean>(true)
    const [errorText,setErrorText] = useState<string>('');
    const history = useHistory();
    const dispatch = useDispatch();
    const uid = useSelector((state:RootState) => state.user.uid)
  
    //アンマウント時、ローカルストレージにデータが残っていたら削除
    useEffect(() => {
      return () => {
        if (localStorage) {
          localStorage.removeItem("itemInfo");
        }
      };
    }, []);
  
    //バリデーション
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
        setEmailFlag(false);
      } else {
        setPasswordError("");
        setPasswordFlag(true);
      }
    };
  
    const doLogin = () => {
      if(emailFlag && passwordFlag){
        if(email !== '' && password !== '' ){
            auth.signInWithEmailAndPassword(email, password)
            history.push("/");
          //ローカルストレージにアイテムがあった時
          let itemInfo = JSON.parse(localStorage.getItem("itemInfo") as string);
          console.log(itemInfo)
          //ログイン処理
          auth.setPersistence(sessionPersistance).then(() => {
            auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
              const uid = user.user!.uid;
              console.log('ログインしました')
              //ローカルにアイテムが保存されていた場合はdbのカートへ追加もしくは新規カート作成を行う
              if (itemInfo) {
                console.log(itemInfo,'ローカルストレージが存在します')
                db.collection(`users/${uid}/orders`)
                  .get()
                  .then((snapShot) => {
                    console.log('スナップショットをとって来ました')
                    //そもそもorderにdoc自体が存在するかどうかをチェック
                    if (snapShot.empty === false) {
                      console.log('スナップショットにドックが存在します')
                      let cartExist = false;
                      snapShot.forEach((doc) => {
                        //statusがカート状態のものがあった場合
                        if (doc.data().status === 0) {
                          console.log(doc.data(),'ステータスが0のものが存在します')
                          cartExist = true;
                          let newCartInfo = JSON.parse(
                            JSON.stringify(doc.data())
                          );
                          console.log(newCartInfo.iteminfo)
                          newCartInfo.id = doc.id;
                          newCartInfo.iteminfo = [
                            ...newCartInfo.iteminfo,
                            ...itemInfo,
                          ];
                          dispatch(updateCart({newCartInfo, uid}));
                        }
                      });
                      //statusがカート状態のものがなかった場合
                      if (cartExist === false) {
                        console.log('ステータスが0のものがありません')
                        let newCartInfo = {
                          itemInfo: [...itemInfo],
                          status: 0,
                          userId: uid,
                        };
                        console.log(newCartInfo)
                        dispatch(createCart({newCartInfo, uid}));
                      }
                      //doc自体が存在しなかった時はdbにdocを作る。
                    } else if (snapShot.empty === true) {
                      console.log('doc自体が存在しません')
                      let newCartInfo = {
                        itemInfo: [...itemInfo],
                        status: 0,
                        userId: uid,
                      };
                      dispatch(createCart({newCartInfo, uid}));
                    }
                  });
                localStorage.removeItem("itemInfo");
                history.push("/cart");
              } else {
                history.push("/");
              }
            })
            .catch(() => alert('メールアドレスかパスワード、またはその両方がが間違っています'))
          }); 
        } else {
          alert('入力に誤りがあります');
        }
      } else {
        alert('入力に誤りがあります');
      }
    };
    return (
      <Container maxWidth='sm'>
        <div>{uid}</div>
        <Box mt={3} textAlign='center'>
                  <Box>
                      <TextField
                              label="メールアドレス"
                              type="email"
                              onChange={(e:React.ChangeEvent<HTMLInputElement>) => ClearEmail(e)}
                              helperText={emailError}
                            //   width={400}
                            />
                  </Box>
                  
                  <Box>
                      <TextField
                              label="パスワード"
                              type="password"
                              onChange={(e:React.ChangeEvent<HTMLInputElement>) => ClearPassword(e)}
                              helperText={passwordError}
                            />   
                  </Box>
        </Box>
  
  
        <Box mt={5} textAlign='center'>
              <Button
                variant="contained"
                color="secondary"
                onClick={doLogin}
              >
                ログイン
              </Button>
        </Box>
        
        <p style={{ color: "red" }}>{errorText}</p>
        <Box textAlign='center'>
            <Link to="/register">ユーザー登録はこちら</Link>
        </Box>
        
      </Container>
    );
}
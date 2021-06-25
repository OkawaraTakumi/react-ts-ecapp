import React from 'react';
import { AdminHome } from './AdminHome/AdminHome'
import { Cart } from './Cart/Cart';
import { Home } from './Home/Home';
import { ItemInfo } from './ItemInfo/ItemInfo';
import { Login } from './Login/Login';
import { OrderComp } from './OrderComp/OrderComp';
import { OrderHistory } from './OrderHistory/OrderHistory';
import { Register } from './Register/Register';
import { useEffect } from 'react'
import { auth } from '../firebase';
import { useDispatch } from 'react-redux';
import { user } from '../appSlice';
import { unset } from './Cart/Slice/cartSlice'
import { Header } from '../appComponent/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"
// import firebase from 'firebase';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((person) => {
      if(person) {
          const uid = person.uid
          dispatch(user({uid}))
      } else {
        const uid = ''
        dispatch(user({uid}))
        dispatch(unset({}))
      }
    } )
  })

  return (
    <Router>
        <Header/>
        <Switch>
          <Route path="/iteminfo/:itemid" exact component={ItemInfo}/>
          <Route path="/register" exact component={Register}/>
          <Route path="/login" exact component={Login}/>
          <Route path="/cart" exact component={Cart}/>
          <Route path="/ordercomp/:token" exact component={OrderComp}/>
          <Route path="/orderhistory" exact component={OrderHistory}/>
          <Route path="/admin" exact component={AdminHome}/>
          <Route path="/" component={Home}/>
        </Switch>
    </Router>
  );
}

export default App;

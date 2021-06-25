import React, { useEffect, useState } from "react";
import { auth } from "../firebase/index";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
// import { sidenav } from "../actions";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
// import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import HistoryIcon from "@material-ui/icons/History";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import MeetingRoomOutlinedIcon from "@material-ui/icons/MeetingRoomOutlined";
import { RootState } from '../app/store'
// import { ADMIN_ID } from "../status/index";
import { db } from "../firebase/index";
import logo from "./asset/header_logo.png"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginReft: theme.spacing(2),
  },
  Button: {
    marginLeft: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  header: {
    padding: theme.spacing(1, 1),
    backgroundColor: "orange",
  },
}));

export const Header = () => {
  const classes = useStyles();
  const uid = useSelector((state:RootState) => state.user.uid)
  const [userName, setUserName] = useState<string | null>('');
  const dispatch = useDispatch();
  const history = useHistory();

  const doLogout = () => {
    console.log(9)
    auth.signOut().then(() => {
      console.log('ログアウトしました')
      history.push("/");
    });
  };

  useEffect(() => {
    if (uid) {
      db.collection(`users/${uid}/userInfo`)
        .get()
        .then((snapShot) => {
          snapShot.forEach((doc) => {
            const name = doc.data().name
            setUserName(name);
          });
        });
    }
    return () => {
      setUserName(null);
    };
  }, [uid]);

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.header}>
        <Toolbar>
          <IconButton
            // onClick={() => dispatch(sidenav())}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" className={classes.title}>
            <Link to="/">
              <img src={logo} alt="ロゴ" />
            </Link>
          </Typography>
          <div>
            {userName && <span>ようこそ{userName}さん</span>}
            {/* {uid && uid === ADMIN_ID && (
              <IconButton
                className={classes.Button}
                onClick={() => history.push("/admin/users")}
              >
                <SupervisorAccountIcon />
              </IconButton>
            )} */}
            <IconButton
              className={classes.Button}
              onClick={() => history.push("/cart")}
            >
              <ShoppingCartIcon />
            </IconButton>
            {uid && (
              <IconButton
                className={classes.Button}
                onClick={() => history.push("/orderhistory")}
              >
                <HistoryIcon />
              </IconButton>
            )}
            {uid ? (
              <IconButton className={classes.Button} onClick={doLogout}>
                <MeetingRoomOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton
                className={classes.Button}
                onClick={() => history.push("/login")}
              >
                <MeetingRoomIcon />
              </IconButton>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
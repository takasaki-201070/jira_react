import React, { useState } from "react";
import styles from "./Auth.module.css";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  Button,
  IconButton,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
} from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  toggleMode,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncCreateProf,
  selectIsLoginView,
} from "./authSlice";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: theme.spacing(3),
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: "25ch",
  },
}));

const Auth: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const isLoginView = useSelector(selectIsLoginView);
  const [credential, setCredential] = useState({
    username: "",
    password: "",
    showPassword: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setCredential({ ...credential, [name]: value });
  };

  const handleClickShowPasswoed = () => {
    setCredential({ ...credential, showPassword: !credential.showPassword });
  };

  const login = async () => {
    if (isLoginView) {
      await dispatch(fetchAsyncLogin(credential));
    } else {
      const result = await dispatch(fetchAsyncRegister(credential));
      if (fetchAsyncRegister.fulfilled.match(result)) {
        await dispatch(fetchAsyncLogin(credential));
        await dispatch(fetchAsyncCreateProf());
      }
    }
  };

  return (
    <div className={styles.auth__root}>
      <h1>{isLoginView ? "Login" : "Register"}</h1>
      <br />
      <FormControl className={clsx(classes.margin, classes.textField)}>
        <InputLabel htmlFor="standard-username">Username</InputLabel>
        <Input
          id="standard-username"
          type="text"
          name="username"
          value={credential.username}
          onChange={handleInputChange}
        />
        <br />
      </FormControl>
      <FormControl className={clsx(classes.margin, classes.textField)}>
        <InputLabel htmlFor="standard-password">Password</InputLabel>
        <Input
          id="standard-password"
          type={credential.showPassword ? "text" : "password"}
          name="password"
          value={credential.password}
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aroa-label="toggle password bisibility"
                onClick={handleClickShowPasswoed}
              >
                {credential.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.button}
        onClick={login}
      >
        {isLoginView ? "ログイン" : "ユーザ登録"}
      </Button>
      <span onClick={() => dispatch(toggleMode())}>
        {isLoginView ? "ユーザ登録する" : "ログインする"}
      </span>
    </div>
  );
};

export default Auth;

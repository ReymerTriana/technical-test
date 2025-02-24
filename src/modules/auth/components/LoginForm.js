import React, { useState } from "react";
import { withRouter } from "react-router-dom";
// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../core/iconify";
import setMessage from "../../../core/messages/messages";
import { UseAuthContext } from "../context/AuthProvider";
import { login } from "../store/store";

// ----------------------------------------------------------------------

function LoginForm({ history }) {
  const { setAuth } = UseAuthContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMeValue, setRememberMeValue] = useState(true);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const destino = "/dashboard";
  const [showPassword, setShowPassword] = useState(false);

  const setUserData = (username, userid, expiration, token, stayLoggedIn) => {
    localStorage.setItem("username", username);
    localStorage.setItem("userid", userid);
    localStorage.setItem("expiration", expiration);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("stayLoggedIn", stayLoggedIn);
  };

  const validateData = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = "Nombre de Usuario requerido";
    }
    if (!password) {
      newErrors.password = "Contraseña requerida";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    localStorage.removeItem("accessToken");

    if (validateData()) {
      const loginData = { username, password };

      login(loginData)
        .then((response) => {
          if (response.status === 200) {
            const userAuth = response.data;

            setAuth({ ...userAuth });

            if (rememberMeValue) {
              setUserData(
                response.data.username,
                response.data.userid,
                response.data.expiration,
                response.data.token,
                rememberMeValue
              );
            } else {
              localStorage.setItem("accessToken", response.data.token);
            }

            setMessage("success", `¡Bienvenido ${userAuth.username}!`);

            history.replace(destino);
          } else if (
            response.request.status === 401 ||
            response.request.status === 400
          ) {
            const newErrors = {};

            newErrors.username = "Nombre de Usuario incorrecto";
            newErrors.password = "Contraseña incorrecta";
            setErrors(newErrors);

            setMessage("error", `¡Credenciales Incorrectas!`);
          }
        })
        .catch((error) => {
          console.log("Error al realizar el login", error);
          setMessage("error", `¡Ha ocurrido un error!`);
        });
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="username"
          label="Usuario"
          value={username}
          onChange={(event) => {
            if (event.target.value !== "") {
              setUsername(event.target.value);
              let errorsUpdate = errors;
              delete errorsUpdate["username"];
              setErrors(errorsUpdate);
            } else {
              setUsername(event.target.value);
              setErrors((prevState) => ({
                ...prevState,
                username: "Nombre de Usuario requerido",
              }));
            }
          }}
          error={!!errors.username}
          helperText={errors.username}
          required
          inputProps={{ maxLength: 15 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />

        <TextField
          name="password"
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => {
            if (event.target.value !== "") {
              setPassword(event.target.value);
              let errorsUpdate = errors;
              delete errorsUpdate["password"];
              setErrors(errorsUpdate);
            } else {
              setPassword(event.target.value);
              setErrors((prevState) => ({
                ...prevState,
                password: "Contraseña requerida",
              }));
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{ maxLength: 20 }}
          error={!!errors.password}
          helperText={errors.password}
          required
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
      </Stack>

      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMeValue}
            onChange={(newValue) => {
              console.log("clicked recuerdame", newValue);
              setRememberMeValue(!rememberMeValue);
            }}
          />
        }
        label="Recuérdame"
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={handleLogin}
        sx={{ textTransform: "none", mt: "20px" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleLogin();
          }
        }}
      >
        INICIAR SESIÓN
      </LoadingButton>

      <Link href="signup" underline="none">
        <span>¿No tiene una cuenta?</span>
        <br />
        <span>Regístrese</span>
      </Link>
    </>
  );
}

export default withRouter(LoginForm);

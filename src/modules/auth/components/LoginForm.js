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

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const destino = "/dashboard";
  const [showPassword, setShowPassword] = useState(false);

  const setUserData = (username, userid, expiration, token) => {
    localStorage.setItem("username", username);
    localStorage.setItem("userid", userid);
    localStorage.setItem("expiration", expiration);
    localStorage.setItem("accessToken", token);
  };

  const handleLogin = () => {
    localStorage.removeItem("accessToken");
    const loginData = { username, password };

    login(loginData)
      .then((response) => {
        if (response.status === 200) {
          const userAuth = response.data;

          setAuth({ ...userAuth });
          setUserData(
            response.data.username,
            response.data.userid,
            response.data.expiration,
            response.data.token
          );

          setMessage("success", `¡Bienvenido ${userAuth.username}!`);

          history.replace(destino);
        } else if (
          response.request.status === 401 ||
          response.request.status === 400
        ) {
          const newErrors = {};

          newErrors.username = "error";
          newErrors.password = "error";
          setErrors(newErrors);

          setMessage("error", `¡Credenciales Incorrectas!`);
        }
      })
      .catch((error) => {
        console.log("Error al realizar el login", error);
        setMessage("error", `¡Ha ocurrido un error!`);
      });
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
              setErrors((prevState) => ({ ...prevState, username: "error" }));
            }
          }}
          error={!!errors.username}
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
              setErrors((prevState) => ({ ...prevState, password: "error" }));
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
          required
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
      </Stack>

      <FormControlLabel
        control={<Checkbox checked={false} />}
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

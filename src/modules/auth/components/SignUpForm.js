import { useState } from "react";
import { withRouter } from "react-router-dom";
// @mui
import { LoadingButton } from "@mui/lab";
import { IconButton, InputAdornment, Stack, TextField } from "@mui/material";
// components
import Iconify from "../../../core/iconify";
import setMessage from "../../../core/messages/messages";
import { UseAuthContext } from "../context/AuthProvider";
import { login } from "../store/store";

// ----------------------------------------------------------------------

function SignUpForm({ history }) {
  const { setAuth } = UseAuthContext();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const destino = "/dashboard";
  const [showPassword, setShowPassword] = useState(false);

  const setUserData = (username, rol, name, token) => {
    localStorage.setItem("username", username);
    localStorage.setItem("rol", rol);
    localStorage.setItem("name", name);
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
            response.data.rol,
            response.data.name,
            response.data.token
          );

          setMessage("success", `¡Bienvenido ${userAuth.name}!`);

          history.replace(destino);
        } else if (response.request.status === 401) {
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
          label="Nombre Usuario"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
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
          name="email"
          label="Dirección de correo"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={!!errors.email}
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
          onChange={(event) => setPassword(event.target.value)}
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
        REGISTRARME
      </LoadingButton>
    </>
  );
}

export default withRouter(SignUpForm);

import { useState } from "react";
import { withRouter } from "react-router-dom";
// @mui
import { LoadingButton } from "@mui/lab";
import { IconButton, InputAdornment, Stack, TextField } from "@mui/material";
// components
import Iconify from "../../../core/iconify";
import setMessage from "../../../core/messages/messages";
import { signup } from "../store/store";

// ----------------------------------------------------------------------

function SignUpForm({ history }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (value) => {
    const valid = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    return valid.test(value.toString());
  };

  const validatePassword = (value) => {
    const valid = new RegExp(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{9,20}$/
    );
    return valid.test(value.toString());
  };

  const validateData = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = "Nombre de Usuario requerido";
    }
    if (!email) {
      newErrors.email = "Email requerido";
    }
    if (!password) {
      newErrors.password = "Contraseña requerida";
    }

    if (Object.keys(newErrors).length === 0) {
      if (!validatePassword(password)) {
        newErrors.password =
          "Debe ser mayor a 8 y menor o igual a 20 caracteres, tener al menos un número, al menos una mayúscula y una minúscula.";
      }
      if (!validateEmail(email)) {
        newErrors.email = "Introduzca una dirección de correo válida.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    localStorage.removeItem("accessToken");
    if (validateData()) {
      const loginData = { username, email, password };

      signup(loginData)
        .then((response) => {
          if (response.status === 200) {
            setMessage("success", response.data.message);

            history.replace("/login");
          } else {
            setMessage("error", `¡Ha ocurrido un error!`);
          }
        })
        .catch((error) => {
          console.log("Error al realizar el registro", error);
          setMessage("error", `¡Ha ocurrido un error!`);
        });
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="username"
          label="Nombre Usuario"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            let errorsUpdate = errors;
            delete errorsUpdate["username"];
            setErrors(errorsUpdate);
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
          autoComplete="off"
        />
        <TextField
          name="email"
          label="Dirección de correo"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            let errorsUpdate = errors;
            delete errorsUpdate["email"];
            setErrors(errorsUpdate);
          }}
          error={!!errors.email}
          helperText={errors.email}
          required
          inputProps={{ maxLength: 50 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          autoComplete="off"
        />
        <TextField
          name="password"
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            let errorsUpdate = errors;
            delete errorsUpdate["password"];
            setErrors(errorsUpdate);
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
          autoComplete="off"
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

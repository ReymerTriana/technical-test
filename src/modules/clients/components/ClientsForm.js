import { Alert, Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import PropTypes from "prop-types";
import { useState } from "react";
import setMessage from "../../../core/messages/messages";
import { insertCarrera, updateCarrera } from "../store/store";

CareersForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default function CareersForm({ editMode, formData, onSubmit }) {
  const { cod_carrera, nomb_carrera } = formData;
  const [careerCodeInput, setCareerCodeInput] = useState(cod_carrera);
  const [careerNameInput, setCareerNameInput] = useState(nomb_carrera);
  const confirm = useConfirm();

  const [errors, setErrors] = useState({
    carrerCode: "",
    careerName: "",
  });

  const validateData = () => {
    const newErrors = {};

    if (!careerCodeInput) {
      newErrors.carrerCode = "Código requerido";
    }
    if (!careerNameInput) {
      newErrors.careerName = "Nombre requerido";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateData()) {
      const updatedData = {
        cod_carrera: careerCodeInput,
        nomb_carrera: careerNameInput,
        eliminada: false,
      };

      if (editMode) {
        updateCarrera(updatedData)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setMessage("success", "¡Carrera actualizada con éxito!");

              setTimeout(() => {
                onSubmit();
              }, 500);
            } else if (response.request.status === 500) {
              console.log("el error", response.request.response);
              setMessage(
                "error",
                `Ya se encuentra registrada ese nombre o código.`
              );
            }
          })
          .catch((error) => {
            console.log("Error al registrar la carrera: ", error);
            setMessage("error", "¡Ha ocurrido un error!");
          });
      } else {
        insertCarrera(updatedData)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setMessage("success", "¡Carrera registrada con éxito!");

              setTimeout(() => {
                onSubmit();
              }, 500);
            } else if (response.request.status === 500) {
              console.log("el error", response.request.response);
              setMessage(
                "error",
                `Ya se encuentra registrado ese nombre o código.`
              );
            }
          })
          .catch((error) => {
            console.log("Error al modificar la carrera: ", error);
            setMessage("error", "¡Ha ocurrido un error!");
          });
      }
    }
  };

  const handleCancel = () => {
    confirm({
      content: (
        <Alert severity={"warning"}>
          ¡Perderá los cambios no guardados! ¿Desea continuar?
        </Alert>
      ),
    })
      .then(() => {
        onSubmit();
      })
      .catch(() => {});
  };

  const handleNameInput = (event) => {
    // allow only one blank space and letters
    const inputValue = event.target.value.replace(/[^a-zA-Z\s]/g, "");
    event.target.value = inputValue;
  };

  const handleCodeInput = (event) => {
    // Allow only numbers and the plus (+) symbol
    const inputValue = event.target.value.replace(/[^0-9]/g, "");
    event.target.value = inputValue;
  };

  return (
    <>
      <Box
        flexGrow={{ flexGrow: 1 }}
        sx={{
          backgroundColor: "white",
          marginTop: "80px",
          pr: "100px",
          pl: "100px",
          pb: "20px",
          pt: "20px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {editMode ? "Editar Carrera" : "Registrar Carrera"}
        </Typography>

        <Grid container spacing={2} sx={{ pt: 5 }}>
          <Grid item xs />

          <Grid item xs>
            <TextField
              type={"text"}
              label="Código"
              variant="outlined"
              value={careerCodeInput}
              onInput={handleCodeInput}
              onChange={(event) => setCareerCodeInput(event.target.value)}
              required
              error={!!errors.carrerCode}
              helperText={errors.carrerCode}
            />
          </Grid>

          <Grid item xs>
            <TextField
              type={"text"}
              label="Nombre"
              variant="outlined"
              value={careerNameInput}
              onInput={handleNameInput}
              onChange={(event) => setCareerNameInput(event.target.value)}
              required
              error={!!errors.careerName}
              helperText={errors.careerName}
              inputProps={{ maxLength: 45 }}
            />
          </Grid>

          <Grid item xs />
        </Grid>

        <Grid container spacing={1} sx={{ pt: 5 }}>
          <Grid item xs />
          <Grid item xs={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {editMode ? "Modificar" : "Registrar"}
            </Button>
          </Grid>
          <Grid item xs />
        </Grid>
      </Box>
    </>
  );
}

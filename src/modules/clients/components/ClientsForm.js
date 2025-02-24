import { mdiAccountCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addYears } from "date-fns";
import enGB from "date-fns/locale/en-GB";
import { isNull } from "lodash";
import { useConfirm } from "material-ui-confirm";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { UseAuthContext } from "src/modules/auth/context/AuthProvider";
import setMessage from "../../../core/messages/messages";
import { getInterest, insertCliente, updateCliente } from "../store/store";

CareersForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};

const genderOptions = [
  { sexo: "F", nomb_gender: "Femenino" },
  { sexo: "M", nomb_gender: "Masculino" },
];

export default function CareersForm({ editMode, formData, onSubmit }) {
  const { id, sexo, interesesId } = formData;

  const [interestOptions, setInterestOptions] = useState([]);
  const fileInputRef = useRef(null);
  const [imageInput, setImageInput] = useState("");
  const [identificationInput, setIdentificationInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [lastNamesInput, setLastNamesInput] = useState("");
  const [selectedGenderInput, setSelectedGenderInput] = useState();
  const [birthDateInput, setBirthDateInput] = useState(
    addYears(new Date(), -18)
  );
  const [joinDateInput, setJoinDateInput] = useState(new Date());
  const [celPhoneInput, setCelPhoneInput] = useState("");
  const [otherPhoneInput, setOtherPhoneInput] = useState("");
  const [selectedInterestInput, setSelectedInterestInput] = useState();
  const [addressInput, setAddressInput] = useState("");
  const [reviewInput, setReviewInput] = useState("");

  const confirm = useConfirm();
  const { auth } = UseAuthContext();
  const [errors, setErrors] = useState({});

  //Update the data of the components with the selected for editMode
  useEffect(() => {
    if (formData && editMode) {
      console.log("se ejecuta");

      setImageInput(formData.imagen);
      setIdentificationInput(formData.identificacion);
      setNameInput(formData.nombre);
      setLastNamesInput(formData.apellidos);
      setBirthDateInput(Date(formData.fNacimiento));
      setJoinDateInput(Date(formData.fAfiliacion));
      setCelPhoneInput(formData.telefonoCelular);
      setOtherPhoneInput(formData.otroTelefono);
      setAddressInput(formData.direccion);
      setReviewInput(formData.resenaPersonal);
    }
  }, [formData, editMode]);

  //Update the data of the combos with the selected for editMode
  useEffect(() => {
    const returnValue = sexo
      ? genderOptions.find((gO) => gO.sexo === String(sexo).toUpperCase())
      : genderOptions[0];
    setSelectedGenderInput(returnValue);
  }, [sexo]);

  useEffect(() => {
    getInterest().then((response) => {
      if (response.status === 200) {
        setInterestOptions(response.data);
      } else {
        setMessage("error", `¡Listado de intereses no disponibles!`);
      }
    });
  }, []);

  //Update the data of the combos with the selected for editMode
  useEffect(() => {
    const returnValue = interesesId
      ? interestOptions.find((iO) => iO.id === interesesId)
      : interestOptions[0];
    setSelectedInterestInput(returnValue);
  }, [interesesId, interestOptions]);

  const validateData = () => {
    const newErrors = {};

    if (!identificationInput) {
      newErrors.identificacion = "Identificación requerida";
    }
    if (!nameInput) {
      newErrors.nombre = "Nombre requerido";
    }
    if (!lastNamesInput) {
      newErrors.apellidos = "Apellidos requeridos";
    }
    if (!selectedGenderInput) {
      newErrors.sexo = "Sexo requerido";
    }
    if (!birthDateInput) {
      newErrors.fNacimiento = "Fecha de nacimiento requerida";
    }
    if (!joinDateInput) {
      newErrors.fAfiliacion = "Fecha de afiliación requerida";
    }
    if (!celPhoneInput) {
      newErrors.celular = "Teléfono celular requerido";
    }
    if (!otherPhoneInput) {
      newErrors.otroTelefono = "Otro teléfono requerido";
    }
    if (!selectedInterestInput) {
      newErrors.interesId = "Intereses requeridos";
    }
    if (!addressInput) {
      newErrors.direccion = "Dirección requerida";
    }
    if (!reviewInput) {
      newErrors.resennaPersonal = "Reseña requerida";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateData()) {
      let updatedData = {};

      if (!editMode) {
        updatedData = {
          nombre: nameInput,
          apellidos: lastNamesInput,
          identificacion: identificationInput,
          celular: celPhoneInput,
          otroTelefono: otherPhoneInput,
          direccion: addressInput,
          fNacimiento: birthDateInput.toISOString(),
          fAfiliacion: joinDateInput.toISOString(),
          sexo: selectedGenderInput.sexo,
          resennaPersonal: reviewInput,
          imagen: imageInput,
          interesFK: selectedInterestInput.id,
          usuarioId: auth.userid,
        };
      } else {
        const bD = new Date(birthDateInput);
        const jD = new Date(joinDateInput);

        updatedData = {
          id: id,
          nombre: nameInput,
          apellidos: lastNamesInput,
          identificacion: identificationInput,
          celular: celPhoneInput,
          otroTelefono: otherPhoneInput,
          direccion: addressInput,
          fNacimiento: bD.toISOString(),
          fAfiliacion: jD.toISOString(),
          sexo: selectedGenderInput.sexo,
          resennaPersonal: reviewInput,
          imagen: imageInput,
          interesFk: selectedInterestInput.id,
          usuarioId: auth.userid,
        };
      }

      console.log("la data a enviar", updatedData);

      if (editMode) {
        updateCliente(updatedData)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setMessage("success", "Cliente actualizado con éxito!");

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
            console.log("Error al actualizar el cliente: ", error);
            setMessage("error", "¡Ha ocurrido un error!");
          });
      } else {
        insertCliente(updatedData)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setMessage("success", "¡Cliente creado con éxito!");

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
            console.log("Error al insertar el cliente: ", error);
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

  const handleImageLoad = (event) => {
    if (event.target.files && !isNull(event.target.files)) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageInput(reader.result.split(",")[1]); // Extract base64 part
          console.log("imagen", reader.result.split(",")[1]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleNameInput = (event) => {
    // allow only one blank space and letters
    const inputValue = event.target.value.replace(/[^a-zA-Z\s]/g, "");
    event.target.value = inputValue;
  };

  const handleOnlyNumbersInput = (event) => {
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
          pl: "50px",
          pr: "50px",
          pb: "20px",
        }}
      >
        <Grid
          container
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item>
            <IconButton
              component="label"
              sx={{
                mt: 0,
                pt: 0,
                mr: 1,
                color: "text.primary",
              }}
            >
              <input
                type="file"
                id={"file-button"}
                hidden
                name="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageLoad}
                ref={fileInputRef}
              />
              <Icon size={2} path={mdiAccountCircleOutline} />
            </IconButton>
            <Typography variant="h4" gutterBottom display={"inline"}>
              {`Mantenimiento de clientes - ${editMode ? "Editar" : "Agregar"}`}
            </Typography>
          </Grid>

          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {editMode ? "Modificar" : "Registrar"}
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} rowSpacing={2} sx={{ pt: 5 }}>
          <Grid item container justifyContent={"space-between"}>
            <Grid item>
              <TextField
                type={"text"}
                label="Identificación"
                variant="outlined"
                value={identificationInput}
                onInput={handleOnlyNumbersInput}
                onChange={(event) => {
                  setIdentificationInput(event.target.value);
                  let errorUp = errors;
                  delete errorUp["identificacion"];
                  setErrors(errorUp);
                }}
                required
                error={!!errors.identificacion}
                helperText={errors.identificacion}
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            <Grid item>
              <TextField
                type={"text"}
                label="Nombre"
                variant="outlined"
                value={nameInput}
                onInput={handleNameInput}
                onChange={(event) => {
                  setNameInput(event.target.value);
                  let errorUp = errors;
                  delete errorUp["nombre"];
                  setErrors(errorUp);
                }}
                required
                error={!!errors.nombre}
                helperText={errors.nombre}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            <Grid item>
              <TextField
                type={"text"}
                label="Apellidos"
                variant="outlined"
                value={lastNamesInput}
                onInput={handleNameInput}
                onChange={(event) => {
                  setLastNamesInput(event.target.value);
                  let errorUp = errors;
                  delete errorUp["apellidos"];
                  setErrors(errorUp);
                }}
                required
                error={!!errors.apellidos}
                helperText={errors.apellidos}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
          </Grid>
          {/*------------------------------SEGUNDA FILA-------------------------------*/}
          <Grid item container justifyContent={"space-between"}>
            <Grid item>
              {selectedGenderInput && (
                <Autocomplete
                  id="genderCombo"
                  fullWidth
                  options={genderOptions}
                  getOptionLabel={(option) => option.nomb_gender}
                  value={selectedGenderInput}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setSelectedGenderInput(newValue);
                    } else {
                      setSelectedGenderInput(genderOptions[0]);
                    }
                    let errorUp = errors;
                    delete errorUp["sexo"];
                    setErrors(errorUp);
                  }}
                  sx={{ width: "220px" }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label="Género"
                      error={!!errors.sexo}
                      helperText={errors.sexo}
                      required
                    />
                  )}
                />
              )}
            </Grid>
            <Grid item>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={enGB}
              >
                <DesktopDatePicker
                  label="Fecha de nacimiento"
                  value={birthDateInput}
                  maxDate={addYears(new Date(), -18)}
                  onChange={(newValue) => {
                    setBirthDateInput(newValue);
                    let errorUp = errors;
                    delete errorUp["fNacimiento"];
                    setErrors(errorUp);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ maxWidth: "220px" }}
                      error={!!errors.fNacimiento}
                      helperText={errors.fNacimiento}
                      required
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={enGB}
              >
                <DesktopDatePicker
                  label="Fecha de afiliación"
                  value={joinDateInput}
                  maxDate={new Date()}
                  onChange={(newValue) => {
                    setJoinDateInput(newValue);
                    let errorUp = errors;
                    delete errorUp["fAfiliacion"];
                    setErrors(errorUp);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ maxWidth: "220px" }}
                      error={!!errors.fAfiliacion}
                      helperText={errors.fAfiliacion}
                      required
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          {/*------------------------------TERCERA FILA-------------------------------*/}
          <Grid item container justifyContent={"space-between"}>
            <Grid item>
              <TextField
                type={"text"}
                label="Teléfono Celular"
                variant="outlined"
                value={celPhoneInput}
                onInput={handleOnlyNumbersInput}
                onChange={(event) => {
                  setCelPhoneInput(event.target.value);
                  let errorUp = errors;
                  delete errorUp["celular"];
                  setErrors(errorUp);
                }}
                required
                error={!!errors.celular}
                helperText={errors.celular}
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            <Grid item>
              <TextField
                type={"text"}
                label="Teléfono Otro"
                variant="outlined"
                value={otherPhoneInput}
                onInput={handleOnlyNumbersInput}
                onChange={(event) => {
                  setOtherPhoneInput(event.target.value);
                  let errorUp = errors;
                  delete errorUp["otroTelefono"];
                  setErrors(errorUp);
                }}
                required
                error={!!errors.otroTelefono}
                helperText={errors.otroTelefono}
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            <Grid item>
              {selectedInterestInput && (
                <Autocomplete
                  id="interestCombo"
                  fullWidth
                  options={interestOptions}
                  getOptionLabel={(option) => option.descripcion}
                  value={selectedInterestInput}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setSelectedInterestInput(newValue);
                    } else {
                      setSelectedInterestInput(interestOptions[0]);
                    }
                    let errorUp = errors;
                    delete errorUp["interesId"];
                    setErrors(errorUp);
                  }}
                  sx={{ width: "220px" }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label="Interes"
                      error={!!errors.interesId}
                      helperText={errors.interesId}
                      required
                    />
                  )}
                />
              )}
              {!selectedInterestInput && (
                <Autocomplete
                  id="interestCombo2"
                  fullWidth
                  options={interestOptions}
                  sx={{ width: "220px" }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label="Interes"
                      error={!!errors.interesId}
                      helperText={errors.interesId}
                      required
                    />
                  )}
                />
              )}
            </Grid>
          </Grid>
          {/*------------------------------CUARTA FILA-------------------------------*/}
          <Grid item container>
            <Grid item xs>
              <TextField
                fullWidth
                type={"text"}
                label="Dirección"
                variant="outlined"
                value={addressInput}
                onChange={(event) => {
                  setAddressInput(event.target.value);
                  let errorUp = errors;
                  delete errorUp["direccion"];
                  setErrors(errorUp);
                }}
                required
                error={!!errors.direccion}
                helperText={errors.direccion}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
          </Grid>
          {/*------------------------------QUINTA FILA-------------------------------*/}
          <Grid item container>
            <Grid item xs>
              <TextField
                fullWidth
                type={"text"}
                label="Reseña"
                variant="outlined"
                value={reviewInput}
                onChange={(event) => {
                  setReviewInput(event.target.value);
                  let errorUp = errors;
                  delete errorUp["resennaPersonal"];
                  setErrors(errorUp);
                }}
                required
                error={!!errors.resennaPersonal}
                helperText={errors.resennaPersonal}
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

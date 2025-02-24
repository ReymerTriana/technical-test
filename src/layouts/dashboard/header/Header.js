import PropTypes from "prop-types";
// @mui
import {
  Alert,
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// utils
import { bgBlur } from "../../../core/utils/cssStyles";
// components
import { mdiLogin } from "@mdi/js";
import Icon from "@mdi/react";
import { useConfirm } from "material-ui-confirm";
import { useHistory, useLocation } from "react-router-dom";
import { UseAuthContext } from "src/modules/auth/context/AuthProvider";
import Iconify from "../../../core/iconify";
import palette from "src/core/theme/palette";
//

// ----------------------------------------------------------------------

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 55;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.primary.dark }),
  borderStyle: "none none solid none",
  borderColor: theme.palette.primary.dark,
  boxShadow: "none",
  [theme.breakpoints.up("lg")]: {
    width: "100%",
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const { auth, setAuth } = UseAuthContext();
  const confirm = useConfirm();
  const location = useLocation();
  const history = useHistory();

  const handleCloseSession = () => {
    confirm({
      content: (
        <Alert severity={"warning"}>
          {"¡Perderá los cambios no guardados! ¿Desea continuar?"}
        </Alert>
      ),
    })
      .then(() => {
        history.push("/login", { state: { from: location }, replace: true });
        setAuth({});
        localStorage.removeItem("username");
        localStorage.removeItem("rol");
        localStorage.removeItem("name");
        localStorage.removeItem("accessToken");
      })
      .catch(() => {});
  };

  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: "text.primary",
            display: { lg: "none" },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Grid
          container
          sx={{ flexGrow: 1 }}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item>
            <Typography
              variant="h4"
              textAlign={"left"}
              sx={{ color: palette.text.primary }}
            >
              COMPAÑÍA PRUEBA
            </Typography>
          </Grid>

          <Grid item display={"flex"}>
            <Grid item sx={{ pr: "10px", pt: "5px" }}>
              <Typography
                variant="h4"
                textAlign={"right"}
                sx={{ color: palette.text.primary }}
              >
                {auth.username}
              </Typography>
            </Grid>
            <Grid item sx={{ pt: "4px" }}>
              <IconButton color={"inherit"} onClick={handleCloseSession}>
                <Icon size={1.2} path={mdiLogin} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </StyledToolbar>
    </StyledRoot>
  );
}

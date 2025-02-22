import { mdiAccountCircleOutline, mdiLogout } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useConfirm } from "material-ui-confirm";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation, withRouter } from "react-router-dom";
// @mui
import {
  Alert,
  Box,
  Drawer,
  Link,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
// hooks
import useResponsive from "../../../core/hooks/useResponsive";
// components
import NavSection from "../../../core/nav-section";
import Scrollbar from "../../../core/scrollbar";
import { UseAuthContext } from "../../../modules/auth/context/AuthProvider";
//
import palette from "src/core/theme/palette";
import navConfig from "./config";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_DESKTOP = 59;

const StyledAccount = styled("div")(({ theme }) => ({
  display: "block",
  textAlign: "center",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

function Nav({ openNav, onCloseNav, history }) {
  const { pathname } = useLocation();
  const { auth } = UseAuthContext();
  const isDesktop = useResponsive("up", "lg");
  const location = useLocation();

  const { setAuth } = UseAuthContext();
  const confirm = useConfirm();

  const [openSessionMenu, setOpenSessionMenu] = useState(null);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenSessionMenu = (event) => {
    setOpenSessionMenu(event.currentTarget);
  };

  const handleCloseSessionMenu = () => {
    setOpenSessionMenu(null);
  };

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

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ mt: `${HEADER_DESKTOP}px`, mx: 2.5, cursor: "pointer" }}>
        <Link underline="none">
          <StyledAccount onClick={(event) => handleOpenSessionMenu(event)}>
            <Icon size={3.5} path={mdiAccountCircleOutline} />

            <Typography variant="h4" sx={{ color: palette.primary.dark }}>
              {auth.name}
            </Typography>
          </StyledAccount>
        </Link>
      </Box>
      '
      <Box
        sx={{
          mt: "20px",
          textAlign: "center",
          borderColor: "lightgray",
          borderStyle: " double none double none",
          borderWidth: "1px",
        }}
      >
        <Typography variant="h4" sx={{ color: palette.primary.dark, p: 1 }}>
          MENÚ
        </Typography>
      </Box>
      <NavSection data={navConfig()} onSubmenuItemClicked={() => {}} />
    </Scrollbar>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{
          marginTop: `${HEADER_DESKTOP}px`,
          flexShrink: { lg: 0 },
          width: { lg: NAV_WIDTH },
        }}
      >
        {isDesktop ? (
          <Drawer
            open
            variant="permanent"
            PaperProps={{
              sx: {
                marginTop: `${HEADER_DESKTOP}px`,
                width: NAV_WIDTH,
                bgcolor: "#F4F6F8",
                borderRightStyle: "double",
              },
            }}
          >
            {renderContent}
          </Drawer>
        ) : (
          <Drawer
            open={openNav}
            onClose={onCloseNav}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              sx: { width: NAV_WIDTH, marginTop: `${HEADER_DESKTOP}px` },
            }}
          >
            {renderContent}
          </Drawer>
        )}
      </Box>

      <Popover
        open={Boolean(openSessionMenu)}
        anchorEl={openSessionMenu}
        onClose={handleCloseSessionMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 180,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleCloseSession} sx={{ color: "error.main" }}>
          <Icon size={1} path={mdiLogout} />
          <span style={{ marginLeft: 15 }}>Cerrar sesión</span>
        </MenuItem>
      </Popover>
    </>
  );
}

export default withRouter(Nav);

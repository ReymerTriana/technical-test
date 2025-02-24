import { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import { UseAuthContext } from "../../modules/auth/context/AuthProvider";
//
import ClientsPage from "src/modules/clients/components/ClientsPage";
import HomePage from "src/modules/home/app/components/HomePage";
import Header from "./header/Header";
import Nav from "./nav/Nav";
import { isEmpty } from "lodash";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    // paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { auth } = UseAuthContext();
  const [goDashboard] = useState(
    !isEmpty(localStorage.getItem("username"))
      ? true
      : !isEmpty(auth.username)
      ? true
      : false
  );
  const history = useHistory();

  useEffect(() => {}, []);

  useEffect(() => {
    console.log("EL USERNAME EN EL DASH", auth.username);
    console.log("goDashboard", goDashboard);
    if (!goDashboard) {
      history.push("/login");
    }
  }, [auth, goDashboard, history]);

  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />
      <Nav openNav={open} onCloseNav={() => setOpen(false)} />
      <Main>
        <Switch>
          <Route exact path="/dashboard" component={HomePage} />
          <Route exact path="/dashboard/clients" component={ClientsPage} />
        </Switch>
      </Main>
    </StyledRoot>
  );
}

import { Redirect, Route, Switch } from "react-router-dom";
// layouts
import DashboardLayout from "../layouts/dashboard";

import Page404 from "src/layouts/404/Page404";
import LoginPage from "src/modules/auth/components/LoginPage";
import SignUpPage from "src/modules/auth/components/SignUpPage";
import ClientsPage from "src/modules/clients/components/ClientsPage";
import HomePage from "../modules/home/app/components/HomePage";

// ----------------------------------------------------------------------

export default function AppRouter() {
  return (
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" component={SignUpPage} />
      <Route path="/dashboard">
        <DashboardLayout>
          <Switch>
            <Route exact path="/dashboard" component={HomePage} />
            <Route exact path="/dashboard/clients" component={ClientsPage} />
          </Switch>
        </DashboardLayout>
      </Route>
      <Route exact path="/404" component={Page404} />
      <Redirect exact from="/" to="/dashboard" />
      <Redirect from="*" to="/404" />
    </Switch>
  );
}

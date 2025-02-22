import { AppBar, Typography } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import MainToastContainer from "./core/messages/MainToastContainer";
// routes
import AppRouter from "./core/routes";
// theme
import ThemeProvider from "./core/theme";
// components
import ScrollToTop from "./core/scroll-to-top";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ConfirmProvider
            defaultOptions={{
              confirmationText: "Sí",
              cancellationText: "No",
              cancellationButtonProps: {
                // autoFocus: true,
                variant: "contained",
                color: "inherit",
                sx: { minWidth: 100 },
              },
              confirmationButtonProps: {
                variant: "contained",
                color: "primary",
                sx: { minWidth: 100 },
                autoFocus: true,
              },
              titleProps: {
                style: { margin: "5px", padding: 0, marginBottom: "30px" },
              },
              title: (
                <AppBar
                  sx={{
                    position: "relative",
                    px: 3,
                    borderRadius: 1,
                    height: "40px",
                  }}
                >
                  <Typography variant="h5" sx={{ marginTop: "4px" }}>
                    Confirmar
                  </Typography>
                </AppBar>
              ),
            }}
          >
            <ScrollToTop />

            <AppRouter />
          </ConfirmProvider>
        </ThemeProvider>
      </BrowserRouter>
      <MainToastContainer />
    </HelmetProvider>
  );
}

export default App;

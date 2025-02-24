import { Helmet } from "react-helmet-async";
// @mui
import { Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
// hooks
// components
// sections
import SignUpForm from "./SignUpForm";

// ----------------------------------------------------------------------

const StyledRoot = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function SignUpPage() {
  return (
    <>
      <Helmet>
        <title> SignUp | REY-TECHTEST </title>
      </Helmet>

      <StyledRoot>
        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom align="center">
              Registro
            </Typography>

            <SignUpForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}

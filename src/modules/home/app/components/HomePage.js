import { Container, Typography } from "@mui/material";
// @mui
import { Helmet } from "react-helmet-async";
// sections

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | SAPCE </title>
      </Helmet>

      <Container
        maxWidth="100%"
        sx={{
          marginTop: "100px",
          textAlign: "center",
        }}
      >
        <Typography variant="h1" fontFamily={"monospace"}>
          BIENVENIDO
        </Typography>
      </Container>
    </>
  );
}

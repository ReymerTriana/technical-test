import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
// @mui
import { Box, Link } from "@mui/material";
import { UseAuthContext } from "../../modules/auth/context/AuthProvider";

import logoImage from "./logo-cujae.png";

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx }) => {
  const { auth } = UseAuthContext();

  const logo = (
    <Box
      component="img"
      src={logoImage}
      sx={{
        width: 60,
        height: 60,
        cursor: "pointer",
        display: "inline-flex",
        ...sx,
      }}
    />
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link
      to={auth.username ? "/dashboard" : "/"}
      component={RouterLink}
      sx={{ display: "contents" }}
    >
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;

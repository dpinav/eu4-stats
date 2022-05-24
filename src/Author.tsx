import * as React from "react";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";

export default function Author() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Made by "}
      <MuiLink color="inherit" href="https://github.com/dpinav">
        dpv
      </MuiLink>
    </Typography>
  );
}

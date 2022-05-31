import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useLocalStorage } from "../util/hooks/useLocalStorage";

const LogoSelect = () => {
  const [selectedLogo, setSelectedLogo] = useLocalStorage(
    "selected_logo",
    "logoEstrategas.png"
  );

  return (
    <FormControl sx={{ m: 1, minWidth: 80 }}>
      <InputLabel id="logo-select-label">Logo</InputLabel>
      <Select
        labelId="logo-select-label"
        id="logo-select"
        value={selectedLogo}
        onChange={(e) => setSelectedLogo(e.target.value)}
        autoWidth
        label="Logo"
      >
        <MenuItem value="logoEstrategas.png">Estrategas</MenuItem>
        <MenuItem value="logoFC.png">FC</MenuItem>
      </Select>
      <FormHelperText>{"Select Logo"}</FormHelperText>
    </FormControl>
  );
};

export default LogoSelect;

import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";

type SkanSaveSelectProps = {
  selectedSave: string;
  allSaves: [];
  isCurrentSave: boolean;
  handleSaveSelect: (saveData: SelectChangeEvent<string>) => void;
};

const SkanSaveSelect = ({
  selectedSave,
  allSaves = [],
  isCurrentSave = false,
  handleSaveSelect,
}: SkanSaveSelectProps) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 80 }}>
      <InputLabel
        id={
          isCurrentSave ? "save-current-select-label" : "save-last-select-label"
        }
      >
        {isCurrentSave ? "Current" : "Last"} Save
      </InputLabel>
      <Select
        labelId={
          isCurrentSave ? "save-current-select-label" : "save-last-select-label"
        }
        id={isCurrentSave ? "save-current-select" : "save-last-select"}
        value={
          allSaves.find((save: any) => save.hash === selectedSave)
            ? selectedSave
            : ""
        }
        onChange={handleSaveSelect}
        autoWidth
        label={isCurrentSave ? "Current Save" : "Last Save"}
      >
        <MenuItem value="">None</MenuItem>
        {allSaves.map((save: any) => (
          <MenuItem key={save.id} value={save.hash}>
            {save.name}
          </MenuItem>
        ))}
        ;
      </Select>
      <FormHelperText>
        {isCurrentSave
          ? "Load current session's save"
          : "Load last session's save"}
      </FormHelperText>
    </FormControl>
  );
};

export default SkanSaveSelect;

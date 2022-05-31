import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useLocalStorage } from "../util/hooks/useLocalStorage";
import { Box } from "@mui/material";

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
  const [saveYear, setSaveYear] = useLocalStorage("save_year", "1444");

  const handleChange = (event: SelectChangeEvent<string>) => {
    handleSaveSelect(event);
    const save: any = allSaves.find(
      (save: any) => save.hash === event.target.value
    );
    if (save && isCurrentSave) setSaveYear(save.date.split(".")[0]);
  };

  return (
    <Box>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel
          id={
            isCurrentSave
              ? "save-current-select-label"
              : "save-last-select-label"
          }
        >
          {isCurrentSave ? "Current" : "Last"} Save
        </InputLabel>
        <Select
          labelId={
            isCurrentSave
              ? "save-current-select-label"
              : "save-last-select-label"
          }
          id={isCurrentSave ? "save-current-select" : "save-last-select"}
          value={
            allSaves.find((save: any) => save.hash === selectedSave)
              ? selectedSave
              : ""
          }
          onChange={handleChange}
          autoWidth
          label={isCurrentSave ? "Current Save" : "Last Save"}
        >
          <MenuItem value="">None</MenuItem>
          {allSaves.map((save: any) => (
            <MenuItem key={save.id} value={save.hash}>
              {save.customname || save.name}
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
    </Box>
  );
};

export default SkanSaveSelect;

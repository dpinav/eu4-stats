import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  FilledInput,
  useFormControl,
  FormHelperText,
  Box,
} from "@mui/material";

type SkanApiKeyInputProps = {
  apiKey: string;
  error: string;
  onApiKeyChange: (apiKey: React.ChangeEvent<HTMLInputElement>) => void;
};

const SkanApiKeyInput = ({
  apiKey,
  error,
  onApiKeyChange,
}: SkanApiKeyInputProps) => {
  return (
    <Box>
      <FormControl sx={{ m: 1, width: 310 }} variant="filled">
        <InputLabel htmlFor="skan-api-key">API Key</InputLabel>
        <FilledInput
          id="skan-api-key"
          value={apiKey}
          error={error !== ""}
          onChange={onApiKeyChange}
        />
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default SkanApiKeyInput;

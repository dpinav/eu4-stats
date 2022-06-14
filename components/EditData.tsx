import * as React from "react";
import Card from "@mui/material/Card";
import ICountryData from "../util/interfaces/ICountryData";
import Box from "@mui/material/Box";
import { Backdrop, Button, CardMedia, IconButton, TextField, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const EditData = (props: {
  currentCountriesData: ICountryData[];
  lastCountriesData: ICountryData[];
  isEditing: boolean;
  saveEditedCurrentData: (currentCountriesData: ICountryData[]) => void;
  setIsEditing: (isEditing: boolean) => any;
}) => {
  const {
    currentCountriesData,
    lastCountriesData,
    isEditing,
    saveEditedCurrentData,
    setIsEditing,
  } = props;

  const [editableCountriesData, setEditableCountriesData] = React.useState<ICountryData[]>([
    ...currentCountriesData,
  ]);

  React.useEffect(() => {
    setEditableCountriesData([...currentCountriesData]);
  }, [currentCountriesData]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    param: string,
    index: number
  ) => {
    (editableCountriesData[index][param as keyof ICountryData] as string) = event.target.value;
    setEditableCountriesData([...editableCountriesData]);
  };

  const handleRemoveCountry = (index: number) => {
    editableCountriesData.splice(index, 1);
    setEditableCountriesData([...editableCountriesData]);
  };

  const handleSave = () => {
    saveEditedCurrentData([...editableCountriesData]);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableCountriesData([...currentCountriesData]);
    setIsEditing(false);
  };

  return (
    <Backdrop open={isEditing}>
      <Box>
        <Card
          sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 5 }}
        >
          {editableCountriesData.map((countryData, index) => {
            return (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <CardMedia
                  sx={{ mr: 4, mt: 2, width: 28, height: 24 }}
                  image={countryData.flag}
                  alt={countryData.name ?? "Flag"}
                />
                <TextField
                  id={`text-country-${countryData.name}`}
                  label="Country"
                  variant="standard"
                  value={countryData.name}
                  onChange={(e) => handleChange(e, "name", index)}
                />
                <TextField
                  id={`text-player-${countryData.player}`}
                  label="Player"
                  variant="standard"
                  value={countryData.player}
                  onChange={(e) => handleChange(e, "player", index)}
                />
                <TextField
                  id={`text-tag-${countryData.tag}`}
                  label="Last Tag"
                  variant="standard"
                  value={countryData.tag}
                  onChange={(e) => handleChange(e, "tag", index)}
                />
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="Remove Country"
                  onClick={() => handleRemoveCountry(index)}
                  sx={{ ml: 1 }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Box>
            );
          })}
          <Box sx={{ display: "flex", mt: 4 }}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button variant="contained" onClick={handleCancel} sx={{ ml: 2 }}>
              Cancel
            </Button>
          </Box>
        </Card>
      </Box>
    </Backdrop>
  );
};

export default EditData;

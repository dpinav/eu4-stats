import * as React from "react";
import Card from "@mui/material/Card";
import ICountryData from "../util/interfaces/ICountryData";
import Box from "@mui/material/Box";
import { Backdrop, Button, CardMedia, IconButton, TextField, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { CountriesDataContext } from "../pages/stats";

const EditData = (props: { isEditing: boolean; setIsEditing: (isEditing: boolean) => any }) => {
  const { isEditing, setIsEditing } = props;
  const [currentCountriesData, setCurrentCountriesData, lastCountriesData, setLastCountriesData] =
    React.useContext(CountriesDataContext);

  const [editableCountriesData, setEditableCountriesData] = React.useState<ICountryData[]>([]);
  const [removedCountryTags, setRemovedCountryTags] = React.useState<string[]>([]);

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
    setRemovedCountryTags([...removedCountryTags, editableCountriesData[index].tag]);
    editableCountriesData.splice(index, 1);
    setEditableCountriesData([...editableCountriesData]);
  };

  const handleSave = () => {
    setCurrentCountriesData([...editableCountriesData]);
    setLastCountriesData([
      ...lastCountriesData.filter(
        (country: ICountryData) => !removedCountryTags.includes(country.tag)
      ),
    ]);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableCountriesData([...currentCountriesData]);
    setIsEditing(false);
  };

  return (
    <Backdrop open={isEditing}>
      <Box sx={{ maxHeight: 0.8, overflow: "auto" }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "auto",
            height: "auto",
            padding: 5,
          }}
        >
          {editableCountriesData.map((countryData, index) => {
            return (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <CardMedia
                  component="img"
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

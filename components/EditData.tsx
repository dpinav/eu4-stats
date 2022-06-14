import * as React from "react";
import Card from "@mui/material/Card";
import ICountryData from "../util/interfaces/ICountryData";
import Box from "@mui/material/Box";
import { Backdrop, CardMedia, TextField, Typography } from "@mui/material";

const EditData = (props: {
  currentCountriesData: ICountryData[];
  lastCountriesData: ICountryData[];
  isEditing: Boolean;
}) => {
  const { currentCountriesData, lastCountriesData, isEditing } = props;

  return (
    <Backdrop open={isEditing}>
      <Box>
        <Card
          sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 5 }}
        >
          {currentCountriesData.map((countryData, index) => {
            return (
              <Box key={countryData.tag} sx={{ display: "flex", alignItems: "center" }}>
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
                  onChange={(e) => (countryData.name = e.target.value)}
                />
                <TextField
                  id={`text-player-${countryData.player}`}
                  label="Player"
                  variant="standard"
                  value={countryData.player}
                  onChange={(e) => (countryData.player = e.target.value)}
                />
                <TextField
                  id={`text-tag-${countryData.tag}`}
                  label="Last Tag"
                  variant="standard"
                  value={countryData.tag}
                  onChange={(e) => (countryData.tag = e.target.value)}
                />
              </Box>
            );
          })}
        </Card>
      </Box>
    </Backdrop>
  );
};

export default EditData;

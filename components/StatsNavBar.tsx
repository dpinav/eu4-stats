import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import ICountryData from "../util/interfaces/ICountryData";
import Link from "../components/Link";
import EditData from "./EditData";

const StatsNavBar = (props: {
  currentCountriesData: ICountryData[];
  lastCountriesData: ICountryData[];
  downloadImages: () => Promise<void>;
}) => {
  const { currentCountriesData, lastCountriesData, downloadImages } = props;
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Box sx={{ display: "flex", flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              Stats
            </Typography>
            <Button color="inherit" component={Link} href="/" sx={{ ml: 5 }}>
              Home
            </Button>
          </Box>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="Edit Stats"
            onClick={() => setIsEditing(!isEditing)}
            sx={{ mr: 2 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="Download As Images"
            onClick={downloadImages}
            sx={{ mr: 2 }}
          >
            <DownloadIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <EditData
        currentCountriesData={currentCountriesData}
        lastCountriesData={lastCountriesData}
        isEditing={isEditing}
      />
    </Box>
  );
};

export default StatsNavBar;

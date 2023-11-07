import * as React from "react";
import Card from "@mui/material/Card";
import ICountryData from "../util/interfaces/ICountryData";
import Box from "@mui/material/Box";
import {
  Alert,
  Backdrop,
  Button,
  CardMedia,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
import { CountriesDataContext } from "../pages/stats";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

const EditData = (props: { isEditing: boolean; setIsEditing: (isEditing: boolean) => any }) => {
  const { isEditing, setIsEditing } = props;
  const [currentCountriesData, setCurrentCountriesData, lastCountriesData, setLastCountriesData] =
    React.useContext(CountriesDataContext);
  const [editableCurrentCountriesData, setEditableCurrentCountriesData] = React.useState<
    ICountryData[]
  >([]);
  const [editableLastCountriesData, setEditableLastCountriesData] = React.useState<ICountryData[]>(
    []
  );
  const [removedCountryTags, setRemovedCountryTags] = React.useState<string[]>([]);
  const [selectedStatisticToEdit, setSelectedStatisticToEdit] =
    React.useState<string>("Remove tag");
  const [errorDescription, setErrorDescription] = React.useState<string>("");
  const countryDataKeys: string[] = Object.keys(currentCountriesData[0] || {});

  React.useEffect(() => {
    setEditableCurrentCountriesData([...currentCountriesData]);
    setEditableLastCountriesData([...lastCountriesData]);
  }, [currentCountriesData, lastCountriesData]);

  const handleChangeCurrentData = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    param: string,
    index: number
  ) => {
    if (param === "tag") {
      const lastIndex = editableLastCountriesData.findIndex(
        (e: ICountryData) =>
          e.player !== "undefined..." && e.player === editableCurrentCountriesData[index].player
      );
      if (lastIndex < 0) {
        const error = `Cannot change the CURRENT TAG. There is no other country with the same player name in both saves.
        Please, change the player name first so it matches in both saves.`;
        setErrorDescription(error);
        return;
      }
    }

    (editableCurrentCountriesData[index][param as keyof ICountryData] as string) =
      event.target.value;
    setEditableCurrentCountriesData([...editableCurrentCountriesData]);
  };

  const handleChangeLastData = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    param: string,
    index: number
  ) => {
    if (index < 0) return;
    if (param === "tag") {
      const currentIndex = editableCurrentCountriesData.findIndex(
        (e: ICountryData) =>
          e.player !== "undefined..." && e.player === editableLastCountriesData[index].player
      );
      if (currentIndex < 0) {
        const error = `Cannot change the LAST TAG. There is no other country with the same player name in both saves.
        Please, change the player name first so it matches in both saves.`;
        setErrorDescription(error);
        return;
      }
    }

    (editableLastCountriesData[index][param as keyof ICountryData] as string) = event.target.value;
    setEditableLastCountriesData([...editableLastCountriesData]);
  };

  const handleRemoveCountry = (index: number, lastIndex: number) => {
    editableCurrentCountriesData.splice(index, 1);
    if (lastIndex >= 0) {
      editableLastCountriesData.splice(lastIndex, 1);
    }
    setEditableCurrentCountriesData([...editableCurrentCountriesData]);
    setEditableLastCountriesData([...editableLastCountriesData]);
  };

  const handleSave = () => {
    setCurrentCountriesData([...editableCurrentCountriesData]);
    setLastCountriesData([...editableLastCountriesData]);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableCurrentCountriesData([...currentCountriesData]);
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
            minWidth: 700,
            padding: 5,
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="select-statistic-to-edit-label">Statistic to edit</InputLabel>
            <Select
              labelId="select-statistic-to-edit-label"
              id="select-statistic-to-edit"
              value={selectedStatisticToEdit}
              label="Statistic to edit"
              onChange={(e) => setSelectedStatisticToEdit(e.target.value as string)}
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="Remove tag">
                <em>Remove tag</em>
              </MenuItem>
              {countryDataKeys.map((key: string) => {
                return (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <TableContainer
            component={Paper}
            sx={{
              marginTop: 2,
              marginBottom: 2,
              boxShadow: "0px 0px 20px 4px black",
              width: "auto",
              height: "auto",
              minWidth: 650,
              overflow: "visible",
            }}
          >
            <Table sx={{ minWidth: 600 }} aria-label="customized table" size="small">
              <TableHead sx={{ marginTop: 5 }}>
                <TableRow>
                  <TableCell sx={{ paddingLeft: 5, width: 0.02 }}>TAG</TableCell>
                  {selectedStatisticToEdit !== "Remove tag" && (
                    <>
                      <TableCell align="center">CURRENT SAVE VALUE</TableCell>
                      <TableCell align="center">LAST SAVE VALUE</TableCell>
                    </>
                  )}
                  {selectedStatisticToEdit === "Remove tag" && (
                    <>
                      <TableCell align="center">COUNTRY</TableCell>
                      <TableCell align="center">PLAYER</TableCell>
                      <TableCell align="center">REMOVE COUNTRY</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {editableCurrentCountriesData.map((countryData, index) => {
                  const lastIndex = editableLastCountriesData.findIndex(
                    (e: ICountryData) =>
                      e.tag === countryData.tag ||
                      (e.player !== "undefined..." && e.player === countryData.player)
                  );
                  return (
                    <TableRow key={countryData.tag}>
                      <TableCell align="center" sx={{ paddingLeft: 1 }}>
                        <Card
                          elevation={0}
                          square={true}
                          sx={{
                            display: "flex",
                            backgroundColor: "transparent",
                            alignItems: "center",
                            height: 20,
                          }}
                        >
                          <CardMedia
                            component="img"
                            sx={{
                              marginRight: 1,
                              width: 24,
                              height: 20,
                            }}
                            src={"/images/flags/" + countryData.flag}
                            alt={countryData.tag}
                          />
                          <Typography>{countryData.tag}</Typography>
                        </Card>
                      </TableCell>
                      {selectedStatisticToEdit !== "Remove tag" && (
                        <>
                          <TableCell align="center">
                            <TextField
                              id={`text-current-value-${index}`}
                              variant="standard"
                              value={countryData[selectedStatisticToEdit as keyof ICountryData]}
                              onChange={(e) =>
                                handleChangeCurrentData(e, selectedStatisticToEdit, index)
                              }
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              id={`text-last-value-${index}`}
                              variant="standard"
                              value={
                                lastIndex >= 0
                                  ? editableLastCountriesData[lastIndex][
                                      selectedStatisticToEdit as keyof ICountryData
                                    ]
                                  : ""
                              }
                              onChange={(e) =>
                                handleChangeLastData(e, selectedStatisticToEdit, lastIndex)
                              }
                            />
                          </TableCell>
                        </>
                      )}
                      {selectedStatisticToEdit === "Remove tag" && (
                        <>
                          <TableCell align="center">
                            <Typography>{countryData.name}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography>{countryData.player}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="large"
                              edge="start"
                              color="inherit"
                              aria-label="Remove Country"
                              onClick={() => handleRemoveCountry(index, lastIndex)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Collapse in={errorDescription !== ""}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setErrorDescription("");
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              severity="error"
            >
              {errorDescription}
            </Alert>
          </Collapse>

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

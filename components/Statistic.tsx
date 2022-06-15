import * as React from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { green, blue, red, yellow, orange } from "@mui/material/colors";
import {
  autocompleteClasses,
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useLocalStorage } from "../util/hooks/useLocalStorage";
import ICountryData from "../util/interfaces/ICountryData";
import IModifier from "../util/interfaces/IModifier";
import { toPng } from "html-to-image";

const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }: any) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TypographyCell = styled(Typography)(({ theme }: any) => ({
  fontWeight: "bold",
}));

const StatCard = styled(Card)(({ theme }: any) => ({
  backgroundImage: `url(${"/images/backgroundStat.png"})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundColor: "none",
  width: "auto",
  height: "auto",
  overflow: "visible",
  paddingLeft: 28,
  paddingRight: 28,
  paddingBottom: 1,
}));
const Statistic = (props: {
  modifier: IModifier;
  currentCountriesData: ICountryData[];
  lastCountriesData: ICountryData[];
}) => {
  const { modifier, currentCountriesData, lastCountriesData } = props;
  const [saveYear, setSaveYear] = useLocalStorage("save_year", "1444");
  const [selectedLogo, setSelectedLogo] = useLocalStorage("selected_logo", "logoEstrategas.png");

  const [sortedCurrentCountriesData, setSortedCurrentCountriesData] = React.useState<
    ICountryData[]
  >([]);
  const [sortedLastCountriesData, setSortedLastCountriesData] = React.useState<ICountryData[]>([]);
  const printRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setSortedCurrentCountriesData([
      ...currentCountriesData.sort((a: ICountryData, b: ICountryData) => {
        return (
          (b[modifier.parameter as keyof ICountryData] as number) -
          (a[modifier.parameter as keyof ICountryData] as number)
        );
      }),
    ]);

    setSortedLastCountriesData([
      ...lastCountriesData.sort((a: ICountryData, b: ICountryData) => {
        return (
          (b[modifier.parameter as keyof ICountryData] as number) -
          (a[modifier.parameter as keyof ICountryData] as number)
        );
      }),
    ]);
  }, [currentCountriesData, lastCountriesData]);

  const onButtonClick = React.useCallback(() => {
    if (printRef.current === null) {
      return;
    }

    toPng(printRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [printRef]);

  return (
    <>
      <Box ref={printRef} sx={{ overflow: "visible", width: "auto", height: "auto" }}>
        <StatCard elevation={6} square={true}>
          <Box sx={{ display: "flex", paddingTop: 1 }}>
            <CardMedia
              component="img"
              sx={{
                marginRight: 1,
                width: 140,
                height: 140,
              }}
              image={"/images/" + selectedLogo}
              alt="FC Logo"
            />
            <Box display="flex" flexDirection="column" m={4}>
              <Box display="flex">
                <Typography
                  variant="h4"
                  fontFamily={"Trajan Pro"}
                  fontWeight={"bold"}
                  mr={2}
                  sx={{
                    textShadow: "1.5px 1.5px 1.5px black",
                  }}
                >
                  AÑO
                </Typography>
                <Typography
                  variant="h4"
                  fontFamily={"Trajan Pro"}
                  fontWeight={"bold"}
                  sx={{
                    color: orange[300],
                    textShadow: "1.5px 1.5px 1.5px black",
                  }}
                >
                  {saveYear}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  component="h5"
                  gutterBottom
                  fontFamily={"Trajan Pro"}
                  fontStyle={"italic"}
                  fontWeight={"bold"}
                  sx={{
                    color: orange[300],
                    textAlign: "left",
                    textShadow: "1.5px 1.5px 1.5px black",
                  }}
                >
                  {modifier.name.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </Box>
          <TableContainer
            component={Paper}
            sx={{ marginBottom: 10, boxShadow: "0 0 20px 4px black" }}
          >
            <Table sx={{ minWidth: 600 }} aria-label="customized table" padding="none">
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ paddingLeft: 2, width: 0.02 }}>#</StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: 0.06 }}>
                    T
                  </StyledTableCell>
                  <StyledTableCell>PAÍS</StyledTableCell>
                  <StyledTableCell>PLAYER</StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: 0.15 }}>
                    VALOR
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: 0.15 }}>
                    CAMBIO
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: 0.1 }}>
                    %
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedCurrentCountriesData.map((countryData, index) => {
                  const lastIndex: number = sortedLastCountriesData.findIndex(
                    (e: ICountryData) =>
                      e.tag === countryData.tag ||
                      (e.player !== "undefined..." && e.player == countryData.player)
                  );
                  const value: number = countryData[
                    modifier.parameter as keyof ICountryData
                  ] as number;
                  let lastValue: number = value;
                  if (lastIndex >= 0) {
                    lastValue = sortedLastCountriesData[lastIndex][
                      modifier.parameter as keyof ICountryData
                    ] as number;
                  }
                  if (lastValue === 0) lastValue = value;
                  const change: number = value - lastValue;
                  const percentage: number = (change / lastValue) * 100;
                  return (
                    <StyledTableRow key={countryData.tag}>
                      <StyledTableCell sx={{ paddingLeft: 2 }}>{index + 1}</StyledTableCell>
                      <StyledTableCell align="center">
                        {getTendencyIcon(index, lastIndex)}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
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
                            image={countryData.flag}
                            alt="Flag"
                          />
                          <Typography>{countryData.name}</Typography>
                        </Card>
                      </StyledTableCell>
                      <StyledTableCell>
                        <TypographyCell>{countryData.player}</TypographyCell>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <TypographyCell>{value ?? 0}</TypographyCell>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Typography>
                          {change >= 0 ? "+" : ""}
                          {isFloat(change) ? change.toFixed(2) : change}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{
                          backgroundColor: getPercentageColor(percentage),
                        }}
                      >
                        <TypographyCell>
                          {percentage > 0 ? "+" + percentage.toFixed(0) : percentage.toFixed(0)}
                          {"%"}
                        </TypographyCell>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </StatCard>
      </Box>
      <button onClick={onButtonClick}>Download</button>
    </>
  );
};

export default Statistic;

function getTendencyIcon(currentIndex: number, lastIndex: number) {
  if (currentIndex < lastIndex) {
    return <ArrowDropUpRoundedIcon fontSize="large" sx={{ color: green[600], marginTop: "5px" }} />;
  } else if (currentIndex > lastIndex) {
    return <ArrowDropDownRoundedIcon fontSize="large" sx={{ color: red[600], marginTop: "5px" }} />;
  } else {
    return <ArrowRightRoundedIcon fontSize="large" sx={{ color: blue[600], marginTop: "4px" }} />;
  }
}

function getPercentageColor(percentage: number) {
  if (percentage >= 100) return green[900];
  if (percentage > 90) return green[800];
  if (percentage > 80) return green[700];
  if (percentage > 70) return green[700];
  if (percentage > 60) return green[600];
  if (percentage > 50) return green[500];
  if (percentage > 40) return green[500];
  if (percentage > 30) return green[400];
  if (percentage > 20) return green[300];
  if (percentage > 10) return green[300];
  if (percentage > 0) return green[200];
  if (percentage == 0) return red[300];
  if (percentage <= -100) return red[900];
  if (percentage < -90) return red[900];
  if (percentage < -80) return red[700];
  if (percentage < -70) return red[600];
  if (percentage < -60) return red[600];
  if (percentage < -50) return red[500];
  if (percentage < -40) return red[400];
  if (percentage < -30) return red[300];
  if (percentage < -20) return red[300];
  if (percentage < -10) return red[300];
  if (percentage < 0) return red[300];
}

function isFloat(n: number) {
  return !isNaN(n) && n.toString().indexOf(".") != -1;
  //return Number(n) === n && n % 1 !== 0;
}

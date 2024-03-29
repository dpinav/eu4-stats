import {
  Box,
  Card,
  CardMedia,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { toPng } from "html-to-image";
import * as React from "react";
import { useLocalStorage } from "../util/hooks/useLocalStorage";
import ICountryData from "../util/interfaces/ICountryData";
import IModifier from "../util/interfaces/IModifier";
import StatisticRow from "./StatisticRow";
import { CountriesDataContext } from "../pages/stats";
import { saveAs } from "file-saver";
import { generateTopsCsv } from "../util/factories/csvFactory";

const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StatCard = styled(Card)(({ theme }: any) => ({
  backgroundImage: `url(${"/images/backgroundStat.png"})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundColor: "none",
  paddingLeft: 28,
  paddingRight: 28,
  paddingBottom: 1,
}));
const Statistic = (props: { modifier: IModifier }) => {
  const { modifier } = props;
  const [currentCountriesData, setCurrentCountriesData, lastCountriesData] =
    React.useContext(CountriesDataContext);
  const [saveYear, setSaveYear] = useLocalStorage("save_year", "1444");
  const [selectedLogo, setSelectedLogo] = useLocalStorage("selected_logo", "logoEstrategas.png");

  const sortedCurrentCountriesData = [
    ...currentCountriesData.sort((a: ICountryData, b: ICountryData) => {
      return (
        (b[modifier.parameter as keyof ICountryData] as number) -
        (a[modifier.parameter as keyof ICountryData] as number)
      );
    }),
  ];
  const sortedLastCountriesData = [
    ...lastCountriesData.sort((a: ICountryData, b: ICountryData) => {
      return (
        (b[modifier.parameter as keyof ICountryData] as number) -
        (a[modifier.parameter as keyof ICountryData] as number)
      );
    }),
  ];
  const printRef = React.useRef<HTMLDivElement>(null);

  const onButtonClick = React.useCallback(() => {
    if (printRef.current === null) {
      return;
    }
    toPng(printRef.current, { cacheBust: true })
      .then((dataUrl) => {
        saveAs(dataUrl, `${saveYear}-${modifier.parameter}.png`);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [printRef]);

  const handleDownloadCsv = () => {
    const csvString = generateTopsCsv(sortedCurrentCountriesData, sortedLastCountriesData);
    saveAs(new Blob([csvString]), `${saveYear}-${modifier.parameter}.csv`);
  };

  return (
    <>
      <StatCard ref={printRef} elevation={6} square={true}>
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
                  color: "#ff0072",
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
                  color: "#ff0072",
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
          sx={{
            marginBottom: 10,
            boxShadow: "0 0 20px 4px black",
            width: "auto",
            height: "auto",
            overflow: "visible",
          }}
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
                return (
                  <StatisticRow
                    key={countryData.tag}
                    countryData={countryData}
                    index={index}
                    modifier={modifier}
                    sortedLastCountriesData={sortedLastCountriesData}
                    isTop={isCountryTop(sortedCurrentCountriesData, index, modifier.parameter)}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </StatCard>
      <button onClick={onButtonClick}>Download</button>
      {modifier.parameter == "tops" && <button onClick={handleDownloadCsv}>Download CSV</button>}
    </>
  );
};

export default Statistic;

const isCountryTop = (
  sortedCurrentCountriesData: ICountryData[],
  index: number,
  modParam: string
): boolean => {
  if (modParam !== "tops") return false;
  const numPlayers: number = sortedCurrentCountriesData.length;
  const percentageTop: number = 0.3; // 30% of Countries are Top
  const topCountries: number = Math.ceil(numPlayers * percentageTop);
  return index < topCountries;
};

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
              {sortedCurrentCountriesData.map((countryData, index) => (
                <StatisticRow
                  countryData={countryData}
                  index={index}
                  modifier={modifier}
                  sortedLastCountriesData={sortedLastCountriesData}
                ></StatisticRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StatCard>
      <button onClick={onButtonClick}>Download</button>
    </>
  );
};

export default Statistic;

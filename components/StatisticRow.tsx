import * as React from "react";
import { Card, CardMedia, TableCell, tableCellClasses, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ICountryData from "../util/interfaces/ICountryData";
import IModifier from "../util/interfaces/IModifier";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { green, blue, red } from "@mui/material/colors";
import theme from "./theme";

const StyledTableCell = styled(TableCell)(({ theme }: any) => ({
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

const StatisticRow = (props: {
  countryData: ICountryData;
  index: number;
  modifier: IModifier;
  sortedLastCountriesData: ICountryData[];
  isTop: boolean;
}) => {
  const { countryData, index, modifier, sortedLastCountriesData, isTop } = props;

  const lastIndex: number = sortedLastCountriesData.findIndex(
    (e: ICountryData) =>
      e.tag === countryData.tag || (e.player !== "undefined..." && e.player == countryData.player)
  );
  const value: number = countryData[modifier.parameter as keyof ICountryData] as number;
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
    <StyledTableRow
      key={countryData.tag}
      sx={[
        isTop && {
          "&:nth-of-type(odd)": {
            backgroundColor: red[900],
          },
          "&:nth-of-type(even)": {
            backgroundColor: red[700],
          },
        },
      ]}
    >
      <StyledTableCell sx={{ paddingLeft: 2 }}>{index + 1}</StyledTableCell>
      <StyledTableCell align="center">{getTendencyIcon(index, lastIndex)}</StyledTableCell>
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
            src={"/images/flags/" + countryData.flag}
            alt={countryData.flag}
          />
          <Typography>{countryData.name}</Typography>
        </Card>
      </StyledTableCell>
      <StyledTableCell>
        <TypographyCell>{countryData.player}</TypographyCell>
      </StyledTableCell>
      <StyledTableCell align="center">
        <TypographyCell>
          {isFloat(value)
            ? parseFloat(value.toFixed(2)).toLocaleString("en-US") ?? 0
            : parseInt(value.toString()).toLocaleString("en-US")}
        </TypographyCell>
      </StyledTableCell>
      <StyledTableCell align="center">
        <Typography>
          {change >= 0 ? "+" : ""}
          {isFloat(change)
            ? parseFloat(change.toFixed(2)).toLocaleString("en-US")
            : parseInt(change.toString()).toLocaleString("en-US")}
        </Typography>
      </StyledTableCell>
      <StyledTableCell
        align="center"
        sx={{
          backgroundColor: getPercentageColor(percentage),
        }}
      >
        <TypographyCell>
          {percentage > 0
            ? "+" + parseFloat(percentage.toFixed(0)).toLocaleString("en-US")
            : !isNaN(percentage) && percentage !== Infinity
            ? parseFloat(percentage.toFixed(0)).toLocaleString("en-US")
            : "0"}
          {"%"}
        </TypographyCell>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default StatisticRow;

function getTendencyIcon(currentIndex: number, lastIndex: number) {
  if (currentIndex === lastIndex || lastIndex < 0) {
    return <ArrowRightRoundedIcon fontSize="large" sx={{ color: blue[600], marginTop: "4px" }} />;
  } else if (currentIndex < lastIndex) {
    return <ArrowDropUpRoundedIcon fontSize="large" sx={{ color: green[600], marginTop: "5px" }} />;
  } else {
    return <ArrowDropDownRoundedIcon fontSize="large" sx={{ color: red[600], marginTop: "5px" }} />;
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

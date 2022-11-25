/* ROWS TO BE USED IN THE TOP COUNTRIES STATISTIC */

import * as React from "react";
import { Card, CardMedia, TableCell, tableCellClasses, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ICountryData from "../util/interfaces/ICountryData";
import IModifier from "../util/interfaces/IModifier";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { green, blue, red } from "@mui/material/colors";

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

type TopsModifiers = {
  forcelimit: number;
  max_manpower: number;
  manpower_recovery: number;
  quality: number;
  monthly_income: number;
};

const StatisticRowTops = (props: {
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

  const currentMods: TopsModifiers = {
    forcelimit: parseInt(countryData["FL" as keyof ICountryData] as string),
    max_manpower: parseInt(countryData["max_manpower" as keyof ICountryData] as string),
    manpower_recovery: parseInt(countryData["manpower_recovery" as keyof ICountryData] as string),
    quality: parseInt(countryData["qualityScore" as keyof ICountryData] as string),
    monthly_income: parseInt(countryData["monthly_income" as keyof ICountryData] as string),
  };

  const value: number =
    (currentMods.forcelimit +
      currentMods.max_manpower / 1000 +
      (currentMods.manpower_recovery / 1000) * 120) *
      ((currentMods.quality / 100) ^ 2) *
      0.8 +
    currentMods.monthly_income * 0.2;
  let lastValue: number = value;
  if (lastIndex >= 0) {
    const lastMods: TopsModifiers = {
      forcelimit: parseInt(
        sortedLastCountriesData[lastIndex]["FL" as keyof ICountryData] as string
      ),
      max_manpower: parseInt(
        sortedLastCountriesData[lastIndex]["max_manpower" as keyof ICountryData] as string
      ),
      manpower_recovery: parseInt(
        sortedLastCountriesData[lastIndex]["manpower_recovery" as keyof ICountryData] as string
      ),
      quality: parseInt(
        sortedLastCountriesData[lastIndex]["qualityScore" as keyof ICountryData] as string
      ),
      monthly_income: parseInt(
        sortedLastCountriesData[lastIndex]["monthly_income" as keyof ICountryData] as string
      ),
    };
    lastValue =
      (lastMods.forcelimit +
        lastMods.max_manpower / 1000 +
        (lastMods.manpower_recovery / 1000) * 120) *
        ((lastMods.quality / 100) ^ 2) *
        0.8 +
      lastMods.monthly_income * 0.2;
  }
  if (lastValue === 0) lastValue = value;
  const change: number = value - lastValue;
  const percentage: number = (change / lastValue) * 100;
  return (
    <StyledTableRow key={countryData.tag}>
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
            image={"/images/flags/" + countryData.flag}
            alt={countryData.flag}
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
          {percentage > 0
            ? "+" + percentage.toFixed(0)
            : percentage === Infinity
            ? "0"
            : percentage.toFixed(0)}
          {"%"}
        </TypographyCell>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default StatisticRowTops;

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

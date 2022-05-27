import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { green, blue, red } from "@mui/material/colors";
import { Avatar, Card, CardMedia, Typography } from "@mui/material";
import { useLocalStorage } from "../util/hooks/useLocalStorage";
import { IStatData, IModifier } from "../src/Modifiers";

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

const Statistic = (props: { modifier: IModifier; statData: IStatData[] }) => {
  const { modifier, statData } = props;

  React.useEffect(() => {
    console.log(statData);
  }, []);

  return (
    <TableContainer component={Paper} sx={{ marginBottom: 10 }}>
      <Table sx={{ minWidth: 600 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>#</StyledTableCell>
            <StyledTableCell>T</StyledTableCell>
            <StyledTableCell>PAÍS</StyledTableCell>
            <StyledTableCell>PLAYER</StyledTableCell>
            <StyledTableCell align="right">VALOR</StyledTableCell>
            <StyledTableCell align="right">CAMBIO</StyledTableCell>
            <StyledTableCell align="right">PORCENTAJE</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {statData.map((stat, index) => (
            <StyledTableRow key={stat.country}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>
                {getTendencyIcon(stat.tendency)}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <Card
                  elevation={0}
                  sx={{
                    display: "flex",
                    backgroundColor: "transparent",
                    alignItems: "center",
                    height: 20,
                  }}
                >
                  <Typography>{stat.country}</Typography>

                  <CardMedia
                    component="img"
                    sx={{
                      marginLeft: 1,
                      width: 24,
                      height: 20,
                    }}
                    image={stat.flag}
                    alt={stat.country}
                  />
                </Card>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{stat.player}</Typography>
              </StyledTableCell>
              <StyledTableCell align="right">{stat.value}</StyledTableCell>
              <StyledTableCell align="right">{stat.change}</StyledTableCell>
              <StyledTableCell align="right">
                {Math.round(stat.percentage * 100)}%
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Statistic;

function getTendencyIcon(tendency: number) {
  if (tendency > 0) {
    return (
      <ArrowDropUpRoundedIcon fontSize="large" sx={{ color: green[600] }} />
    );
  } else if (tendency < 0) {
    return (
      <ArrowDropDownRoundedIcon fontSize="large" sx={{ color: red[600] }} />
    );
  } else {
    return <ArrowRightRoundedIcon fontSize="large" sx={{ color: blue[600] }} />;
  }
}

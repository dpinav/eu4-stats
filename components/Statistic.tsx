import * as React from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { green, blue, red, yellow, orange } from "@mui/material/colors";
import {
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
import { IStatData, IModifier } from "../src/Modifiers";
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
  paddingLeft: 28,
  paddingRight: 28,
  "&:last-child": {
    paddingBottom: 0,
  },
}));
const Statistic = (props: { modifier: IModifier; statData: IStatData[] }) => {
  const { modifier, statData } = props;
  const [saveYear, setSaveYear] = useLocalStorage("save_year", "1444");
  const [selectedLogo, setSelectedLogo] = useLocalStorage(
    "selected_logo",
    "logoEstrategas.png"
  );

  const printRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    console.log(statData);
  }, []);

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
          <Box m={5}>
            <Typography
              variant="h4"
              fontFamily={"Trajan Pro"}
              fontWeight={"bold"}
              sx={{ color: orange[300], textShadow: "1.5px 1.5px 1.5px black" }}
            >
              {saveYear}
            </Typography>
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
        <TableContainer component={Paper} sx={{ marginBottom: 10 }}>
          <Table
            sx={{ minWidth: 600 }}
            aria-label="customized table"
            padding="none"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ paddingLeft: 2 }}>#</StyledTableCell>
                <StyledTableCell sx={{ paddingLeft: 1.5 }}>T</StyledTableCell>
                <StyledTableCell>PAÍS</StyledTableCell>
                <StyledTableCell>PLAYER</StyledTableCell>
                <StyledTableCell align="right">VALOR</StyledTableCell>
                <StyledTableCell align="right">CAMBIO</StyledTableCell>
                <StyledTableCell align="right" sx={{ paddingRight: 2 }}>
                  %
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statData.map((stat, index) => (
                <StyledTableRow key={stat.country}>
                  <StyledTableCell sx={{ paddingLeft: 2 }}>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>
                    {getTendencyIcon(stat.tendency)}
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
                        image={stat.flag}
                        alt={stat.country}
                      />
                      <Typography>{stat.country}</Typography>
                    </Card>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TypographyCell>{stat.player}</TypographyCell>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <TypographyCell>{stat.value ?? 0}</TypographyCell>
                  </StyledTableCell>
                  <StyledTableCell align="right" sx={{ paddingRight: 1 }}>
                    <Typography>
                      {stat.change > 0 ? "+" : ""}
                      {stat.change ?? 0}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell
                    align="right"
                    sx={{
                      paddingRight: 1,
                      backgroundColor: getPercentageColor(
                        stat.percentage * 100
                      ),
                    }}
                  >
                    <TypographyCell>
                      {stat.change >= 0 ? "+" : ""}
                      {Math.round(stat.percentage * 100)}%
                    </TypographyCell>
                  </StyledTableCell>
                </StyledTableRow>
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

function getTendencyIcon(tendency: number) {
  if (tendency > 0) {
    return (
      <ArrowDropUpRoundedIcon
        fontSize="large"
        sx={{ color: green[600], marginTop: "5px" }}
      />
    );
  } else if (tendency < 0) {
    return (
      <ArrowDropDownRoundedIcon
        fontSize="large"
        sx={{ color: red[600], marginTop: "5px" }}
      />
    );
  } else {
    return (
      <ArrowRightRoundedIcon
        fontSize="large"
        sx={{ color: blue[600], marginTop: "4px" }}
      />
    );
  }
}

function getPercentageColor(percentage: number) {
  if (percentage >= 100) return green[900];
  if (percentage > 90) return green[900];
  if (percentage > 80) return green[800];
  if (percentage > 70) return green[800];
  if (percentage > 60) return green[600];
  if (percentage > 50) return green[500];
  if (percentage > 40) return green[400];
  if (percentage > 30) return green[400];
  if (percentage > 20) return green[300];
  if (percentage > 10) return green[300];
  if (percentage >= 0) return green[300];
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

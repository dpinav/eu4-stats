import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "../components/Link";
import ProTip from "../components/ProTip";
import Author from "../components/Author";
import Statistic from "../components/Statistic";
import { useLocalStorage } from "../util/hooks/useLocalStorage";
import { IModifier, IStatData, modifiers } from "../src/Modifiers";
import axios from "axios";
import { toPng } from "html-to-image";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const Stats: NextPage = () => {
  const [apiKey, setApiKey] = useLocalStorage("skan_api_key", "");
  const [currentSave, setCurrentSave] = useLocalStorage("current_save", "");
  const [lastSave, setLastSave] = useLocalStorage("last_save", "");

  const [statsData, setStatsData] = React.useState<IStatData[][]>([]);
  const [error, setError] = React.useState<string>("");
  const [statsLoaded, setStatsLoaded] = React.useState<boolean>(false);
  //const [statsData, setStatsData] = useLocalStorage("stats_data", []);

  const printRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (apiKey === "" || currentSave === "") {
      setError("Please enter your API key and select a save.");
      return;
    }

    const fetchStatsData = async () => {
      const response = await axios.get(
        `/api/modifiers?apiKey=${apiKey}&currentSave=${currentSave}${
          lastSave !== "" ? `&lastSave=${lastSave}` : ``
        }`
      );
      return await response.data;
    };
    fetchStatsData()
      .then((data) => {
        setStatsData(data);
        setStatsLoaded(true);
      })
      .catch((error) => {
        setError(error.response.data.error);
        console.log(error);
      });
  }, []);

  const handleDownloadImage = React.useCallback(async () => {
    if (printRef.current === null) {
      return;
    }

    let index = 0;
    for (const element of printRef.current.children) {
      if (element.tagName !== "BUTTON") {
        const dataUrl = await toPng(element as HTMLElement, {
          cacheBust: true,
        });
        const link = document.createElement("a");
        link.download = `${currentSave} ${modifiers[index].name}.png`;
        link.href = dataUrl;
        link.click();
        link.remove();
        index++;
      }
    }
  }, [printRef]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom marginBottom={10}>
          Stats
        </Typography>
        {statsLoaded && (
          <Box maxWidth="sm" margin={10}>
            <Button variant="contained" component={Link} noLinkStyle href="/">
              Go to the home page
            </Button>
          </Box>
        )}
        <Box ref={printRef}>
          {statsData.map((stats: IStatData[], index: number) => (
            <Statistic
              key={index}
              modifier={modifiers[index]}
              statData={stats}
            ></Statistic>
          ))}
        </Box>
        {statsLoaded && (
          <>
            <Box maxWidth="sm" margin={10}>
              <Button variant="contained" onClick={handleDownloadImage}>
                Download all as images
              </Button>
            </Box>
            <Box maxWidth="sm" margin={10}>
              <Button variant="contained" component={Link} noLinkStyle href="/">
                Go to the home page
              </Button>
            </Box>
            <ProTip />
            <Author />
          </>
        )}
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!statsLoaded}
      >
        {error && (
          <Alert
            severity="error"
            variant="filled"
            action={
              <Button
                component={Link}
                href="/"
                sx={{ marginTop: "15%", marginLeft: "10%" }}
              >
                Return
              </Button>
            }
          >
            <AlertTitle>Error</AlertTitle>
            <Typography>{error}</Typography>
          </Alert>
        )}
        {!error && <CircularProgress color="inherit" />}
      </Backdrop>
    </Container>
  );
};

export default Stats;

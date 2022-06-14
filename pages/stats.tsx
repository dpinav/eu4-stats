import * as React from "react";
import type { NextPage } from "next";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
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
import { fetchData } from "../util/api";
import { toPng, toBlob } from "html-to-image";
import createCountriesData from "../util/factories/countriesData";
import { getModifiers } from "../util/factories/modifiers";
import IModifier from "../util/interfaces/IModifier";
import ICountryData from "../util/interfaces/ICountryData";
import StatsNavBar from "../components/StatsNavBar";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Stats: NextPage = () => {
  const [apiKey, setApiKey] = useLocalStorage("skan_api_key", "");
  const [currentSave, setCurrentSave] = useLocalStorage("current_save", "");
  const [lastSave, setLastSave] = useLocalStorage("last_save", "");

  const [currentCountriesData, setCurrentCountriesData] = React.useState<ICountryData[]>([]);
  const [lastCountriesData, setLastCountriesData] = React.useState<ICountryData[]>([]);

  const [error, setError] = React.useState<string>("");
  const [statsLoaded, setStatsLoaded] = React.useState<boolean>(false);
  //const [statsData, setStatsData] = useLocalStorage("stats_data", []);

  const printRef = React.useRef<HTMLDivElement>(null);

  const modifiers: IModifier[] = getModifiers();

  React.useEffect(() => {
    if (apiKey === "" || currentSave === "") {
      setError("Please enter your API key and select a save.");
      return;
    }

    fetchData(
      `/api/modifiers?apiKey=${apiKey}&currentSave=${currentSave}${
        lastSave !== "" ? `&lastSave=${lastSave}` : ``
      }`
    )
      .then(({ currentRawData, lastRawData }) => {
        createCountriesData(currentRawData, apiKey, currentSave).then((countriesData) => {
          setCurrentCountriesData(countriesData);
          setStatsLoaded(true);
        });
        createCountriesData(lastRawData, apiKey, lastSave).then((countriesData) =>
          setLastCountriesData(countriesData)
        );
      })
      .catch((error) => {
        setError(error.response?.data.error);
        console.log(error);
      });
  }, []);

  const handleDownloadImage = React.useCallback(async () => {
    if (printRef.current === null) {
      return;
    }
    const zip = new JSZip();
    let index = 0;
    for (const element of printRef.current.children) {
      if (element.tagName !== "BUTTON") {
        const dataUrl = await toBlob(element as HTMLElement, {
          cacheBust: true,
        });
        zip.file(`${currentSave} ${modifiers[index].name}.png`, dataUrl);
        index++;
      }
    }
    zip
      .generateAsync({ type: "blob" })
      .then((blob) => {
        saveAs(blob, `${currentSave}.zip`);
      })
      .catch((error) => {
        console.log(error);
      });
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
        <StatsNavBar
          currentCountriesData={currentCountriesData}
          lastCountriesData={lastCountriesData}
          downloadImages={handleDownloadImage}
          saveEditedCurrentData={setCurrentCountriesData}
        ></StatsNavBar>
        <Box ref={printRef}>
          {modifiers.map((modifier: IModifier) => (
            <Statistic
              key={modifier.parameter}
              modifier={modifier}
              currentCountriesData={currentCountriesData}
              lastCountriesData={lastCountriesData}
            ></Statistic>
          ))}
        </Box>
        {statsLoaded && (
          <>
            <ProTip />
            <Author />
          </>
        )}
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
        open={!statsLoaded}
      >
        {error && (
          <Alert
            severity="error"
            variant="filled"
            action={
              <Button component={Link} href="/" sx={{ marginTop: "15%", marginLeft: "10%" }}>
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

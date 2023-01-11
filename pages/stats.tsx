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
import { fetchCountriesData, fetchData } from "../util/api";
import useSWRImmutable from "swr/immutable";
import { toPng, toBlob } from "html-to-image";
import createCountriesData from "../util/factories/countriesData";
import { getModifiers } from "../util/factories/modifiers";
import IModifier from "../util/interfaces/IModifier";
import ICountryData from "../util/interfaces/ICountryData";
import StatsNavBar from "../components/StatsNavBar";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const CountriesDataContext = React.createContext<any[]>([]);

const Stats: NextPage = () => {
  const [apiKey, setApiKey] = useLocalStorage("skan_api_key", "");
  const [currentSave, setCurrentSave] = useLocalStorage("current_save", "");
  const [lastSave, setLastSave] = useLocalStorage("last_save", "");

  const [currentCountriesData, setCurrentCountriesData] = React.useState<ICountryData[]>([]);
  const [lastCountriesData, setLastCountriesData] = React.useState<ICountryData[]>([]);

  const { data, error } = useSWRImmutable(
    `/api/modifiers?apiKey=${apiKey}&currentSave=${currentSave}${
      lastSave !== "" ? `&lastSave=${lastSave}` : ``
    }`,
    fetchData
  );

  const setCountriesData = React.useCallback(
    () =>
      fetchCountriesData(data, apiKey, currentSave, lastSave).then((data) => {
        setCurrentCountriesData(data.currentCountriesData);
        setLastCountriesData(data.lastCountriesData);
      }),
    [data, apiKey, currentSave, lastSave]
  );

  const printRef = React.useRef<HTMLDivElement>(null);

  const modifiers: IModifier[] = getModifiers();

  const handleDownloadImage = React.useCallback(async () => {
    if (printRef.current === null) {
      return;
    }
    const zip = new JSZip();
    let index = 0;
    for (const element of printRef.current.children) {
      if (element.tagName !== "BUTTON") {
        const dataUrl: Blob = (await toBlob(element as HTMLElement, {
          cacheBust: true,
        }))!;
        zip.file(`${index}-${currentSave}-${modifiers[index].name}.png`, dataUrl);
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

  if (error) {
    return (
      <Backdrop open={true}>
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
      </Backdrop>
    );
  }

  if (!data) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (data && currentCountriesData.length === 0) {
    setCountriesData();
  }

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
        <CountriesDataContext.Provider
          value={[
            currentCountriesData,
            setCurrentCountriesData,
            lastCountriesData,
            setLastCountriesData,
          ]}
        >
          <StatsNavBar downloadImages={handleDownloadImage}></StatsNavBar>
          <Box ref={printRef}>
            {modifiers.map((modifier: IModifier) => (
              <Statistic key={modifier.parameter} modifier={modifier}></Statistic>
            ))}
          </Box>
        </CountriesDataContext.Provider>
        <ProTip />
        <Author />
      </Box>
    </Container>
  );
};

export default Stats;

import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "../components/Link";
import ProTip from "../components/ProTip";
import Author from "../components/Author";
import Statistic from "../components/Statistic";
import { useLocalStorage } from "../util/hooks/useLocalStorage";
import { IModifier, IStatData, modifiers } from "../src/Modifiers";
import axios from "axios";
import html2canvas from "html2canvas";

const Stats: NextPage = () => {
  const [apiKey, setApiKey] = useLocalStorage("skan_api_key", "");
  const [currentSave, setCurrentSave] = useLocalStorage("current_save", "");
  const [lastSave, setLastSave] = useLocalStorage("last_save", "");
  //const [statsData, setStatsData] = React.useState<IStatData[][]>([]);
  const [statsData, setStatsData] = useLocalStorage("stats_data", []);

  const printRef = React.useRef();

  //React.useEffect(() => {
  //  if (apiKey === "" || currentSave === "") return;
  //
  //  const fetchStatsData = async () => {
  //    const response = await axios.get(
  //      `/api/modifiers?apiKey=${apiKey}&currentSave=${currentSave}${
  //        lastSave !== "" ? `&lastSave=${lastSave}` : ``
  //      }`
  //    );
  //    return await response.data;
  //  };
  //  fetchStatsData()
  //    .then((data) => {
  //      setStatsData(data);
  //    })
  //    .catch((error) => console.log(error));
  //}, []);

  const handleDownloadImage = async () => {
    //@ts-ignore
    const element: [] = [].slice.call(printRef.current.children);
    console.log(element);
    await Promise.all(
      element.map(async (e: HTMLElement) => {
        const canvas = await html2canvas(e);

        const data = canvas.toDataURL("image/png");
        const link = document.createElement("a");

        if (typeof link.download === "string") {
          link.href = data;
          link.download = "image.png";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          window.open(data);
        }
      })
    );
  };

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
        <Box ref={printRef}>
          {statsData.map((stats: IStatData[], index: number) => (
            <Box>
              <Statistic
                key={index}
                modifier={modifiers[index]}
                statData={stats}
              ></Statistic>
            </Box>
          ))}
        </Box>
        <Box maxWidth="sm" margin={10}>
          <button type="button" onClick={handleDownloadImage}>
            To image
          </button>
        </Box>
        <Box maxWidth="sm" margin={10}>
          <Button variant="contained" component={Link} noLinkStyle href="/">
            Go to the home page
          </Button>
        </Box>
        <ProTip />
        <Author />
      </Box>
    </Container>
  );
};

export default Stats;

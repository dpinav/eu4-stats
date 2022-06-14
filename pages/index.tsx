import * as React from "react";
import axios from "axios";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "../components/Link";
import ProTip from "../components/ProTip";
import Author from "../components/Author";
import SkanApiKeyInput from "../components/SkanApiKeyInput";
import SkanSaveSelect from "../components/SkanSaveSelect";
import LogoSelect from "../components/LogoSelect";
import { SelectChangeEvent } from "@mui/material";
import { useLocalStorage } from "../util/hooks/useLocalStorage";

const Home: NextPage = () => {
  const [apiKey, setApiKey] = useLocalStorage("skan_api_key", "");
  const [currentSave, setCurrentSave] = useLocalStorage("current_save", "");
  const [lastSave, setLastSave] = useLocalStorage("last_save", "");

  const [error, setError] = React.useState<string>("");

  const [allSaves, setAllSaves] = React.useState<[]>([]);

  const [savesLoaded, setSavesLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    setError("");
    if (apiKey === "") return;
    const fetchSaves = async () => {
      const res = await axios.get(`/api/saves?apiKey=${apiKey}`);
      return await res.data;
    };
    fetchSaves()
      .then((saves) => {
        setAllSaves(saves);
        setSavesLoaded(saves !== []);
      })
      .catch((error) => {
        console.log(error);
        setError(error?.response?.data?.error);
        setSavesLoaded(false);
      });
  }, [apiKey]);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
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
        <Typography variant="h5" component="h1" gutterBottom>
          Load your Skanderberg API key
        </Typography>
        <SkanApiKeyInput apiKey={apiKey} error={error} onApiKeyChange={handleApiKeyChange} />
        {savesLoaded && (
          <SkanSaveSelect
            selectedSave={currentSave}
            allSaves={allSaves}
            isCurrentSave={true}
            handleSaveSelect={(e: SelectChangeEvent<string>) => setCurrentSave(e.target.value)}
          />
        )}
        {savesLoaded && (
          <SkanSaveSelect
            selectedSave={lastSave}
            allSaves={allSaves}
            isCurrentSave={false}
            handleSaveSelect={(e: SelectChangeEvent<string>) => setLastSave(e.target.value)}
          />
        )}
        {savesLoaded && <LogoSelect />}
        {savesLoaded && (
          <Button
            variant="contained"
            component={Link}
            noLinkStyle
            href="/stats"
            sx={{ marginTop: 2 }}
          >
            Load stats
          </Button>
        )}
        <ProTip />
        <Author />
      </Box>
    </Container>
  );
};

export default Home;

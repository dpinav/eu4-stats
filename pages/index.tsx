import * as React from "react";
import axios from "axios";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../components/Link";
import ProTip from "../components/ProTip";
import Author from "../components/Author";
import SkanApiKeyInput from "../components/SkanApiKeyInput";
import SkanSaveSelect from "../components/SkanSaveSelect";
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
    const fetchData = async () => {
      if (apiKey < 32) {
        return "";
      }
      const res = await axios.get(`/api/saves?apiKey=${apiKey}`);
      return await res.data;
    };
    fetchData().then((data) => {
      if (apiKey < 32) {
        setError("API Key should be at least 32 characters long");
        setSavesLoaded(false);
        return;
      } else if (error === "" && data && data.length > 10000) {
        setError("API Key is invalid");
        setSavesLoaded(false);
        return;
      }
      const saves = data.filter((save: any) => {
        const date = new Date(save.timestamp.split(" ")[0]);
        return (
          date.getFullYear() === new Date().getFullYear() &&
          new Date().getMonth() - date.getMonth() < 3
        );
      });
      setAllSaves(saves);
      setSavesLoaded(saves !== []);
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
        <SkanApiKeyInput
          apiKey={apiKey}
          error={error}
          onApiKeyChange={handleApiKeyChange}
        />
        {savesLoaded && (
          <SkanSaveSelect
            selectedSave={currentSave}
            allSaves={allSaves}
            isCurrentSave={true}
            handleSaveSelect={(e: SelectChangeEvent<string>) =>
              setCurrentSave(e.target.value)
            }
          />
        )}
        {savesLoaded && (
          <SkanSaveSelect
            selectedSave={lastSave}
            allSaves={allSaves}
            isCurrentSave={false}
            handleSaveSelect={(e: SelectChangeEvent<string>) =>
              setLastSave(e.target.value)
            }
          />
        )}
        <Link href="/stats" color="secondary" sx={{ paddingTop: 5 }}>
          Load stats
        </Link>
        <ProTip />
        <Author />
      </Box>
    </Container>
  );
};

export default Home;

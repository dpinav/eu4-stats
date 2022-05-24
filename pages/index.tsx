import * as React from "react";
import axios from "axios";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../src/Link";
import ProTip from "../src/ProTip";
import Author from "../src/Author";
import SkanApiKeyInput from "../src/SkanApiKeyInput";
import SkanSaveSelect from "../src/SkanSaveSelect";
import { SelectChangeEvent } from "@mui/material";
import { useLocalStorage } from "../src/hooks";

interface State {
  skan_api_key: string;
  current_save: string;
  last_save: string;
}

const Home: NextPage = () => {
  const [values, setValues] = React.useState<State>({
    skan_api_key: "",
    current_save: "",
    last_save: "",
  });
  //const [apiKey, setApiKey] = useLocalStorage("skan_api_key", "");
  //const [currentSave, setCurrentSave] = useLocalStorage("current_save", "");
  //const [lastSave, setLastSave] = useLocalStorage("last_save", "");

  const [errors, setErrors] = React.useState<State>({
    skan_api_key: "",
    current_save: "",
    last_save: "",
  });

  const [allSaves, setAllSaves] = React.useState<[]>([]);

  const [savesLoaded, setSavesLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    setValues({
      ["skan_api_key"]: JSON.parse(
        localStorage.getItem("skan_api_key") ?? '""'
      ),
      ["current_save"]: JSON.parse(
        localStorage.getItem("current_save") ?? '""'
      ),
      ["last_save"]: JSON.parse(localStorage.getItem("last_save") ?? '""'),
    });
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (values.skan_api_key.length < 32) {
        return;
      }

      setErrors({
        ...errors,
        skan_api_key: "",
      });

      const res = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://skanderbeg.pm/api.php?key=${values.skan_api_key}&scope=fetchUserSaves`
      );
      return await res.data;
    };
    fetchData().then((data) => {
      if (values.skan_api_key.length < 32) {
        setErrors({
          ...errors,
          skan_api_key: "API Key should be at least 32 characters long",
        });
        setSavesLoaded(false);
        return;
      } else if (errors.skan_api_key === "" && data && data.length > 10000) {
        setErrors({
          ...errors,
          skan_api_key: "API Key is invalid",
        });
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
  }, [values.skan_api_key]);

  const handleApiKeyChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
      localStorage.setItem(prop, JSON.stringify(event.target.value));
    };

  const handleSaveSelect =
    (prop: keyof State) => (event: SelectChangeEvent<string>) => {
      setValues({ ...values, [prop]: event.target.value });
      localStorage.setItem(prop, JSON.stringify(event.target.value));
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
          apiKey={values.skan_api_key}
          error={errors.skan_api_key}
          onApiKeyChange={handleApiKeyChange("skan_api_key")}
        />
        {savesLoaded && (
          <SkanSaveSelect
            selectedSave={values.current_save}
            allSaves={allSaves}
            isCurrentSave={true}
            handleSaveSelect={handleSaveSelect("current_save")}
          />
        )}
        {savesLoaded && (
          <SkanSaveSelect
            selectedSave={values.last_save}
            allSaves={allSaves}
            isCurrentSave={false}
            handleSaveSelect={handleSaveSelect("last_save")}
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

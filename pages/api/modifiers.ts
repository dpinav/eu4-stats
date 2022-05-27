import { NextApiRequest, NextApiResponse } from "next";
import {
  getQueryUrl,
  fetchData,
  getQueryParamsModifiers,
  getAllStatsData,
} from "../../util/api";

type parameters = {
  apiKey: string;
  currentSave: string;
  lastSave: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { apiKey, currentSave, lastSave } = req.query as parameters;
    if (!apiKey || !currentSave) {
      res.status(400).json({
        error:
          "Missing required parameters apiKey, currentSave - lastSave is optional",
      });
    }
    const params = getQueryParamsModifiers();
    const currentUrl = getQueryUrl(
      apiKey,
      currentSave,
      "getCountryData",
      params,
      true
    );
    const currentData: any[] = Object.values(
      await fetchData(currentUrl).catch((error) => {
        res.status(500).json({ error: error });
      })
    );
    let lastData;
    if (lastSave) {
      const lastUrl = getQueryUrl(
        apiKey,
        lastSave,
        "getCountryData",
        params,
        true
      );
      lastData = Object.values(
        await fetchData(lastUrl).catch((error) => {
          res.status(500).json({ error: error });
        })
      );
    } else {
      lastData = currentData;
    }

    const allStatsData = await getAllStatsData(
      currentData,
      lastData,
      apiKey,
      currentSave
    );
    res.status(200).json(allStatsData);
  } else {
    res.status(400).json({ error: "Method not allowed" });
  }
};
import { NextApiRequest, NextApiResponse } from "next";
import { getQueryUrl, fetchData, getQueryParamsModifiers } from "../../../util/api";

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
        error: "Missing required parameters apiKey, currentSave - lastSave is optional",
      });
    } else {
      const params = getQueryParamsModifiers();
      const currentUrl = getQueryUrl(apiKey, currentSave, "getCountryData", params, true);
      const currentRawData: any[] = Object.values(
        await fetchData(currentUrl).catch((error) => {
          res.status(500).json({
            error: "Something went wrong. Skanderbeg might not be available. " + error,
          });
          res.end();
          return;
        })
      );
      let lastRawData;
      if (lastSave) {
        const lastUrl = getQueryUrl(apiKey, lastSave, "getCountryData", params, true);
        lastRawData = Object.values(
          await fetchData(lastUrl).catch((error) => {
            res.status(500).json({
              error: "Something went wrong. Skanderbeg might not be available. " + error,
            });
          })
        );
      } else {
        lastRawData = currentRawData;
      }
      res.status(200).json({ currentRawData, lastRawData });
      res.end();
    }
  } else {
    res.status(400).json({ error: "Method not allowed" });
    res.end();
  }
};

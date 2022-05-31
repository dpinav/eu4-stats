import { NextApiRequest, NextApiResponse } from "next";
import { fetchData, getQueryUrl } from "../../../util/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { apiKey } = req.query as { apiKey: string };
    if (!apiKey) {
      res.status(403).json({
        error: "Missing required parameter apiKey",
      });
      res.end();
    } else if (apiKey.length < 32) {
      res.status(403).json({
        error: "API Key must be at least 32 characters long",
      });
      res.end();
    } else {
      const urlRequest = getQueryUrl(apiKey, "", "fetchUserSaves");
      const saves = await fetchData(urlRequest).catch((error) => {
        res.status(500).json({ error: error });
        res.end();
        return;
      });

      if (saves && saves.length > 10000) {
        res.status(403).json({
          error: "API Key seems invalid",
        });
        res.end();
      } else {
        const recentSaves = saves.filter((save: any) => {
          const date = new Date(save.timestamp.split(" ")[0]);
          return (
            date.getFullYear() === new Date().getFullYear() &&
            new Date().getMonth() - date.getMonth() < 3
          );
        });
        res.status(200).json(saves);
      }
    }
  } else {
    res.status(400).json({
      error: "Method not allowed",
    });
    res.end();
  }
};

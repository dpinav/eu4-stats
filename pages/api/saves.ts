import { NextApiRequest, NextApiResponse } from "next";
import { fetchData, getQueryUrl } from "../../util/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { apiKey } = req.query as { apiKey: string };
    if (!apiKey) {
      res.status(400).json({
        error: "Missing required parameter apiKey",
      });
    }
    const urlRequest = getQueryUrl(apiKey, "", "fetchUserSaves");
    const saves = await fetchData(urlRequest).catch((error) => {
      res.status(500).json({ error: error });
    });
    res.status(200).json(saves);
  } else {
    res.status(400).json({
      error: "Method not allowed",
    });
  }
};

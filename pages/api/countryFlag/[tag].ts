import { NextApiRequest, NextApiResponse } from "next";
import { getQueryUrl, fetchData, getQueryParamsModifiers } from "../../../util/api";

type parameters = {
  apiKey: string;
  save: string;
  tag: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { apiKey, save, tag } = req.query as parameters;

    if (!apiKey || !save) {
      res.status(400).json({
        error: "Missing required parameters apiKey, save",
      });
      res.end();
    } else {
      let countryFlag = "data:image/png;base64,";

      countryFlag += await fetchData(
        getQueryUrl(apiKey, save, "getCountryFlag", "&country=" + tag + "&format=base64")
      ).catch((error) => res.status(400).json({ error: error }));

      res.status(200).json(countryFlag);
    }
  } else {
    res.status(400).json({ error: "Method not allowed" });
    res.end();
  }
};

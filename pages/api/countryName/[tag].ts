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
    } else {
      let countryName = await fetchData(
        getQueryUrl(apiKey, save, "getCountryName", "&country=" + tag)
      );
      countryName = countryName?.length < 20 ? countryName : countryName?.slice(0, 17) + "...";
      res.status(200).json(countryName);
    }
  } else {
    res.status(400).json({ error: "Method not allowed" });
    res.end();
  }
};

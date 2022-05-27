import axios from "axios";
import { IModifier, IStatData, modifiers } from "../src/Modifiers";

export const getQueryUrl = (
  apiKey: string,
  save: string,
  scope: string,
  params: string = "",
  playersOnly: boolean = false
) => {
  return `https://skanderbeg.pm/api.php?key=${apiKey}&scope=${scope}${
    save ? `&save=${save}` : ``
  }${params}${playersOnly ? `&playersOnly=true` : ``}`;
};

export const fetchData = async (urlRequest: string) => {
  const response = await axios.get(urlRequest);
  return await response.data;
};

export function getQueryParamsModifiers(): string {
  let params = "&value=";
  modifiers.forEach((modifier) => {
    params += `${modifier.parameter};`;
  });
  params += "player;tag;";
  return params;
}

export async function getAllStatsData(
  currentData: any[],
  lastData: any[],
  apiKey: string,
  currentSave: string
) {
  const allStatsData: IStatData[][] = [];

  await Promise.all(
    currentData.map(
      async (element: []) =>
        await Promise.all(
          element.map(async (country: any) => {
            country.country = await fetchData(
              getQueryUrl(
                apiKey,
                currentSave,
                "getCountryName",
                "&country=" + country.tag
              )
            );
            country.country =
              country.country.length < 15 ? country.country : country.tag;
            country.flag = (
              await fetchData(
                getQueryUrl(
                  apiKey,
                  currentSave,
                  "getCountryFlag",
                  "&country=" + country.tag
                )
              )
            ).url;
            console.log(country.country);
          })
        )
    )
  );

  modifiers.forEach((modifier) => {
    allStatsData.push(getStatsData(currentData, lastData, modifier));
  });
  return allStatsData;
}

function sortRawData(data: any[], modifier: IModifier) {
  return data.sort((a: any, b: any) => {
    return (
      parseInt(b[0][modifier.parameter]) - parseInt(a[0][modifier.parameter])
    );
  });
}

function getStatsData(
  currentData: any[],
  lastData: any[],
  modifier: IModifier
): IStatData[] {
  const currentStatsData: IStatData[] = [];
  const lastStatsData: IStatData[] = [];
  const sortedCurrent = sortRawData(currentData, modifier);
  const sortedLast = sortRawData(lastData, modifier);

  sortedLast.forEach((element: [], index) =>
    element.forEach((country: any) => {
      const lastStatData = {
        position: index,
        tendency: 0,
        country: country.country,
        tag: country.tag,
        flag: country.flag,
        player: country.player,
        value: parseInt(country[modifier.parameter]),
        change: 0,
        percentage: 0,
      };
      lastStatsData.push(lastStatData);
    })
  );

  sortedCurrent.forEach((element: [], index) =>
    element.forEach((country: any) => {
      const lastStat = lastStatsData.find((e) => e.tag === country.tag) ?? {
        position: sortedCurrent.length,
        value: parseInt(country[modifier.parameter]),
      };
      const currentStatData = {
        position: index,
        tendency: lastStat.position - index,
        country: country.country,
        tag: country.tag,
        flag: country.flag,
        player: country.player,
        value: parseInt(country[modifier.parameter]),
        change: parseInt(country[modifier.parameter]) - lastStat.value,
        percentage:
          (parseInt(country[modifier.parameter]) - lastStat.value) /
          lastStat.value,
      };
      currentStatsData.push(currentStatData);
    })
  );
  return currentStatsData;
}

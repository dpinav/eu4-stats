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

export const fetchData = async (urlRequest: string, type: string = "") => {
  const response = await axios.get(urlRequest);
  return await response.data;
};

export const fetchFlag = async (countryTag: string) => {};

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

  for (const element of currentData) {
    for (const country of element) {
      country.country = await fetchData(
        getQueryUrl(
          apiKey,
          currentSave,
          "getCountryName",
          "&country=" + country.tag
        )
      );
      country.country =
        country.country.length < 20
          ? country.country
          : country.country.slice(0, 17) + "...";
      country.player =
        country.player.length < 20
          ? country.player
          : country.player.slice(0, 17) + "...";
      country.flag =
        "data:image/png;base64," +
        (await fetchData(
          getQueryUrl(
            apiKey,
            currentSave,
            "getCountryFlag",
            "&country=" + country.tag + "&format=base64"
          )
        ));
    }
  }

  modifiers.forEach((modifier) => {
    allStatsData.push(getStatsData(currentData, lastData, modifier));
  });
  return allStatsData;
}

function sortRawData(data: any[], modifier: IModifier) {
  return data.sort((a: any, b: any) => {
    //if (modifier.parameter === "army_professionalism") {
    //  return b[0][modifier.parameter] * 100 - a[0][modifier.parameter] * 100;
    //}
    return b[0][modifier.parameter] - a[0][modifier.parameter];
  });
}

function getStatsData(
  currentData: any[],
  lastData: any[],
  modifier: IModifier
): IStatData[] {
  const currentStatsData: IStatData[] = [];
  const lastStatsData: IStatData[] = [];

  parseRawValues(currentData, modifier);
  parseRawValues(lastData, modifier);
  const sortedCurrent = sortRawData(currentData, modifier);
  const sortedLast = sortRawData(lastData, modifier);

  sortedLast.forEach((element: [], index) =>
    element?.forEach((country: any) => {
      const lastStatData = {
        position: index,
        tendency: 0,
        country: country.country,
        tag: country.tag,
        flag: country.flag,
        player: country.player,
        value: country[modifier.parameter],
        change: 0,
        percentage: 0,
      };
      lastStatsData.push(lastStatData);
    })
  );

  sortedCurrent.forEach((element: [], index) =>
    element.forEach((country: any) => {
      const lastStat = lastStatsData.find((e) => e.tag === country.tag) ??
        lastStatsData.find((e) => e.player === country.player) ?? {
          position: -1,
          value: country[modifier.parameter],
        };
      const currentStatData = {
        position: index,
        tendency: lastStat.position >= 0 ? lastStat.position - index : 0,
        country: country.country,
        tag: country.tag,
        flag: country.flag,
        player: country.player,
        value: parseInt(country[modifier.parameter]),
        change: parseInt(
          (country[modifier.parameter] - lastStat.value).toString()
        ),
        percentage:
          (country[modifier.parameter] - lastStat.value) / lastStat.value,
      };
      currentStatsData.push(currentStatData);
    })
  );
  return currentStatsData;
}

function parseRawValues(statsData: any[], modifier: IModifier) {
  statsData.forEach((element: [], index) =>
    element?.forEach((country: any) => {
      if (modifier.parameter === "army_professionalism") {
        country[modifier.parameter] *= 100;
        country[modifier.parameter] = parseFloat(
          country[modifier.parameter]
        ).toFixed(2);
      } else if (modifier.parameter === "provinces") {
        country[modifier.parameter] = parseInt(country[modifier.parameter]);
      } else {
        country[modifier.parameter] = parseInt(country[modifier.parameter]);
      }
    })
  );
}

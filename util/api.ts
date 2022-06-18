import axios from "axios";
import createCountriesData from "./factories/countriesData";
import { getModifiers } from "./factories/modifiers";
import { Fetcher } from "swr";
import IModifier from "./interfaces/IModifier";
import ICountryData from "./interfaces/ICountryData";

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

export const fetchCountriesData = async (
  data: any,
  apiKey: string,
  currentSave: string,
  lastSave: string
) => {
  const { currentRawData, lastRawData } = data;
  const currentCountriesData: ICountryData[] = await createCountriesData(
    currentRawData,
    apiKey,
    currentSave
  );
  const lastCountriesData: ICountryData[] = await createCountriesData(
    lastRawData,
    apiKey,
    lastSave,
    false
  );
  return { currentCountriesData, lastCountriesData };
};

export function getQueryParamsModifiers(): string {
  let params = "&value=";
  getModifiers().forEach((modifier: IModifier) => {
    params += `${modifier.parameter};`;
  });
  params += "player;tag;";
  return params;
}

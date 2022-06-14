import axios from "axios";
import { getModifiers } from "./factories/modifiers";
import IModifier from "./interfaces/IModifier";

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
  getModifiers().forEach((modifier: IModifier) => {
    params += `${modifier.parameter};`;
  });
  params += "player;tag;";
  return params;
}

import ICountryData from "../interfaces/ICountryData";
import { fetchData } from "../api";

export default async function createCountriesData(
  rawCountriesData: any[],
  apiKey: string,
  save: string,
  getFlagsAndNames: boolean = true
) {
  const countriesData: ICountryData[] = [];
  for (const element of rawCountriesData) {
    for (const country of element) {
      countriesData.push(await initCountryData(country, apiKey, save, getFlagsAndNames));
    }
  }

  return countriesData;
}

async function initCountryData(
  rawCountryData: any,
  apiKey: string,
  save: string,
  getFlagsAndNames: boolean
) {
  const countryData: ICountryData = {
    ...rawCountryData,
    player:
      rawCountryData.player?.length < 20
        ? rawCountryData.player
        : rawCountryData.player?.slice(0, 17) + "...",
    spent_total: parseInt(rawCountryData.spent_total),
    innovativeness: parseFloat(rawCountryData.innovativeness).toFixed(2),
    army_professionalism: (parseFloat(rawCountryData.army_professionalism) * 100).toFixed(2),
    totalManaGainAverage: parseFloat(rawCountryData.totalManaGainAverage).toFixed(2),
  };
  if (getFlagsAndNames) {
    countryData.name = await fetchData(
      `/api/countryName/${countryData.tag}?apiKey=${apiKey}&save=${save}`
    );
    countryData.flag = await fetchData(
      `/api/countryFlag/${countryData.tag}?apiKey=${apiKey}&save=${save}`
    );
  } else {
    countryData.name = "noname";
    countryData.flag = "noflag";
  }

  countryData.ideas = 0; // parseInt("" + (await calculateIdeas(rawCountryData)));
  return countryData;
}

async function calculateIdeas(rawData: any) {
  let sum = 0;
  if (rawData.ideas) {
    let ideas = Object.values(rawData.ideas);
    console.log("ideas: " + ideas);
    for (let i = 1; i < ideas.length; i++) {
      sum += parseFloat(rawData.ideas[i]);
    }
  }
  return sum;
}

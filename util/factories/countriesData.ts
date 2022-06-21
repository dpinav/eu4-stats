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
    ideas: calculateIdeas(rawCountryData).toFixed(0),
    tops: getTopValue(rawCountryData).toFixed(0),
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

  return countryData;
}

function calculateIdeas(rawCountryData: any): number {
  let sum = 0;
  if (rawCountryData.ideas) {
    let ideas = Object.values(rawCountryData.ideas);
    for (let i = 1; i < ideas.length; i++) {
      sum += parseInt(ideas[i] as string);
    }
  }
  return sum;
}

const getTopValue = (rawCountryData: any): number => {
  const forcelimit = parseFloat(rawCountryData.FL);
  const max_manpower = parseFloat(rawCountryData.max_manpower);
  const manpower_recovery = parseFloat(rawCountryData.manpower_recovery);
  const monthly_income = parseFloat(rawCountryData.monthly_income);
  const qualityScore = parseFloat(rawCountryData.qualityScore);
  const value: number =
    (forcelimit + max_manpower / 1000 + (manpower_recovery / 1000) * 120) *
      (qualityScore / 100) ** 2 *
      0.8 +
    monthly_income * 0.2;
  return value;
};

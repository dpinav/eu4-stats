import ICountryData from "../interfaces/ICountryData";
import { fetchData } from "../api";
import { getModifiers } from "./modifiers";
import IModifier from "../interfaces/IModifier";

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
  let countryData: ICountryData = {
    ...rawCountryData,
    player:
      rawCountryData.player?.length < 20
        ? rawCountryData.player
        : rawCountryData.player?.slice(0, 17) + "...",
    army_professionalism: parseFloat(rawCountryData.army_professionalism) * 100,
    ideas: calculateIdeas(rawCountryData),
    tops: getTopValue(rawCountryData).toFixed(),
    technology: getTechnologyMedian(rawCountryData),
    ideasCsv: getCsvIdeas(rawCountryData.ideas),
    technologyCsv: getCsvTechs(rawCountryData.technology),
  };

  if (getFlagsAndNames) {
    countryData.name = await fetchData(
      `/api/countryName/${countryData.tag}?apiKey=${apiKey}&save=${save}`
    );
    countryData.flag = rawCountryData.tag + ".png"; /*await fetchData(
      `/api/countryFlag/${countryData.tag}?apiKey=${apiKey}&save=${save}`
    );*/
  } else {
    countryData.name = "noname";
    countryData.flag = "NOFLAG.png";
  }

  const modifiers: IModifier[] = getModifiers();
  modifiers.forEach((modifier: IModifier) => {
    const value: number | string = countryData[modifier.parameter as keyof ICountryData];
    !value
      ? ((countryData[modifier.parameter as keyof ICountryData] as number) = 0)
      : ((countryData[modifier.parameter as keyof ICountryData] as number) = parseFloat(
          value as string
        ));
  });

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

function getTechnologyMedian(rawCountryData: any) {
  const techs = Object.values(rawCountryData.technology);
  let sum = 0;
  for (let i = 0; i < techs.length; i++) {
    sum += parseInt(techs[i] as string);
  }
  return sum / techs.length;
}
function getCsvIdeas(ideas: any): string {
  let csv = "";
  const ideaKeys = Object.keys(ideas);
  for (let i = 1; i < 9; ++i) {
    if (ideaKeys[i]) {
      csv += ideaKeys[i] + ".png;";
    } else {
      csv += "noidea.png;";
    }
  }

  return csv;
}
function getCsvTechs(technology: any): string {
  return technology ? `${technology.adm};${technology.dip};${technology.mil}` : ";;";
}

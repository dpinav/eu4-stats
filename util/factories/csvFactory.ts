import ICountryData from "../interfaces/ICountryData";

interface ICsvData {
  position: string;
  positionChange: string;
  playerName: string;
  countryName: string;
  flagPath: string;
  topScore: string;
  changeUp: boolean;
  changeDown: boolean;
  changeN: string;
  changeP: string;
  ideas: string;
  technology: string;
}

export function generateTopsCsv(currentData: ICountryData[], lastData: ICountryData[]): string {
  const scoreDiffs = calculateScoreDiffs(currentData, lastData);
  const csv = generateCsv(scoreDiffs);
  return csv;
}

function generateCsv(scoreDiffs: ICsvData[]): string {
  let csv =
    "Pos;PosChange;Player;Country;Flag;Score;ChangeUp;ChangeDown;ChangeN;ChangeP;Idea1;Idea2;Idea3;Idea4;Idea5;Idea6;Idea7;Idea8;Adm;Dip;Mil\n";

  for (let i = 0; i < scoreDiffs.length; i++) {
    const {
      position,
      positionChange,
      playerName,
      countryName,
      flagPath,
      topScore,
      changeUp,
      changeDown,
      changeN,
      changeP,
      ideas,
      technology,
    } = scoreDiffs[i];
    csv += `${position};${positionChange};${playerName};${countryName};${flagPath};${topScore};${changeUp};${changeDown};${changeN};${changeP};${ideas}${technology}\n`;
  }

  return csv;
}

function calculateScoreDiffs(currentData: ICountryData[], lastData: ICountryData[]): ICsvData[] {
  const scoreDiffs: ICsvData[] = [];

  for (let i = 0; i < currentData.length; i++) {
    const currentCountry = currentData[i];
    const lastCountryIndex = lastData.findIndex(
      (country) =>
        country.tag === currentCountry.tag ||
        (country.player !== "undefined..." && country.player == currentCountry.player)
    );
    const lastCountry = lastData[lastCountryIndex];

    const changeN = lastCountry ? currentCountry.tops - lastCountry.tops : currentCountry.tops;
    const changeP = lastCountry
      ? ((currentCountry.tops - lastCountry.tops) / lastCountry.tops) * 100
      : 100;

    scoreDiffs.push({
      position: i + 1 + "",
      positionChange: calculatePositionChange(i, lastCountryIndex),
      playerName: currentCountry.player,
      countryName: currentCountry.name,
      flagPath: currentCountry.tag + ".png",
      topScore: parseInt(currentCountry.tops.toString()).toLocaleString("en-US"),
      changeN:
        changeN > 0
          ? "+" + parseInt(changeN.toString()).toLocaleString("en-US")
          : parseInt(changeN.toString()).toLocaleString("en-US"),
      changeP:
        changeP > 0
          ? "+" + parseFloat(changeP.toFixed(0)).toLocaleString("en-US")
          : !isNaN(changeP) && changeP !== Infinity
          ? parseFloat(changeP.toFixed(0)).toLocaleString("en-US")
          : "0",
      changeUp: changeN >= 0,
      changeDown: changeN < 0,
      ideas: currentCountry.ideasCsv,
      technology: currentCountry.technologyCsv,
    });
  }

  return scoreDiffs;
}
function calculatePositionChange(currentCountryIndex: number, lastCountryIndex: number): string {
  if (currentCountryIndex === lastCountryIndex || lastCountryIndex < 0) {
    return "blue.png";
  }
  if (currentCountryIndex < lastCountryIndex) {
    return "green.png";
  }
  return "red.png";
}

export interface IModifier {
  parameter: string;
  name: string;
}

export interface IStatData {
  position: number;
  tendency: number;
  country: string;
  tag: string;
  flag: string;
  player: string;
  value: number;
  change: number;
  percentage: number;
}

export const modifiers: IModifier[] = [
  { parameter: "provinces", name: "Número de provincias" },
  { parameter: "total_development", name: "Desarrollo total" },
  { parameter: "spent_total", name: "Gasto total" },
  { parameter: "innovativeness", name: "Innovación" },
  { parameter: "total_mana_spent_on_deving", name: "Puntos en desarrollo" },
  { parameter: "buildings_value", name: "Valor de edificios" },
  { parameter: "army_professionalism", name: "Profesionalismo" },
  { parameter: "total_casualties", name: "Bajas totales sufridas" },
];

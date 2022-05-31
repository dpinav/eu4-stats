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
  { parameter: "total_development", name: "Desarrollo total" },
  { parameter: "monthly_income", name: "Ingreso mensual" },
];

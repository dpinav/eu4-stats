import IModifier from "../interfaces/IModifier";

export const getModifiers: Function = (): IModifier[] => [
  { parameter: "provinces", name: "Número de provincias" },
  { parameter: "total_development", name: "Desarrollo total" },
  { parameter: "spent_total", name: "Gasto total" },
  { parameter: "innovativeness", name: "Innovación" },
  { parameter: "total_mana_spent_on_deving", name: "Puntos en desarrollo" },
  { parameter: "buildings_value", name: "Valor de edificios" },
  { parameter: "army_professionalism", name: "Profesionalismo" },
  { parameter: "total_casualties", name: "Bajas totales sufridas" },
  { parameter: "totalManaGainAverage", name: "Ganancia media de mana" },
  { parameter: "ideas", name: "Ideas" },
  { parameter: "tops", name: "Países TOP" },
];

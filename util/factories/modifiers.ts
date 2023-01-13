import IModifier from "../interfaces/IModifier";

export const getModifiers: Function = (): IModifier[] => [
  { parameter: "provinces", name: "Número de provincias" },
  { parameter: "total_development", name: "Desarrollo total" },
  { parameter: "inc_no_subs", name: "Ingresos totales sin subsidios" },
  { parameter: "spent_total", name: "Gasto total" },
  { parameter: "spent_on_subsidies", name: "Gasto total en subsidios" },
  { parameter: "spent_on_gifts", name: "Gasto total en regalos" },
  { parameter: "innovativeness", name: "Innovación" },
  { parameter: "dev_clicks", name: "Clicks en desarrollo" },
  { parameter: "total_mana_spent_on_deving", name: "Puntos en desarrollo" },
  { parameter: "buildings_value", name: "Valor de edificios" },
  { parameter: "FL", name: "Forcelimit" },
  { parameter: "max_manpower", name: "Manpower máximo" },
  { parameter: "manpower_recovery", name: "Recuperación de manpower" },
  { parameter: "army_professionalism", name: "Profesionalismo" },
  { parameter: "total_casualties", name: "Bajas terrestres totales sufridas" },
  { parameter: "navalCasualties", name: "Bajas navales totales sufridas" },
  { parameter: "totalManaGainAverage", name: "Ganancia media mensual de mana" },
  { parameter: "average_monarch_total", name: "Media del mana de todos los gobernantes" },
  { parameter: "ideas", name: "Ideas" },
  { parameter: "tops", name: "Países TOP" },
];

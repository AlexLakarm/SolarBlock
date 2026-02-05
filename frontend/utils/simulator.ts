// Logique de calcul du simulateur SolarBlock
// -----------------------------------------
// Ce module centralise les constantes, types et fonctions
// pour calculer le surplus, la production BTC et le ROI.

// Constantes globales (valeurs par défaut)
export const DEFAULT_BTC_PRICE = 70_000; // €
export const DEFAULT_DIFFICULTY = 1_400; // M TH/s
export const DEFAULT_ASIC_EFFICIENCY = 20; // J/TH
export const EDF_OA_RATE = 0.06; // €/kWh
export const SOLAR_BLOCK_MARGIN = 0.1; // 10 %
export const BLOCKS_PER_DAY = 144;
export const BLOCK_REWARD = 3.125; // BTC
export const SOLAR_RESOURCE = 1_200; // kWh/kWc/an (gisement)

// Types de configuration
export type ModuleConfig = {
  id: string;
  name: string;
  description: string;
  targetSurplusKw: number;
  costHardwareRef: number;
  costInstallation: number;
  monthlyLeasing: number;
  maintenanceRate: number;
  residualValue5Years: number;
};

export type ScenarioConfig = {
  id: string;
  name: string;
  description: string;
  installedPowerKwc: number; // Puissance crête installée (kWc)
  solarYield: number; // Gisement (kWh/kWc/an)
  selfConsumptionWinter: number; // % Autoconsommation hiver (0-100)
  selfConsumptionSummer: number; // % Autoconsommation été (0-100)
  exploitationHours: number; // Heures de minage par jour (moyenne)
  recommendedModuleId: string; // Module suggéré pour ce scénario
};

export type SimulationResult = {
  surplusKwhAnnual: number;
  btcMinedAnnual: number;
  revenueBtcBrut: number;
  revenueBtcNet: number;
  revenueEdf: number;
  gainVsEdfNet: number;
  leasingAnnualCost: number;
  realAnnualAdvantage: number;
  roiYears: number;
  cashflowYear1: number;
};

export const MODULES: ModuleConfig[] = [
  {
    id: "module_1",
    name: "Module 1 (10 kW)",
    description: "Idéal pour petites toitures (Écoles, PME)",
    targetSurplusKw: 10,
    costHardwareRef: 6_000,
    costInstallation: 5_400,
    monthlyLeasing: 104,
    maintenanceRate: 0.25,
    residualValue5Years: 1_008,
  },
  {
    id: "module_2",
    name: "Module 2 (50 kW)",
    description: "Pour Supermarchés et bâtiments moyens",
    targetSurplusKw: 50,
    costHardwareRef: 27_000,
    costInstallation: 9_600,
    monthlyLeasing: 468,
    maintenanceRate: 0.25,
    residualValue5Years: 4_538,
  },
  {
    id: "module_3",
    name: "Module 3 (100 kW)",
    description: "Pour Centres Commerciaux et Usines",
    targetSurplusKw: 100,
    costHardwareRef: 55_000,
    costInstallation: 15_600,
    monthlyLeasing: 953,
    maintenanceRate: 0.25,
    residualValue5Years: 9_244,
  },
  {
    id: "module_4",
    name: "Module 4 (150 kW)",
    description: "Pour grandes Fermes Solaires (ex: Scénario Trackers)",
    targetSurplusKw: 150,
    costHardwareRef: 82_000,
    costInstallation: 21_000,
    monthlyLeasing: 1_420,
    maintenanceRate: 0.25,
    residualValue5Years: 13_780,
  },
  {
    id: "module_5",
    name: "Module 5 (250 kW)",
    description: "Infrastructure industrielle haute puissance",
    targetSurplusKw: 250,
    costHardwareRef: 137_000,
    costInstallation: 32_000,
    monthlyLeasing: 2_380,
    maintenanceRate: 0.25,
    residualValue5Years: 23_000,
  },
];

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: "ecole",
    name: "Scénario 1 : École primaire",
    description: "Petite toiture, forte autoconsommation en hiver.",
    installedPowerKwc: 80,
    solarYield: 1_200,
    selfConsumptionWinter: 90,
    selfConsumptionSummer: 70,
    exploitationHours: 6,
    recommendedModuleId: "module_1",
  },
  {
    id: "supermarche",
    name: "Scénario 2 : Supermarché",
    description: "Moyenne surface, consommation stable.",
    installedPowerKwc: 550,
    solarYield: 1_200,
    selfConsumptionWinter: 90,
    selfConsumptionSummer: 80,
    exploitationHours: 6,
    recommendedModuleId: "module_2",
  },
  {
    id: "centre_commercial",
    name: "Scénario 3 : Centre commercial",
    description: "Grande toiture, gros volume de surplus.",
    installedPowerKwc: 1_300,
    solarYield: 1_200,
    selfConsumptionWinter: 90,
    selfConsumptionSummer: 85,
    exploitationHours: 6,
    recommendedModuleId: "module_3",
  },
  {
    id: "ferme_trackers",
    name: "Scénario 4 : Ferme avec trackers",
    description: "Production optimisée mais faible autoconsommation.",
    installedPowerKwc: 150,
    solarYield: 1_200,
    selfConsumptionWinter: 40,
    selfConsumptionSummer: 10,
    exploitationHours: 6,
    recommendedModuleId: "module_4",
  },
];

// 1. Calcul du surplus énergétique
export function computeSurplusKwhAnnual(
  scenario: ScenarioConfig,
  solarResourceOverride?: number,
): number {
  const solarYield = solarResourceOverride ?? scenario.solarYield ?? SOLAR_RESOURCE;
  const annualProductionKwh = scenario.installedPowerKwc * solarYield;
  const tacAveragePercent =
    (scenario.selfConsumptionWinter + scenario.selfConsumptionSummer) / 2;
  const tacAverage = tacAveragePercent / 100;
  const surplusAnnual = annualProductionKwh * (1 - tacAverage);
  return surplusAnnual;
}

export function computeAverageSurplusKw(
  surplusKwhAnnual: number,
  exploitationHours: number,
): number {
  // Surplus moyen disponible en kW
  return (surplusKwhAnnual / 365) / exploitationHours;
}

// 2. Calcul mining
export function computeHashrateThs(
  averageSurplusKw: number,
  asicEfficiencyJPerTh: number = DEFAULT_ASIC_EFFICIENCY,
): number {
  // Convertir kW en W
  const powerWatts = averageSurplusKw * 1_000;
  // Hashrate (TH/s) = Puissance (W) / (J/TH)
  return powerWatts / asicEfficiencyJPerTh;
}

export function computeBtcMinedAnnual(params: {
  hashrateThs: number;
  difficultyMTh: number;
}): number {
  const { hashrateThs, difficultyMTh } = params;

  if (difficultyMTh <= 0 || hashrateThs <= 0) return 0;

  // BTC annuel = (Hashrate × 144 blocs × 3.125 × 365) / (Difficulté × 10^6)
  return (
    (hashrateThs * BLOCKS_PER_DAY * BLOCK_REWARD * 365) /
    (difficultyMTh * 1_000_000)
  );
}

// 3. Comparaison financière & ROI
export function computeFinancials(params: {
  btcMinedAnnual: number;
  btcPrice: number;
  surplusKwhAnnual: number;
  module: ModuleConfig;
  edfRate?: number;
  solarBlockMargin?: number;
}): SimulationResult {
  const {
    btcMinedAnnual,
    btcPrice,
    surplusKwhAnnual,
    module,
    edfRate = EDF_OA_RATE,
    solarBlockMargin = SOLAR_BLOCK_MARGIN,
  } = params;

  const revenueBtcBrut = btcMinedAnnual * btcPrice;
  const marginSb = revenueBtcBrut * solarBlockMargin;
  const revenueBtcNet = revenueBtcBrut - marginSb;

  const revenueEdf = surplusKwhAnnual * edfRate;
  const gainVsEdfNet = revenueBtcNet - revenueEdf;

  const leasingAnnualCost = module.monthlyLeasing * 12;
  const realAnnualAdvantage = gainVsEdfNet - leasingAnnualCost;

  const installationCost = module.costInstallation;
  const roiYears =
    realAnnualAdvantage > 0 ? installationCost / realAnnualAdvantage : Infinity;

  const cashflowYear1 = realAnnualAdvantage - installationCost;

  return {
    surplusKwhAnnual,
    btcMinedAnnual,
    revenueBtcBrut,
    revenueBtcNet,
    revenueEdf,
    gainVsEdfNet,
    leasingAnnualCost,
    realAnnualAdvantage,
    roiYears,
    cashflowYear1,
  };
}

// Fonction utilitaire principale pour lancer une simulation complète
export function runSimulation(params: {
  scenarioId: string;
  moduleId: string;
  btcPrice?: number;
  difficultyMTh?: number;
  asicEfficiencyJPerTh?: number;
  edfRate?: number;
  solarBlockMargin?: number;
   solarResource?: number;
}): SimulationResult | null {
  const {
    scenarioId,
    moduleId,
    btcPrice = DEFAULT_BTC_PRICE,
    difficultyMTh = DEFAULT_DIFFICULTY,
    asicEfficiencyJPerTh = DEFAULT_ASIC_EFFICIENCY,
    edfRate,
    solarBlockMargin,
    solarResource = SOLAR_RESOURCE,
  } = params;

  const scenario = SCENARIOS.find((s) => s.id === scenarioId);
  const selectedModule = MODULES.find((m) => m.id === moduleId);

  if (!scenario || !selectedModule) return null;

  const surplusKwhAnnual = computeSurplusKwhAnnual(scenario, solarResource);
  const averageSurplusKw = computeAverageSurplusKw(
    surplusKwhAnnual,
    scenario.exploitationHours,
  );
  const hashrateThs = computeHashrateThs(averageSurplusKw, asicEfficiencyJPerTh);
  const btcMinedAnnual = computeBtcMinedAnnual({
    hashrateThs,
    difficultyMTh,
  });

  return computeFinancials({
    btcMinedAnnual,
    btcPrice,
    surplusKwhAnnual,
    module: selectedModule,
    edfRate,
    solarBlockMargin,
  });
}


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
  costHardware: number;
  costInstallation: number;
  leasingMonthly: number;
  maintenanceRate: number;
  residualValue5Years: number;
};

export type ScenarioConfig = {
  id: string;
  name: string;
  surplusTargetKw: number;
  installedPowerKwc: number;
  autoconsumptionWinter: number;
  autoconsumptionSummer: number;
  exploitationHours: number;
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

// Données d'exemple (placeholder) pour 3 modules et 3 scénarios.
// À adapter avec les vraies valeurs business.
export const MODULES: ModuleConfig[] = [
  {
    id: "module-1",
    name: "Module 1",
    costHardware: 6_000,
    costInstallation: 5_400,
    leasingMonthly: 104,
    maintenanceRate: 0.25,
    residualValue5Years: 1_008,
  },
  {
    id: "module-2",
    name: "Module 2",
    costHardware: 12_000,
    costInstallation: 9_000,
    leasingMonthly: 190,
    maintenanceRate: 0.25,
    residualValue5Years: 2_000,
  },
  {
    id: "module-3",
    name: "Module 3",
    costHardware: 18_000,
    costInstallation: 12_000,
    leasingMonthly: 260,
    maintenanceRate: 0.25,
    residualValue5Years: 3_000,
  },
];

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: "school",
    name: "École primaire",
    surplusTargetKw: 10,
    installedPowerKwc: 80,
    autoconsumptionWinter: 0.9,
    autoconsumptionSummer: 0.7,
    exploitationHours: 6,
  },
  {
    id: "supermarket",
    name: "Supermarché",
    surplusTargetKw: 30,
    installedPowerKwc: 250,
    autoconsumptionWinter: 0.85,
    autoconsumptionSummer: 0.6,
    exploitationHours: 8,
  },
  {
    id: "mall",
    name: "Centre commercial",
    surplusTargetKw: 80,
    installedPowerKwc: 600,
    autoconsumptionWinter: 0.8,
    autoconsumptionSummer: 0.55,
    exploitationHours: 10,
  },
];

// 1. Calcul du surplus énergétique
export function computeSurplusKwhAnnual(scenario: ScenarioConfig): number {
  const annualProductionKwh = scenario.installedPowerKwc * SOLAR_RESOURCE;
  const tacAverage =
    (scenario.autoconsumptionWinter + scenario.autoconsumptionSummer) / 2;
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

  const leasingAnnualCost = module.leasingMonthly * 12;
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
}): SimulationResult | null {
  const {
    scenarioId,
    moduleId,
    btcPrice = DEFAULT_BTC_PRICE,
    difficultyMTh = DEFAULT_DIFFICULTY,
    asicEfficiencyJPerTh = DEFAULT_ASIC_EFFICIENCY,
    edfRate,
    solarBlockMargin,
  } = params;

  const scenario = SCENARIOS.find((s) => s.id === scenarioId);
  const selectedModule = MODULES.find((m) => m.id === moduleId);

  if (!scenario || !selectedModule) return null;

  const surplusKwhAnnual = computeSurplusKwhAnnual(scenario);
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


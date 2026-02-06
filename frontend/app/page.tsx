"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DEFAULT_BTC_PRICE,
  DEFAULT_ASIC_EFFICIENCY,
  DEFAULT_DIFFICULTY,
  EDF_OA_RATE,
  MODULES,
  SCENARIOS,
  SOLAR_BLOCK_MARGIN,
  SOLAR_RESOURCE,
  runSimulation,
} from "@/utils/simulator";

const formatCurrency = (value: number | null | undefined) => {
  if (!value || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatYears = (value: number | null | undefined) => {
  if (!value || !Number.isFinite(value)) return "—";
  return value.toFixed(1);
};

/** Valeur numérique pour export CSV/Sheets (sans symbole €, séparateur décimal .) */
const formatNumberForExport = (value: number | null | undefined): string => {
  if (value == null || !Number.isFinite(value)) return "";
  return String(value);
};

/** Infobulle au survol pour expliquer un libellé */
function InfoBulle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`group relative inline-flex cursor-help ${className ?? ""}`}>
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-slate-500 text-[10px] text-slate-400 transition group-hover:border-slate-400 group-hover:text-slate-300">
        ?
      </span>
      <span className="pointer-events-none absolute left-0 bottom-full z-20 mb-1 hidden max-w-[260px] rounded-lg border border-slate-600 bg-slate-800 px-2.5 py-2 text-[11px] leading-relaxed text-slate-200 shadow-xl group-hover:block">
        {children}
      </span>
    </span>
  );
}

export default function Home() {
  const searchParams = useSearchParams();

  const initialScenarioId =
    searchParams.get("scenario") ?? SCENARIOS[0]?.id ?? "";
  const initialModuleId =
    searchParams.get("module") ?? MODULES[0]?.id ?? "";

  const [btcPrice, setBtcPrice] = useState<number>(DEFAULT_BTC_PRICE);
  const [difficulty, setDifficulty] = useState<number>(DEFAULT_DIFFICULTY);
  const [edfRate, setEdfRate] = useState<number>(EDF_OA_RATE);
  const [scenarioId, setScenarioId] = useState<string>(initialScenarioId);
  const [moduleId, setModuleId] = useState<string>(initialModuleId);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [asicEfficiency, setAsicEfficiency] =
    useState<number>(DEFAULT_ASIC_EFFICIENCY);
  const [solarResource, setSolarResource] =
    useState<number>(SOLAR_RESOURCE);
  const [margin, setMargin] =
    useState<number>(SOLAR_BLOCK_MARGIN * 100);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const result = useMemo(
    () =>
      runSimulation({
        scenarioId,
        moduleId,
        btcPrice,
        difficultyMTh: difficulty,
        edfRate,
        asicEfficiencyJPerTh: asicEfficiency,
        solarResource,
        solarBlockMargin: margin / 100,
      }),
    [btcPrice, difficulty, edfRate, scenarioId, moduleId, asicEfficiency, solarResource, margin],
  );

  const roiSafe = result?.roiYears ?? null;
  const annualAdvantageSafe = result?.realAnnualAdvantage ?? null;
  const gain5YearsSafe =
    result && Number.isFinite(result.realAnnualAdvantage)
      ? result.realAnnualAdvantage * 5
      : null;

  const roiBadgeColor =
    roiSafe && Number.isFinite(roiSafe)
      ? roiSafe < 2
        ? "text-emerald-400"
        : roiSafe > 5
          ? "text-amber-300"
          : "text-slate-100"
      : "text-slate-500";

  const selectedModule = MODULES.find((m) => m.id === moduleId);
  const selectedScenario = SCENARIOS.find((s) => s.id === scenarioId);

  // Données pour le graphique barres (Revenu minage net vs EDF)
  const comparisonChartData =
    result && Number.isFinite(result.revenueBtcNet) && Number.isFinite(result.revenueEdf)
      ? [
          {
            name: "Annuel",
            "Minage net": Math.max(0, Math.round(result.revenueBtcNet)),
            "EDF OA": Math.max(0, Math.round(result.revenueEdf)),
          },
        ]
      : [];

  // Tableau 5 ans
  const yearlyRows = useMemo(() => {
    if (!result || !selectedModule) return [];

    const rows: {
      year: number;
      initialCost: number;
      leasing: number;
      miningNet: number;
      edf: number;
      cashflow: number;
      cumulative: number;
    }[] = [];

    let cumulative = 0;

    for (let year = 1; year <= 5; year++) {
      const leasingAnnual = selectedModule.monthlyLeasing * 12;
      const miningNet = result.revenueBtcNet;
      const edf = result.revenueEdf;
      const advantage = result.realAnnualAdvantage;

      const initialCost = year === 1 ? selectedModule.costInstallation : 0;
      const cashflow =
        year === 1 ? advantage - selectedModule.costInstallation : advantage;

      cumulative += cashflow;

      rows.push({
        year,
        initialCost,
        leasing: leasingAnnual,
        miningNet,
        edf,
        cashflow,
        cumulative,
      });
    }

    return rows;
  }, [result, selectedModule]);

  // Tableau récap 100 % : lignes Libellé / Valeur (paramètres + scénario + module + KPIs)
  const recapRows = useMemo(() => {
    const rows: { label: string; value: string }[] = [];
    rows.push({ label: "Prix du BTC (€)", value: String(btcPrice) });
    rows.push({ label: "Difficulté réseau (EH/s)", value: String(difficulty) });
    rows.push({ label: "Tarif EDF OA (€/kWh)", value: String(edfRate) });
    rows.push({ label: "Scénario", value: selectedScenario?.name ?? scenarioId });
    rows.push({ label: "Module", value: selectedModule?.name ?? moduleId });
    rows.push({ label: "Efficacité ASIC (J/TH)", value: String(asicEfficiency) });
    rows.push({ label: "Gisement solaire (kWh/kWc/an)", value: String(solarResource) });
    rows.push({ label: "Marge SolarBlock (%)", value: String(margin) });
    if (selectedScenario) {
      rows.push({ label: "— Scénario : Puissance installée (kWc)", value: String(selectedScenario.installedPowerKwc) });
      rows.push({ label: "— Scénario : Gisement (kWh/kWc/an)", value: String(selectedScenario.solarYield) });
      rows.push({ label: "— Scénario : Autoconsommation hiver (%)", value: String(selectedScenario.selfConsumptionWinter) });
      rows.push({ label: "— Scénario : Autoconsommation été (%)", value: String(selectedScenario.selfConsumptionSummer) });
      rows.push({ label: "— Scénario : Heures exploitation/jour", value: String(selectedScenario.exploitationHours) });
    }
    if (selectedModule) {
      rows.push({ label: "— Module : Surplus cible (kW)", value: String(selectedModule.targetSurplusKw) });
      rows.push({ label: "— Module : CAPEX installation (€)", value: String(selectedModule.costInstallation) });
      rows.push({ label: "— Module : Leasing mensuel (€)", value: String(selectedModule.monthlyLeasing) });
      rows.push({ label: "— Module : Valeur résiduelle 5 ans (€)", value: String(selectedModule.residualValue5Years) });
    }
    if (result) {
      rows.push({ label: "Surplus annuel (kWh)", value: formatNumberForExport(result.surplusKwhAnnual) });
      rows.push({ label: "BTC minés (annuel)", value: formatNumberForExport(result.btcMinedAnnual) });
      rows.push({ label: "Revenu minage brut (€)", value: formatNumberForExport(result.revenueBtcBrut) });
      rows.push({ label: "Revenu minage net (€)", value: formatNumberForExport(result.revenueBtcNet) });
      rows.push({ label: "Revenu EDF OA (€)", value: formatNumberForExport(result.revenueEdf) });
      rows.push({ label: "Gain vs EDF net (€)", value: formatNumberForExport(result.gainVsEdfNet) });
      rows.push({ label: "Coût leasing annuel (€)", value: formatNumberForExport(result.leasingAnnualCost) });
      rows.push({ label: "Avantage annuel réel (€)", value: formatNumberForExport(result.realAnnualAdvantage) });
      rows.push({ label: "ROI (années)", value: formatYears(result.roiYears) });
      rows.push({ label: "Cashflow année 1 (€)", value: formatNumberForExport(result.cashflowYear1) });
      rows.push({ label: "Gain cumulé 5 ans (€)", value: formatNumberForExport(gain5YearsSafe) });
    }
    return rows;
  }, [btcPrice, difficulty, edfRate, scenarioId, moduleId, asicEfficiency, solarResource, margin, selectedScenario, selectedModule, result, gain5YearsSafe]);

  const buildCsvContent = (): string => {
    const sep = ";";
    const lines: string[] = ["Section;Libellé;Valeur"];
    recapRows.forEach((r) => lines.push(`Récap;${r.label.replace(/;/g, ",")};${r.value.replace(/;/g, ",")}`));
    lines.push("");
    lines.push("Année;Coût initial (€);Loyer leasing (€);Revenu minage net (€);Revenu EDF (€);Cashflow annuel (€);Trésorerie cumulée (€)");
    yearlyRows.forEach((row) => {
      lines.push([
        row.year,
        formatNumberForExport(row.initialCost),
        formatNumberForExport(row.leasing),
        formatNumberForExport(row.miningNet),
        formatNumberForExport(row.edf),
        formatNumberForExport(row.cashflow),
        formatNumberForExport(row.cumulative),
      ].join(sep));
    });
    return lines.join("\n");
  };

  const handleDownloadCsv = () => {
    const csv = buildCsvContent();
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solarblock-recap-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyForSheets = async () => {
    const sep = "\t";
    const lines: string[] = ["Libellé\tValeur"];
    recapRows.forEach((r) => lines.push(`${r.label}\t${r.value}`));
    lines.push("");
    lines.push("Année\tCoût initial (€)\tLoyer leasing (€)\tRevenu minage net (€)\tRevenu EDF (€)\tCashflow annuel (€)\tTrésorerie cumulée (€)");
    yearlyRows.forEach((row) => {
      lines.push([
        row.year,
        formatNumberForExport(row.initialCost),
        formatNumberForExport(row.leasing),
        formatNumberForExport(row.miningNet),
        formatNumberForExport(row.edf),
        formatNumberForExport(row.cashflow),
        formatNumberForExport(row.cumulative),
      ].join(sep));
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      setCopyFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:py-10">
        {/* Sidebar paramètres */}
        <aside className="w-full shrink-0 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-slate-950/40 md:w-80">
          <div className="mb-6">
            <h1 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              SolarBlock
            </h1>
            <p className="mt-2 text-lg font-semibold text-slate-50">
              Simulateur de rentabilité
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Configurez vos hypothèses pour comparer Minage vs EDF OA.
            </p>
          </div>

          <div className="space-y-5">
            {/* Paramètres globaux */}
            <section className="space-y-3">
              <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Paramètres globaux
              </h2>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                    Prix du BTC (€)
                    <InfoBulle>
                      Cours du Bitcoin utilisé pour valoriser les revenus minés. Hypothèse de travail pour la simulation.
                    </InfoBulle>
                  </label>
                  <input
                    type="number"
                    value={btcPrice}
                    onChange={(event) =>
                      setBtcPrice(Number(event.target.value) || 0)
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                    Difficulté réseau (EH/s)
                    <InfoBulle>
                      Unité : EH/s (Exahash/seconde). Une valeur de 1400 correspond à une hypothèse prudente (environ ×2 la difficulté actuelle), montrant que le modèle reste rentable même si la concurrence mondiale double.
                    </InfoBulle>
                  </label>
                  <input
                    type="number"
                    value={difficulty}
                    onChange={(event) =>
                      setDifficulty(Number(event.target.value) || 0)
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                    Tarif EDF OA (€/kWh)
                    <InfoBulle>
                      Tarif de revente du surplus d&apos;électricité à EDF Obligation d&apos;Achat (environ 0,06 €/kWh). C&apos;est la solution de référence à laquelle on compare le minage.
                    </InfoBulle>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={edfRate}
                    onChange={(event) =>
                      setEdfRate(Number(event.target.value) || 0)
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>
            </section>

            {/* Sélecteurs scénario & module */}
            <section className="space-y-3">
              <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Profil client
              </h2>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                    Scénario
                    <InfoBulle>
                      Profil type (puissance installée, gisement solaire, autoconsommation hiver/été) qui détermine le surplus d&apos;électricité disponible pour le minage.
                    </InfoBulle>
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                    value={scenarioId}
                    onChange={(event) => setScenarioId(event.target.value)}
                  >
                    {SCENARIOS.map((scenario) => (
                      <option key={scenario.id} value={scenario.id}>
                        {scenario.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                    Module
                    <InfoBulle>
                      Configuration ASIC (puissance d&apos;absorption, CAPEX installation, leasing mensuel). Le dimensionnement doit correspondre au surplus du scénario pour une marge de sécurité technique.
                    </InfoBulle>
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                    value={moduleId}
                    onChange={(event) => setModuleId(event.target.value)}
                  >
                    {MODULES.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <Link
              href="/scenarios"
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-100 transition hover:border-emerald-400 hover:bg-slate-900"
            >
              Voir les scénarios types
            </Link>
            <Link
              href="/modules"
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-100 transition hover:border-emerald-400 hover:bg-slate-900"
            >
              Voir les modules ASIC
            </Link>

            {/* Mode avancé */}
            <section className="space-y-3 border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Mode avancé
                </h2>
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-400">
                  <span>Afficher</span>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
                      showAdvanced
                        ? "border-emerald-500 bg-emerald-500/30"
                        : "border-slate-600 bg-slate-900"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${
                        showAdvanced ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              </div>

              {showAdvanced && (
                <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                      Efficacité ASIC (J/TH)
                      <InfoBulle>
                        Consommation électrique en joules par TH/s. Plus ce chiffre est bas, plus les machines sont efficaces (ex. 20 J/TH). Détermine le hashrate pour un surplus donné.
                      </InfoBulle>
                    </label>
                    <input
                      type="number"
                      value={asicEfficiency}
                      onChange={(event) =>
                        setAsicEfficiency(Number(event.target.value) || 0)
                      }
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-0 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                      Gisement solaire (kWh/kWc/an)
                      <InfoBulle>
                        Production solaire annuelle typique en kWh par kWc installé (ex. 1200 kWh/kWc/an en France). Utilisé pour calculer le surplus à partir de la puissance installée du scénario.
                      </InfoBulle>
                    </label>
                    <input
                      type="number"
                      value={solarResource}
                      onChange={(event) =>
                        setSolarResource(Number(event.target.value) || 0)
                      }
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-0 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                      Marge SolarBlock (%)
                      <InfoBulle>
                        Commission prélevée sur le revenu minage brut (10 %). Le client perçoit 90 % des revenus BTC ; SolarBlock reste propriétaire du matériel et assure la maintenance.
                      </InfoBulle>
                    </label>
                    <input
                      type="number"
                      value={margin}
                      onChange={(event) =>
                        setMargin(Number(event.target.value) || 0)
                      }
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-0 transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  <p className="pt-1 text-[10px] leading-relaxed text-slate-500">
                    Ces paramètres permettent d&apos;ajuster les hypothèses
                    techniques du modèle (efficacité du hardware, gisement
                    solaire moyen, marge SolarBlock) pour coller à la réalité du
                    site client.
                  </p>
                </div>
              )}
            </section>
          </div>
        </aside>

        {/* Zone principale résultats */}
        <main className="flex-1 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/90 p-5 shadow-[0_0_60px_rgba(0,0,0,0.75)] md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-50 md:text-2xl">
                Résultats de la simulation
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Les KPIs, le tableau 5 ans et la comparaison Minage vs EDF se
                mettent à jour en temps réel.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              Simulation en temps réel – ajustez les paramètres
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                ROI estimé
                <InfoBulle>
                  Temps de retour sur investissement : CAPEX installation ÷ Avantage annuel réel. En dessous de 2 ans, le projet est considéré comme très rentable pour les investisseurs.
                </InfoBulle>
              </p>
              <p className="mt-3 text-3xl font-semibold text-emerald-400">
                <span className={roiBadgeColor}>
                  {formatYears(roiSafe)}{" "}
                  {Number.isFinite(roiSafe ?? NaN) && "ans"}
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Temps de retour sur investissement basé sur l&apos;avantage
                net par rapport à EDF OA.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                Avantage annuel réel
                <InfoBulle>
                  Gain net annuel après marge SolarBlock et leasing : (Revenu minage net − Revenu EDF) − Loyer leasing annuel. C&apos;est le flux de trésorerie annuel supplémentaire par rapport à la revente EDF.
                </InfoBulle>
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-100">
                {formatCurrency(annualAdvantageSafe)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Différence nette entre Minage et EDF OA après leasing.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                Gain cumulé sur 5 ans
                <InfoBulle>
                  Projection : Avantage annuel réel × 5 ans. Hypothèse de flux constants (cours BTC et difficulté non réajustés). À mettre en regard du coût d&apos;installation pour illustrer la rentabilité sur la durée.
                </InfoBulle>
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-100">
                {formatCurrency(gain5YearsSafe)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Projection à horizon 5 ans (hors variation BTC/difficulté).
              </p>
            </div>
          </div>

          {/* Tableau détaillé sur 5 ans */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
            <div className="border-b border-slate-800 px-4 py-3">
              <p className="text-sm font-medium text-slate-100">
                Projection sur 5 ans
              </p>
              <p className="text-xs text-slate-500">
                Cashflow annuel et cumulé pour la solution Minage vs revenu EDF
              </p>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-900/80">
                  <tr>
                    <th className="px-4 py-3 font-medium">Année</th>
                    <th className="px-4 py-3 font-medium">Coût initial</th>
                    <th className="px-4 py-3 font-medium">Loyer leasing</th>
                    <th className="px-4 py-3 font-medium">Revenu minage net</th>
                    <th className="px-4 py-3 font-medium">Revenu EDF</th>
                    <th className="px-4 py-3 font-medium">Cashflow annuel</th>
                    <th className="px-4 py-3 font-medium">
                      Trésorerie cumulée
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-6 text-center text-slate-500"
                      >
                        Les données de simulation apparaîtront ici dès que les
                        paramètres seront valides.
                      </td>
                    </tr>
                  ) : (
                    yearlyRows.map((row) => (
                      <tr
                        key={row.year}
                        className="border-t border-slate-900/80 hover:bg-slate-900/60"
                      >
                        <td className="px-4 py-3 text-slate-200">
                          {row.year}
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(row.initialCost)}
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(row.leasing)}
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(row.miningNet)}
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(row.edf)}
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(row.cashflow)}
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(row.cumulative)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Graphique comparaison Minage vs EDF */}
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-100">
                  Revenu annuel : Minage vs EDF OA
                </p>
                <p className="text-xs text-slate-500">
                  Visualisation comparative du revenu brut net minage et du
                  revenu EDF sur la base des paramètres actuels.
                </p>
              </div>
            </div>
            {comparisonChartData.length === 0 ? (
              <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/60 text-xs text-slate-500">
                Ajustez les paramètres pour afficher le graphique comparatif.
              </div>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonChartData}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1f2937"
                      vertical={false}
                    />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis
                      stroke="#9ca3af"
                      tickFormatter={(value) =>
                        `${Math.round(value / 1_000)}k`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        borderColor: "#1f2937",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(value: number) =>
                        formatCurrency(Number(value))
                      }
                    />
                    <Legend />
                    <Bar dataKey="Minage net" fill="#22c55e" radius={6} />
                    <Bar dataKey="EDF OA" fill="#38bdf8" radius={6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Tableau récapitulatif 100 % + export Sheets/CSV */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
            <div className="flex flex-col gap-3 border-b border-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-100">
                  Tableau récapitulatif (100 % des éléments)
                </p>
                <p className="text-xs text-slate-500">
                  Paramètres, scénario, module, KPIs et détail 5 ans — exportable en CSV ou à coller dans Google Sheets.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:border-emerald-400 hover:bg-slate-700"
                >
                  Télécharger CSV
                </button>
                <button
                  type="button"
                  onClick={handleCopyForSheets}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500"
                >
                  {copyFeedback ? "Copié !" : "Copier pour Sheets"}
                </button>
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-900/80">
                  <tr>
                    <th className="px-4 py-2 font-medium text-slate-400">Libellé</th>
                    <th className="px-4 py-2 font-medium text-slate-400">Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {recapRows.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-4 text-center text-slate-500">
                        Ajustez les paramètres pour afficher le récapitulatif.
                      </td>
                    </tr>
                  ) : (
                    recapRows.map((row, i) => (
                      <tr key={i} className="border-t border-slate-900/80">
                        <td className="px-4 py-2 text-slate-300">{row.label}</td>
                        <td className="px-4 py-2 font-medium text-slate-100">{row.value}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {yearlyRows.length > 0 && (
              <>
                <div className="border-t border-slate-800 px-4 py-2">
                  <p className="text-xs font-medium text-slate-400">Détail par année (5 ans)</p>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full text-left text-xs text-slate-300">
                    <thead className="border-b border-slate-800 bg-slate-900/80">
                      <tr>
                        <th className="px-4 py-2 font-medium">Année</th>
                        <th className="px-4 py-2 font-medium">Coût initial</th>
                        <th className="px-4 py-2 font-medium">Loyer leasing</th>
                        <th className="px-4 py-2 font-medium">Revenu minage net</th>
                        <th className="px-4 py-2 font-medium">Revenu EDF</th>
                        <th className="px-4 py-2 font-medium">Cashflow annuel</th>
                        <th className="px-4 py-2 font-medium">Trésorerie cumulée</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyRows.map((row) => (
                        <tr key={row.year} className="border-t border-slate-900/80">
                          <td className="px-4 py-2 text-slate-200">{row.year}</td>
                          <td className="px-4 py-2">{formatCurrency(row.initialCost)}</td>
                          <td className="px-4 py-2">{formatCurrency(row.leasing)}</td>
                          <td className="px-4 py-2">{formatCurrency(row.miningNet)}</td>
                          <td className="px-4 py-2">{formatCurrency(row.edf)}</td>
                          <td className="px-4 py-2">{formatCurrency(row.cashflow)}</td>
                          <td className="px-4 py-2">{formatCurrency(row.cumulative)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-[11px] text-slate-500">
            Les résultats fournis par ce simulateur sont indicatifs et dépendent
            fortement de la difficulté du réseau Bitcoin et de l&apos;évolution du
            cours. Ils ne constituent pas une garantie de performance.
          </p>
        </main>
      </div>
    </div>
  );
}

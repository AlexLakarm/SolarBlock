"use client";

import { useMemo, useState } from "react";
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
  DEFAULT_DIFFICULTY,
  EDF_OA_RATE,
  MODULES,
  SCENARIOS,
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

export default function Home() {
  const [btcPrice, setBtcPrice] = useState<number>(DEFAULT_BTC_PRICE);
  const [difficulty, setDifficulty] = useState<number>(DEFAULT_DIFFICULTY);
  const [edfRate, setEdfRate] = useState<number>(EDF_OA_RATE);
  const [scenarioId, setScenarioId] = useState<string>(SCENARIOS[0]?.id ?? "");
  const [moduleId, setModuleId] = useState<string>(MODULES[0]?.id ?? "");

  const result = useMemo(
    () =>
      runSimulation({
        scenarioId,
        moduleId,
        btcPrice,
        difficultyMTh: difficulty,
        edfRate,
      }),
    [btcPrice, difficulty, edfRate, scenarioId, moduleId],
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
      const leasingAnnual = selectedModule.leasingMonthly * 12;
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
                  <label className="text-xs font-medium text-slate-300">
                    Prix du BTC (€)
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
                  <label className="text-xs font-medium text-slate-300">
                    Difficulté réseau
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
                  <label className="text-xs font-medium text-slate-300">
                    Tarif EDF OA (€/kWh)
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
                  <label className="text-xs font-medium text-slate-300">
                    Scénario
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
                  <label className="text-xs font-medium text-slate-300">
                    Module
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

            <p className="pt-2 text-[11px] leading-relaxed text-slate-500">
              Les calculs détaillés (surplus, minage, ROI) seront implémentés
              dans les prochaines étapes. Cette interface sert de base pour le
              simulateur SolarBlock.
            </p>
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
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                ROI estimé
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
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Avantage annuel réel
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-100">
                {formatCurrency(annualAdvantageSafe)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Différence nette entre Minage et EDF OA après leasing.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Gain cumulé sur 5 ans
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

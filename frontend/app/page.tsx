 "use client";

import { useMemo, useState } from "react";
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
                Les KPIs (ROI, avantage annuel, comparaison Minage vs EDF) seront
                affichés ici.
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

          <div className="mt-8 flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-sm text-slate-500">
            Zone graphique / tableau comparatif Minage vs EDF<br />
            <span className="text-xs text-slate-600">
              (Seront implémentés à l&apos;étape &quot;KPIs + graphiques&quot;)
            </span>
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

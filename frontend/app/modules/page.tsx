"use client";

import Link from "next/link";
import { MODULES } from "@/utils/simulator";

export default function ModulesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              SolarBlock
            </p>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">
              Modules ASIC SolarBlock
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Détail des configurations de puissance proposées pour absorber le
              surplus photovoltaïque.
            </p>
          </div>

          <Link
            href="/simulateur"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-emerald-400 hover:bg-slate-900"
          >
            Retour au simulateur
          </Link>
        </header>

        <main className="grid gap-4 md:grid-cols-2">
          {MODULES.map((module) => {
            const href = `/simulateur?module=${module.id}`;

            return (
              <article
                key={module.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40"
              >
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-slate-50">
                    {module.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {module.description}
                  </p>

                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-300">
                    <div>
                      <dt className="text-slate-500">Surplus cible</dt>
                      <dd className="font-medium">
                        {module.targetSurplusKw.toLocaleString("fr-FR")} kW
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">CAPEX (hardware ref.)</dt>
                      <dd className="font-medium">
                        {module.costHardwareRef.toLocaleString("fr-FR")} €
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">CAPEX installation</dt>
                      <dd className="font-medium">
                        {module.costInstallation.toLocaleString("fr-FR")} €
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Leasing mensuel</dt>
                      <dd className="font-medium">
                        {module.monthlyLeasing.toLocaleString("fr-FR")} €/mois
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Maintenance</dt>
                      <dd className="font-medium">
                        {(module.maintenanceRate * 100).toFixed(0)} % / an
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Valeur résiduelle (5 ans)</dt>
                      <dd className="font-medium">
                        {module.residualValue5Years.toLocaleString("fr-FR")} €
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <p className="text-[10px] text-slate-500">
                    Sélectionnez ce module pour tester la capacité d&apos;absorption
                    de surplus sur un cas client donné.
                  </p>
                  <Link
                    href={href}
                    className="inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-slate-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-400"
                  >
                    Charger dans le simulateur
                  </Link>
                </div>
              </article>
            );
          })}
        </main>
      </div>
    </div>
  );
}


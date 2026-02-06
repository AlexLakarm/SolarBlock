"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Area,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const chartData = [
  { t: "6h", prod: 15, conso: 45 },
  { t: "8h", prod: 45, conso: 50 },
  { t: "10h", prod: 80, conso: 52 },
  { t: "12h", prod: 100, conso: 48 },
  { t: "14h", prod: 95, conso: 55 },
  { t: "16h", prod: 70, conso: 50 },
  { t: "18h", prod: 35, conso: 42 },
  { t: "20h", prod: 10, conso: 30 },
].map((d) => ({
  ...d,
  surplus: Math.max(0, d.prod - d.conso),
}));

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function AnimatedText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0c1222] text-slate-100">
      <nav className="fixed left-0 right-0 top-0 z-10 border-b border-slate-800/80 bg-[#0c1222]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-sm font-semibold uppercase tracking-widest text-slate-300 hover:text-white">
            SolarBlock
          </Link>
          <Link
            href="/simulateur"
            className="rounded-full border border-slate-600 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-emerald-500 hover:bg-slate-800 hover:text-white"
          >
            Simulateur
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden px-4 pt-20 pb-28 md:pt-28 md:pb-36">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[120%] -translate-x-1/2 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Transformer l&apos;énergie solaire inutilisée en{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Or Numérique
            </span>
            .
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-lg text-slate-300 md:text-xl"
          >
            Votre parking devient une centrale de production d&apos;actifs.
            Rentabilisez vos ombrières photovoltaïques obligatoires 2 à 3 fois
            plus vite qu&apos;avec la revente EDF.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10"
          >
            <Link
              href="/simulateur"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
            >
              Calculer mon potentiel de gain
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Loi APER */}
      <Section className="border-t border-slate-800 bg-slate-900/30 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <AnimatedText>
            <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
              Quand Contrainte Réglementaire rime avec Opportunité
            </h2>
          </AnimatedText>
          <AnimatedText>
            <p className="mt-6 text-center text-slate-300">
              La Loi APER vous oblige à équiper vos parkings d&apos;ombrières.
            </p>
          </AnimatedText>
          <AnimatedText>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-8">
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 px-6 py-4 text-center">
                <p className="text-sm font-medium text-amber-400">Juillet 2026</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  Parkings &gt; 10 000 m²
                </p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 px-6 py-4 text-center">
                <p className="text-sm font-medium text-amber-400">Juillet 2028</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  Parkings &gt; 1 500 m²
                </p>
              </div>
            </div>
          </AnimatedText>
          <AnimatedText>
            <p className="mt-10 text-center text-slate-400">
              Des milliers d&apos;entreprises vont devoir investir. Ne faites pas
              de cet investissement une charge, faites-en un{" "}
              <strong className="text-emerald-400">levier de croissance</strong>.
            </p>
          </AnimatedText>
        </div>
      </Section>

      {/* Le Problème - Graphique surplus perdu */}
      <Section className="border-t border-slate-800 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <AnimatedText>
            <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
              Le paradoxe du surplus énergétique
            </h2>
          </AnimatedText>
          <AnimatedText>
            <p className="mt-6 text-center text-slate-300">
              L&apos;énergie solaire est intermittente et décalée de votre
              consommation. Ce surplus est aujourd&apos;hui revendu au réseau
              pour un rendement financier extrêmement faible.
            </p>
          </AnimatedText>
          <AnimatedText>
            <div className="mt-10 h-64 rounded-2xl border border-slate-700 bg-slate-900/50 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="surplusPerte" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#7f1d1d" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" kW" />
                  {/* Sous la courbe conso : fond (invisible) pour que le surplus soit bien entre les deux courbes */}
                  <Area
                    type="monotone"
                    dataKey="conso"
                    stackId="band"
                    fill="transparent"
                    stroke="none"
                    isAnimationActive={false}
                  />
                  {/* Zone surplus = entre conso et prod (stack au-dessus de conso) */}
                  <Area
                    type="monotone"
                    dataKey="surplus"
                    stackId="band"
                    fill="url(#surplusPerte)"
                    stroke="none"
                    name="Surplus (revendu EDF)"
                  />
                  <Line
                    type="monotone"
                    dataKey="prod"
                    stroke="#eab308"
                    strokeWidth={2}
                    dot={false}
                    name="Production solaire"
                  />
                  <Line
                    type="monotone"
                    dataKey="conso"
                    stroke="#f1f5f9"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Consommation"
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </ComposedChart>
              </ResponsiveContainer>
              <p className="mt-2 text-center text-xs text-red-400/90">
                Zone rouge = énergie bradée à EDF (entre les deux courbes)
              </p>
            </div>
          </AnimatedText>
        </div>
      </Section>

      {/* La Solution SolarBlock */}
      <Section className="border-t border-slate-800 bg-slate-900/30 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <AnimatedText>
            <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
              L&apos;Intelligence Artificielle au service de votre rentabilité
            </h2>
          </AnimatedText>
          <AnimatedText>
            <p className="mt-6 text-center text-slate-300">
              Notre algorithme propriétaire active nos unités de calcul
              (miners) uniquement lorsque l&apos;énergie verte n&apos;est pas
              auto-consommée.
            </p>
          </AnimatedText>
          <AnimatedText>
            <div className="mt-10 h-64 rounded-2xl border border-slate-700 bg-slate-900/50 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="surplusOr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fcd34d" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#b45309" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" kW" />
                  <Area
                    type="monotone"
                    dataKey="conso"
                    stackId="band"
                    fill="transparent"
                    stroke="none"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="surplus"
                    stackId="band"
                    fill="url(#surplusOr)"
                    stroke="none"
                    name="Surplus monétisé (SolarBlock)"
                  />
                  <Line
                    type="monotone"
                    dataKey="prod"
                    stroke="#eab308"
                    strokeWidth={2}
                    dot={false}
                    name="Production solaire"
                  />
                  <Line
                    type="monotone"
                    dataKey="conso"
                    stroke="#f1f5f9"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Consommation"
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </ComposedChart>
              </ResponsiveContainer>
              <p className="mt-2 text-center text-xs text-amber-400/90">
                Zone dorée = surplus transformé en actif (Bitcoin), entre les deux courbes
              </p>
            </div>
          </AnimatedText>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <AnimatedText>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                <p className="font-semibold text-emerald-400">Rentabilité</p>
                <p className="mt-2 text-sm text-slate-300">
                  Monétisez chaque kWh excédentaire 2 à 3× plus cher que le
                  tarif d&apos;achat.
                </p>
              </div>
            </AnimatedText>
            <AnimatedText>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                <p className="font-semibold text-amber-400">Image</p>
                <p className="mt-2 text-sm text-slate-300">
                  Validez votre stratégie RSE : Énergie Renouvelable + Innovation
                  Blockchain.
                </p>
              </div>
            </AnimatedText>
            <AnimatedText>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
                <p className="font-semibold text-sky-400">Sérénité</p>
                <p className="mt-2 text-sm text-slate-300">
                  SolarBlock gère tout : installation, gestion automatisée et
                  maintenance.
                </p>
              </div>
            </AnimatedText>
          </div>
        </div>
      </Section>

      {/* Pédagogie Bitcoin */}
      <Section className="border-t border-slate-800 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-950/20 to-transparent px-6 py-12 md:px-12">
            <AnimatedText>
              <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
                Le Bitcoin : Une réserve de valeur numérique
              </h2>
            </AnimatedText>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <AnimatedText>
                <div className="flex flex-col items-center text-center">
                  <span className="text-2xl">🛡️</span>
                  <p className="mt-2 font-semibold text-amber-300">Solide</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Impossible à contrefaire.
                  </p>
                </div>
              </AnimatedText>
              <AnimatedText>
                <div className="flex flex-col items-center text-center">
                  <span className="text-2xl">🌍</span>
                  <p className="mt-2 font-semibold text-amber-300">Décentralisé</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Échange de pair-à-pair, sans intermédiaire.
                  </p>
                </div>
              </AnimatedText>
              <AnimatedText>
                <div className="flex flex-col items-center text-center">
                  <span className="text-2xl">💎</span>
                  <p className="mt-2 font-semibold text-amber-300">Rare</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Quantité fixée à 21 millions d&apos;unités. Jamais plus.
                  </p>
                </div>
              </AnimatedText>
            </div>
            <AnimatedText>
              <p className="mt-10 text-center text-slate-300">
                Contrairement à l&apos;or, il s&apos;échange instantanément. Vos
                excédents solaires sont transformés en un actif financier liquide
                et auditable.
              </p>
            </AnimatedText>
          </div>
        </div>
      </Section>

      {/* Business model */}
      <Section className="border-t border-slate-800 bg-slate-900/30 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <AnimatedText>
            <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
              Un modèle transparent
            </h2>
          </AnimatedText>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <AnimatedText>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6">
                <p className="font-semibold text-emerald-400">Pour vous (client)</p>
                <p className="mt-3 text-sm text-slate-300">
                  Vous êtes propriétaire du matériel. Vous recevez les revenus
                  (Euro ou BTC) chaque semaine.
                </p>
              </div>
            </AnimatedText>
            <AnimatedText>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6">
                <p className="font-semibold text-amber-400">Pour nous (SolarBlock)</p>
                <p className="mt-3 text-sm text-slate-300">
                  Nous facturons l&apos;installation (CAPEX) et prélevons une
                  commission de performance sur les BTC générés. Algorithme de
                  modulation automatique inclus.
                </p>
              </div>
            </AnimatedText>
          </div>
        </div>
      </Section>

      {/* Footer CTA */}
      <footer className="border-t border-slate-800 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-slate-300 md:text-xl"
          >
            Rejoignez le tsunami de l&apos;installation PV en entreprise.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-8"
          >
            <Link
              href="/simulateur"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
            >
              Accéder au Simulateur de Rentabilité
            </Link>
          </motion.div>
          <p className="mt-8 text-xs text-slate-500">
            © SolarBlock — Transformer la contrainte réglementaire en opportunité.
          </p>
        </div>
      </footer>
    </div>
  );
}

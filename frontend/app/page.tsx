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
  initial: { opacity: 0, y: 16 },
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
  const inView = useInView(ref, { once: true, amount: 0.08, margin: "40px" });
  return (
    <motion.section
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={{ initial: {}, animate: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } } }}
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
    <div className="relative min-h-screen text-slate-200">
      {/* Arrière-plan : blobs + gradient mesh + bruit */}
      <div className="landing-bg" aria-hidden="true">
        <div className="landing-bg-mesh" />
        <div className="landing-bg-blob landing-bg-blob-1" />
        <div className="landing-bg-blob landing-bg-blob-2" />
        <div className="landing-bg-noise" />
      </div>

      <main className="relative z-0">
      <nav className="fixed left-0 right-0 top-0 z-10 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-sm font-semibold uppercase tracking-widest text-slate-300 hover:text-slate-100">
            SolarBlock
          </Link>
          <Link
            href="/simulateur"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur-sm transition hover:scale-105 hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:text-white"
          >
            Simulateur
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden px-4 pt-24 pb-32 md:pt-32 md:pb-44">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[120%] -translate-x-1/2 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-medium tracking-tight text-slate-100 md:text-5xl lg:text-6xl"
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
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-105 hover:bg-emerald-400 hover:shadow-emerald-500/40"
            >
              Calculer mon potentiel de gain
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Loi APER - Glassmorphism */}
      <Section className="px-4 py-24 md:py-36">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-8 backdrop-blur-md md:p-12">
            <AnimatedText>
              <h2 className="text-center text-4xl font-medium tracking-tight text-slate-200 md:text-5xl">
                Quand Contrainte Réglementaire rime avec Opportunité
              </h2>
            </AnimatedText>
            <AnimatedText>
              <p className="mt-8 text-center text-slate-300">
                La Loi APER vous oblige à équiper vos parkings d&apos;ombrières.
              </p>
            </AnimatedText>
            <AnimatedText>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-8">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-4 text-center backdrop-blur-sm">
                  <p className="text-sm font-medium text-amber-400">Juillet 2026</p>
                  <p className="mt-1 text-lg font-semibold text-slate-200">
                    Parkings &gt; 10 000 m²
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-4 text-center backdrop-blur-sm">
                  <p className="text-sm font-medium text-amber-400">Juillet 2028</p>
                  <p className="mt-1 text-lg font-semibold text-slate-200">
                    Parkings &gt; 1 500 m²
                  </p>
                </div>
              </div>
            </AnimatedText>
            <AnimatedText>
              <p className="mt-12 text-center text-slate-400">
                Des milliers d&apos;entreprises vont devoir investir. Ne faites pas
                de cet investissement une charge, faites-en un{" "}
                <strong className="text-emerald-400">levier de croissance</strong>.
              </p>
            </AnimatedText>
          </div>
        </div>
      </Section>

      {/* Le Problème - Graphique surplus perdu */}
      <Section className="px-4 py-24 md:py-36">
        <div className="mx-auto max-w-4xl">
          <AnimatedText>
            <h2 className="text-center text-4xl font-medium tracking-tight text-slate-200 md:text-5xl">
              Le paradoxe du surplus énergétique
            </h2>
          </AnimatedText>
          <AnimatedText>
            <p className="mt-8 text-center text-slate-300">
              L&apos;énergie solaire est intermittente et décalée de votre
              consommation. Ce surplus est aujourd&apos;hui revendu au réseau
              pour un rendement financier extrêmement faible.
            </p>
          </AnimatedText>
          <AnimatedText>
            <div className="landing-chart-draw mt-12 min-h-[16rem] w-full rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-md md:min-h-[18rem]">
              <ResponsiveContainer width="100%" height={280}>
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
      <Section className="px-4 py-24 md:py-36">
        <div className="mx-auto max-w-4xl">
          <AnimatedText>
            <h2 className="text-center text-4xl font-medium tracking-tight text-slate-200 md:text-5xl">
              L&apos;Intelligence Artificielle au service de votre rentabilité
            </h2>
          </AnimatedText>
          <AnimatedText>
            <p className="mt-8 text-center text-slate-300">
              Notre algorithme propriétaire active nos unités de calcul
              (miners) uniquement lorsque l&apos;énergie verte n&apos;est pas
              auto-consommée.
            </p>
          </AnimatedText>
          <AnimatedText>
            <div className="landing-chart-draw mt-12 min-h-[16rem] w-full rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-md md:min-h-[18rem]">
              <ResponsiveContainer width="100%" height={280}>
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
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <AnimatedText>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
                <p className="font-semibold text-emerald-400">Rentabilité</p>
                <p className="mt-2 text-sm text-slate-300">
                  Monétisez chaque kWh excédentaire 2 à 3× plus cher que le
                  tarif d&apos;achat.
                </p>
              </div>
            </AnimatedText>
            <AnimatedText>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
                <p className="font-semibold text-amber-400">Image</p>
                <p className="mt-2 text-sm text-slate-300">
                  Validez votre stratégie RSE : Énergie Renouvelable + Innovation
                  Blockchain.
                </p>
              </div>
            </AnimatedText>
            <AnimatedText>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
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

      {/* Pédagogie Bitcoin - Glassmorphism + grille (affichage statique, sans animation) */}
      <section className="px-4 py-24 md:py-36">
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/[0.08] p-8 backdrop-blur-md md:p-12">
          <h2 className="text-center text-4xl font-medium tracking-tight text-slate-200 md:text-5xl">
            Le Bitcoin : Une réserve de valeur numérique
          </h2>
          <p className="mt-6 text-center text-slate-300 md:text-lg">
            Qu&apos;est-ce que le Bitcoin ? Définition selon Yves Choueifaty :
          </p>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col rounded-xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10 text-2xl shadow-[0_0_24px_rgba(251,191,36,0.15)]">💳</span>
              <p className="mt-4 text-lg font-semibold text-amber-300 md:text-xl">Actif numérique</p>
              <p className="mt-2 text-base leading-relaxed text-slate-400">
                Comme l&apos;essentiel des euros en circulation.
              </p>
            </div>
            <div className="flex flex-col rounded-xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10 text-2xl shadow-[0_0_24px_rgba(251,191,36,0.15)]">🛡️</span>
              <p className="mt-4 text-lg font-semibold text-amber-300 md:text-xl">Solide</p>
              <p className="mt-2 text-base leading-relaxed text-slate-400">
                Il est impossible de produire de faux Bitcoin.
              </p>
            </div>
            <div className="flex flex-col rounded-xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10 text-2xl shadow-[0_0_24px_rgba(251,191,36,0.15)]">🌍</span>
              <p className="mt-4 text-lg font-semibold text-amber-300 md:text-xl">Décentralisé</p>
              <p className="mt-2 text-base leading-relaxed text-slate-400">
                Il s&apos;échange de pair-à-pair, sans intermédiaire. Personne n&apos;a le monopole de l&apos;émission : la gouvernance de Bitcoin est décentralisée, via un algorithme présent dans des nœuds répartis à travers le monde.
              </p>
            </div>
            <div className="flex flex-col rounded-xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10 text-2xl shadow-[0_0_24px_rgba(251,191,36,0.15)]">💎</span>
              <p className="mt-4 text-lg font-semibold text-amber-300 md:text-xl">Rare</p>
              <p className="mt-2 text-base leading-relaxed text-slate-400">
                La quantité de Bitcoin est limitée et fixe à <span className="text-amber-400 font-medium">21 millions d&apos;unités</span>. Il n&apos;y en aura jamais plus.
              </p>
            </div>
          </div>
          <p className="mt-12 text-center text-lg leading-relaxed text-slate-300 md:text-xl">
            Le Bitcoin transforme l&apos;énergie solaire inutilisée en un <strong className="font-semibold text-slate-200">actif financier rare et innovant</strong>. Contrairement à l&apos;or il s&apos;échange facilement, ses <strong className="font-semibold text-slate-200">réserves sont auditables</strong> et <strong className="font-semibold text-slate-200 underline decoration-amber-400/80 underline-offset-2">sa quantité ne changera jamais</strong>.
          </p>
        </div>
      </section>

      {/* Business model */}
      <Section className="px-4 py-24 md:py-36">
        <div className="mx-auto max-w-4xl">
          <AnimatedText>
            <h2 className="text-center text-4xl font-medium tracking-tight text-slate-200 md:text-5xl">
              Un modèle transparent
            </h2>
          </AnimatedText>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <AnimatedText>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
                <p className="font-semibold text-emerald-400">Pour vous (client)</p>
                <p className="mt-3 text-sm text-slate-300">
                  Vous êtes propriétaire du matériel. Vous recevez les revenus
                  (Euro ou BTC) chaque semaine.
                </p>
              </div>
            </AnimatedText>
            <AnimatedText>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
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
      <footer className="px-4 py-24 md:py-32">
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
            className="mt-10"
          >
            <Link
              href="/simulateur"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-105 hover:bg-emerald-400 hover:shadow-emerald-500/40"
            >
              Accéder au Simulateur de Rentabilité
            </Link>
          </motion.div>
          <p className="mt-10 text-xs text-slate-500">
            © SolarBlock — Transformer la contrainte réglementaire en opportunité.
          </p>
        </div>
      </footer>
      </main>
    </div>
  );
}

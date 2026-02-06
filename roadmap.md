🌞 Projet : Simulateur de Rentabilité SolarBlock
1. Brief & Contexte du Projet
Nom du projet : SolarBlock

Le Problème : Les propriétaires de grandes installations photovoltaïques (B2B : écoles, supermarchés, centres commerciaux) produisent souvent plus d'électricité qu'ils n'en consomment. Actuellement, ils revendent ce surplus à EDF OA (Obligation d'Achat) à un tarif très bas (environ 0,06 €/kWh), ce qui génère peu de revenus.

La Solution SolarBlock : SolarBlock propose d'installer des mineurs de Bitcoin (ASICs) directement chez le client pour consommer ce surplus d'énergie. L'énergie est convertie en Bitcoin, générant un revenu bien supérieur à la revente EDF.

Le Modèle Économique (Leasing) :

Installation : Le client paie un coût initial (CAPEX) pour l'installation technique (câblage, raccordement, mise en service).

Matériel : SolarBlock reste propriétaire des machines. Le client paie un loyer mensuel (Leasing/OPEX) qui couvre la dépréciation et la maintenance.

Revenus : Le client perçoit 100% des Bitcoins minés, sur lesquels SolarBlock prélève une commission de 10%.

Objectif du Simulateur : Créer une application web interactive permettant aux prospects de simuler leur rentabilité en temps réel. L'outil doit prouver mathématiquement que Minage > EDF OA et calculer le ROI (Temps de retour sur investissement) en se basant sur la différence de gain entre les deux solutions.
---

# 🗺️ Feuille de Route : Développement du Simulateur Solar Block

## 1. Stack Technique Recommandée

* **Framework :** Next.js 14 (App Router) - Pour la rapidité et le déploiement facile sur Vercel.
* **Langage :** TypeScript - Indispensable pour gérer la complexité des types (Modules, Scénarios, Paramètres).
* **Styling :** Tailwind CSS + shadcn/ui - Pour une interface propre, moderne et des composants prêts à l'emploi (sliders, inputs, tableaux).
* **Gestion d'état :** React Hook Form + Zod (pour la validation des entrées) ou un simple Context si l'app reste petite.
* **Charts :** Recharts - Pour visualiser les courbes de ROI et les comparaisons de revenus.
* **Déploiement :** Vercel.

---

## 2. Structure des Données (Data Model)

Il faut définir les constantes et les types dès le début.

### A. Constantes Globales (Paramètres par défaut mais ajustables)

* `DEFAULT_BTC_PRICE`: 70 000 €
* `DEFAULT_DIFFICULTY`: 1400 (M TH/s)
* `DEFAULT_ASIC_EFFICIENCY`: 20 (J/TH)
* `EDF_OA_RATE`: 0.06 (€/kWh)
* `SOLAR_BLOCK_MARGIN`: 10%
* `BLOCKS_PER_DAY`: 144
* `BLOCK_REWARD`: 3.125 BTC

### B. Types TypeScript

```typescript
type ModuleConfig = {
  id: string;
  name: string; // ex: "Module 1"
  costHardware: number; // 6000
  costInstallation: number; // 5400 (Factu Install)
  leasingMonthly: number; // 104
  maintenanceRate: number; // 0.25
  residualValue5Years: number; // 1008
};

type ScenarioConfig = {
  id: string;
  name: string; // ex: "École Primaire"
  surplusTargetKw: number; // 10
  installedPowerKwc: number; // 80
  autoconsumptionWinter: number; // 90%
  autoconsumptionSummer: number; // 70%
  exploitationHours: number; // 6 (moyenne)
};

type SimulationResult = {
  surplusKwhAnnual: number;
  btcMinedAnnual: number;
  revenueBtcBrut: number;
  revenueBtcNet: number; // Après marge SolarBlock
  revenueEdf: number;
  gainVsEdfNet: number;
  leasingAnnualCost: number;
  realAnnualAdvantage: number; // Gain net vs EDF - Leasing
  roiYears: number;
  cashflowYear1: number;
};

```

---

## 3. Logique de Calcul (Business Logic)

Cette section doit être isolée dans un fichier utilitaire (ex: `utils/calculations.ts`).

**Étapes de calcul à implémenter :**

1. **Calcul du Surplus Énergétique :**
* `Prod Annuelle` = Puissance Installée × Gisement (1200)
* `TAC Moyen` = (TAC Hiver + TAC Été) / 2
* `Surplus Annuel` = Prod Annuelle × (1 - TAC Moyen)
* `Surplus Moyen Dispo (kW)` = (Surplus Annuel / 365) / Heures Exploitation


2. **Calcul Mining :**
* `Hashrate Total (TH/s)` = (Surplus Moyen Dispo (W) / Efficacité J/TH)
* `BTC Annuel` = (Hashrate × 144 blocs × 3.125 × 365) / (Difficulté × 10^6)
* `Revenu BTC Brut` = BTC Annuel × Prix BTC


3. **Comparaison Financière :**
* `Revenu EDF` = Surplus Annuel × Tarif OA (0.06)
* `Marge SB` = Revenu BTC Brut × 0.10
* `Gain Vs EDF Net` = (Revenu BTC Brut - Marge SB) - Revenu EDF
* `Avantage Réel` = Gain Vs EDF Net - (Loyer Leasing Mensuel × 12)
* `ROI (Années)` = Coût Installation (Factu) / Avantage Réel



---

## 4. Instructions pour Cursor (Pas à pas)

Copiez ces blocs séquentiellement dans Cursor pour générer le code.

### Étape 1 : Initialisation et UI de base

Agis comme un expert React/Next.js. Initialise un projet Next.js avec TypeScript et Tailwind. Crée une structure de page avec une barre latérale fixe à gauche pour les contrôles et une zone de contenu principale à droite. Utilise les composants shadcn/ui pour les inputs. Le thème doit être 'Dark mode' professionnel (style fintech/crypto, fond sombre, accents verts pour les profits).

> "Crée une application Next.js avec TypeScript, Tailwind et shadcn/ui.
> Crée une structure de mise en page avec une barre latérale pour les paramètres (inputs) et une zone principale pour les résultats.
> Dans la barre latérale, ajoute des champs modifiables pour : Prix du BTC, Difficulté Réseau, Tarif EDF OA.
> Ajoute un sélecteur pour choisir parmi les 3 Scénarios (École, Supermarché, Centre Co) et les 3 Modules (1, 2, 3)."

### Étape 2 : Implémentation des Calculs

> "Crée un fichier `utils/simulator.ts`. Implémente les fonctions pour calculer le surplus solaire, le hashrate, la production de BTC et le ROI.
> Utilise exactement cette logique :
> * ROI = Coût Installation / ( (Revenu BTC Net - Revenu EDF) - Coût Leasing Annuel )
> * Revenu BTC Net = (BTC produits * Prix BTC) * 0.9
> Utilise les données suivantes en dur pour les modules et scénarios [Insérer les données des tableaux ici]."
> 
> 

### Étape 3 : Affichage des Résultats (KPIs)

> "Dans la zone principale, crée des cartes de KPI (Cards) pour afficher :
> 1. ROI (en années, en gros et en gras/couleur).
> 2. Avantage Annuel Réel (€).
> 3. Gain Total sur 5 ans.
> 4. Comparaison Revenu Minage vs EDF (Bar chart simple).
> Si le ROI est < 2 ans, affiche le texte en vert. Si > 5 ans, en orange."
> 
> 

### Étape 4 : Tableau Détaillé et Graphiques

> "Ajoute sous les KPIs un tableau comparatif année par année sur 5 ans.
> Colonnes : Année, Coût Initial (seulement année 1), Loyer Leasing, Revenu Minage Net, Revenu EDF (pour comparaison), Cashflow Cumulé.
> Ajoute un graphique linéaire (Recharts) montrant l'évolution de la trésorerie cumulée : une ligne pour 'Solution Minage' et une ligne pour 'Solution EDF'."

### Étape 5 : Fonctionnalités "Power User"

> "Ajoute un mode 'Avancé' dans la sidebar qui permet de modifier les hypothèses cachées : Efficacité ASIC (20 J/TH), Gisement Solaire (1200), Marge SolarBlock (10%).
> Ajoute un bouton 'Exporter en PDF' ou 'Partager la simulation' (génère une URL avec les paramètres en query params)."

---

## 5. Points d'attention pour le déploiement

1. **Réactivité :** Assurez-vous que le simulateur fonctionne bien sur mobile (les tableaux doivent être scrollables horizontalement).
2. **Partage d'URL :** Pour que vous puissiez envoyer une simulation à un client, demandez à Cursor : *"Fais en sorte que l'état du formulaire soit synchronisé avec l'URL (searchParams) pour que je puisse copier le lien et que le client voie la même configuration."*
3. **Disclaimer :** Ajoutez une petite note en bas de page indiquant que les résultats dépendent de la difficulté du réseau et du cours du Bitcoin.

Cette feuille de route permet de passer de votre Excel statique à une vraie *Web App* commerciale en quelques heures de développement assisté par IA.

---

# 🗺️ Feuille de Route : Rentabilité Interne (SolarBlock)

### Objectif

Ajouter un tableau de bord (caché ou activable par toggle **« Renta Client / Renta SolarBlock »**) qui calcule les marges nettes de SolarBlock sur chaque projet, en prenant en compte :

1. **Marge à l'installation** (Cash immédiat).
2. **Marge sur le Leasing** (Différentiel Loyer vs Coût Matériel).
3. **Marge sur le Minage** (Les fameux 10% de commission).

---

## Étape 1 : Mise à jour des Données (Structure)

Enrichir les objets `MODULES` avec les coûts d'achat internes (ce que le client ne voit pas).

**Champs ajoutés à chaque module :**

* `internalHardwareCost` : Prix d'achat réel des ASICs par SolarBlock.
* `internalInstallCost` : Coût réel de la main d'œuvre et du câblage pour SolarBlock.

**Valeurs (marge estimée ~20% sur l'install, coûts hardware négociés) :**

* **Module 1 :** internalHardwareCost: 5000, internalInstallCost: 4300.
* **Module 2 :** internalHardwareCost: 22000, internalInstallCost: 7600.
* **Module 3 :** internalHardwareCost: 48000, internalInstallCost: 12500.
* **Module 4 :** internalHardwareCost: 72000, internalInstallCost: 16800.
* **Module 5 :** internalHardwareCost: 120000, internalInstallCost: 25600.

---

## Étape 2 : Logique de Calcul (Business Logic)

Fonction `calculateSolarBlockProfitability` : prend en entrée le module sélectionné et les résultats de minage du client. Retourne :

1. **Marge Installation (Upfront Cash)** : `Module.costInstallation` (facturé client) − `Module.internalInstallCost`.
2. **Marge Leasing Globale (sur 5 ans)** : (`Module.monthlyLeasing` × 60 mois) − `Module.internalHardwareCost`.
3. **Revenus Commission (Recurring)** : `Total_BTC_Mined` × `BTC_Price` × 10 %, sur 5 ans.
4. **Profit Total SolarBlock par projet** : Somme des 3 marges sur 5 ans (LTV client).

---

## Étape 3 : Interface Utilisateur (Dashboard Admin)

Composant **Vue Interne / Renta SolarBlock** visible via un **toggle « Renta Client / Renta SolarBlock »**. Affiche :

* **Cashflow Immédiat (J-0)** : La marge d'installation.
* **MRR (Revenu Récurrent Mensuel)** : (Marge Leasing Mensuelle) + (Commission Minage Mensuelle).
* **Lifetime Value (LTV) Client** : Le profit total SolarBlock sur ce client en 5 ans.
* **Graphique en barres empilées « Sources de Profit »** : Installation | Marge Leasing | Commission Minage (10 %).

---

## Étape 4 : Stress Test (Scénario du pire)

Section d'analyse de risque dans le panneau Admin :

* **Revenus Fixes (Sécurisés)** : Marge Installation + Marge Leasing.
* **Revenus Variables (Risqués)** : Commission Minage.

Message affiché : *« Même si le Bitcoin tombe à 0 €, SolarBlock sécurise X € de marge sur ce projet via l'installation et le leasing. »*

---

### Résumé des formules (vérification)

Exemple **Module 3 (Centre Commercial)** :

1. **Marge Install :** 15 600 € (facturé) − 12 500 € (coût) = **+3 100 €** (cash immédiat).
2. **Marge Leasing :** (953 € × 60) − 48 000 € = **+9 180 €** (sur 5 ans).
3. **Commission Minage (BTC à 70 k€)** : ~3 650 €/an × 5 = **+18 250 €**.

**Total Profit SolarBlock sur 5 ans (Module 3) :** 3 100 + 9 180 + 18 250 = **30 530 €** de marge nette par projet (LTV). C'est ce chiffre qui intéresse les investisseurs.
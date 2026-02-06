# 🌞 SolarBlock — Simulateur de rentabilité

Ce dépôt contient **l’outil de simulation SolarBlock** : une application web qui permet de montrer à un client ou à un investisseur combien il gagne en minant son surplus solaire avec SolarBlock, par rapport à la revente classique à EDF.

---

## À qui s’adresse ce projet ?

- **Équipe SolarBlock** : pour présenter des chiffres clairs en rendez-vous commercial ou en levée de fonds.
- **Prospects (B2B)** : écoles, supermarchés, centres commerciaux, fermes solaires qui ont du surplus photovoltaïque et veulent voir la différence Minage vs EDF.
- **Parties prenantes** : toute personne qui a besoin d’une démo ou d’un tableau récapitulatif sans entrer dans la technique.

Le simulateur est pensé pour être **compréhensible sans compétences techniques** : des infobulles (?) expliquent chaque notion importante.

---

## Le problème que SolarBlock résout

Beaucoup de sites avec panneaux solaires (toitures, ombrières) produisent **plus d’électricité qu’ils n’en consomment**. Aujourd’hui, ce surplus est souvent revendu à **EDF Obligation d’Achat (EDF OA)** à un tarif très bas (environ **0,06 €/kWh**), ce qui rapporte peu.

**SolarBlock** propose une autre voie : installer des **mineurs de Bitcoin (ASIC)** sur le site du client pour consommer ce surplus. L’électricité est alors convertie en Bitcoin, et le revenu peut être bien supérieur à la revente EDF. Le simulateur permet de le **montrer en chiffres** et de comparer les deux options.

---

## Comment fonctionne l’offre SolarBlock (résumé)

1. **Installation (CAPEX)**  
   Le client paie une fois le coût d’installation (câblage, raccordement, mise en service).

2. **Matériel en leasing (OPEX)**  
   SolarBlock reste propriétaire des machines. Le client paie un **loyer mensuel** qui couvre l’usage du matériel et la maintenance.

3. **Revenus**  
   Le client reçoit **100 % des Bitcoins minés** ; SolarBlock prélève une **commission de 10 %** sur ces revenus.

Le simulateur calcule automatiquement : surplus d’électricité, production de Bitcoin, revenus minage vs revenus EDF, coût du leasing, **avantage net annuel** et **temps de retour sur investissement (ROI)**.

---

## Ce que permet l’application (côté utilisateur)

- **Choisir un profil type** : école, supermarché, centre commercial, ferme avec trackers, etc. Chaque scénario pré-remplit la puissance installée, le gisement solaire et l’autoconsommation.
- **Choisir un module ASIC** : de 10 kW à 250 kW, avec les coûts d’installation et de leasing associés.
- **Ajuster quelques hypothèses** : prix du Bitcoin, difficulté du réseau (avec une valeur par défaut prudente), tarif EDF OA. Un mode « avancé » permet de modifier le gisement solaire, l’efficacité des machines ou la marge SolarBlock.
- **Voir les résultats en direct** : ROI, avantage annuel réel, gain sur 5 ans, tableau année par année et graphique Minage vs EDF.
- **Consulter un tableau récapitulatif** : tous les paramètres et indicateurs en un seul endroit.
- **Exporter les données** : téléchargement en **CSV** ou **copier pour Google Sheets**, pour partager la simulation en réunion ou en dossier.

Des **infobulles (?)** à côté des principaux libellés expliquent les notions (ROI, avantage annuel, difficulté du réseau, etc.) de façon non technique.

---

## Contenu du dépôt (en bref)

| Élément | Description |
|--------|-------------|
| **`frontend/`** | L’application web du simulateur (interface + calculs). C’est ce que l’on ouvre dans un navigateur ou que l’on déploie en ligne. |
| **`roadmap.md`** | La feuille de route du projet : objectifs, étapes de développement et détails pour les équipes technique et produit. |

Il n’y a pas de « backend » séparé pour l’instant : tous les calculs sont faits dans le navigateur à partir des paramètres saisis.

---

## Utiliser le simulateur (en local)

1. Ouvrir un terminal à la **racine du projet**.
2. Aller dans le dossier de l’application :  
   `cd frontend`
3. Installer les dépendances :  
   `npm install`
4. Lancer l’application :  
   `npm run dev`
5. Ouvrir dans le navigateur :  
   **http://localhost:3000**

La page d’accueil est le simulateur. Les pages **Scénarios** et **Modules** permettent de parcourir les profils types et les configurations ASIC, puis de les charger d’un clic dans le simulateur.

---

## Résultats et hypothèses

Les chiffres affichés sont **indicatifs**. Ils dépendent du cours du Bitcoin et de l’évolution de la difficulté du réseau. Une note en bas du simulateur le rappelle. Les hypothèses par défaut (notamment la difficulté) sont volontairement **prudentes** pour rester crédibles face à des investisseurs ou des clients exigeants.

---

## Licence et contact

Projet **SolarBlock**. Pour toute question sur l’usage du simulateur ou la réutilisation du code, contacter l’équipe SolarBlock.

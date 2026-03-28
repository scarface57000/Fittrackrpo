import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "fitness-tracker-v2";

// ================================================================
// COMPLETE FOOD DATABASE (per 100g unless noted)
// ================================================================
const FOOD_DB = {
  "Protéines": [
    { name: "Blanc de poulet", unit: "g", defaultQty: 180, cal: 165, p: 31, g: 0, l: 3.6, fiber: 0, sugar: 0, sodium: 74 },
    { name: "Filet de dinde", unit: "g", defaultQty: 180, cal: 135, p: 30, g: 0, l: 1.5, fiber: 0, sugar: 0, sodium: 60 },
    { name: "Steak de bœuf 5%", unit: "g", defaultQty: 150, cal: 137, p: 22, g: 0, l: 5, fiber: 0, sugar: 0, sodium: 55 },
    { name: "Steak haché 15%", unit: "g", defaultQty: 125, cal: 220, p: 18, g: 0, l: 15, fiber: 0, sugar: 0, sodium: 66 },
    { name: "Filet de saumon", unit: "g", defaultQty: 150, cal: 208, p: 20, g: 0, l: 13, fiber: 0, sugar: 0, sodium: 59 },
    { name: "Cabillaud", unit: "g", defaultQty: 200, cal: 82, p: 18, g: 0, l: 0.7, fiber: 0, sugar: 0, sodium: 54 },
    { name: "Thon en boîte (naturel)", unit: "g", defaultQty: 140, cal: 116, p: 26, g: 0, l: 1, fiber: 0, sugar: 0, sodium: 340 },
    { name: "Crevettes", unit: "g", defaultQty: 150, cal: 85, p: 20, g: 0, l: 0.5, fiber: 0, sugar: 0, sodium: 566 },
    { name: "Sardines en boîte", unit: "g", defaultQty: 100, cal: 208, p: 25, g: 0, l: 11, fiber: 0, sugar: 0, sodium: 505 },
    { name: "Truite", unit: "g", defaultQty: 150, cal: 141, p: 20, g: 0, l: 6.6, fiber: 0, sugar: 0, sodium: 52 },
    { name: "Œuf entier", unit: "pièce", defaultQty: 1, cal: 74, p: 6.3, g: 0.4, l: 5, fiber: 0, sugar: 0.2, sodium: 71, perUnit: true },
    { name: "Blanc d'œuf", unit: "pièce", defaultQty: 1, cal: 17, p: 3.6, g: 0.2, l: 0.1, fiber: 0, sugar: 0.1, sodium: 55, perUnit: true },
    { name: "Tofu ferme", unit: "g", defaultQty: 200, cal: 144, p: 15, g: 3, l: 8, fiber: 1.2, sugar: 1, sodium: 14 },
    { name: "Tempeh", unit: "g", defaultQty: 100, cal: 192, p: 19, g: 8, l: 11, fiber: 5, sugar: 0, sodium: 9 },
    { name: "Seitan", unit: "g", defaultQty: 100, cal: 150, p: 25, g: 5, l: 2, fiber: 0.6, sugar: 0, sodium: 260 },
    { name: "Jambon blanc découenné", unit: "tranche", defaultQty: 1, cal: 37, p: 5.5, g: 0.5, l: 1.5, fiber: 0, sugar: 0.3, sodium: 350, perUnit: true },
    { name: "Whey protéine (1 scoop)", unit: "scoop", defaultQty: 1, cal: 120, p: 24, g: 2, l: 1.5, fiber: 0, sugar: 1, sodium: 80, perUnit: true },
    { name: "Caséine (1 scoop)", unit: "scoop", defaultQty: 1, cal: 115, p: 24, g: 3, l: 0.5, fiber: 0, sugar: 1, sodium: 90, perUnit: true },
  ],
  "Féculents & Céréales": [
    { name: "Riz basmati (cuit)", unit: "g", defaultQty: 180, cal: 130, p: 2.7, g: 28, l: 0.3, fiber: 0.4, sugar: 0, sodium: 1 },
    { name: "Riz complet (cuit)", unit: "g", defaultQty: 180, cal: 123, p: 2.7, g: 26, l: 1, fiber: 1.6, sugar: 0.2, sodium: 4 },
    { name: "Pâtes complètes (cuites)", unit: "g", defaultQty: 180, cal: 131, p: 5.3, g: 25, l: 1.1, fiber: 3.9, sugar: 0.6, sodium: 3 },
    { name: "Pâtes blanches (cuites)", unit: "g", defaultQty: 180, cal: 157, p: 5.8, g: 31, l: 0.9, fiber: 1.8, sugar: 0.6, sodium: 1 },
    { name: "Quinoa (cuit)", unit: "g", defaultQty: 150, cal: 120, p: 4.4, g: 22, l: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7 },
    { name: "Boulgour (cuit)", unit: "g", defaultQty: 150, cal: 83, p: 3.1, g: 19, l: 0.2, fiber: 4.5, sugar: 0.1, sodium: 5 },
    { name: "Patate douce", unit: "g", defaultQty: 200, cal: 86, p: 1.6, g: 20, l: 0.1, fiber: 3, sugar: 4.2, sodium: 36 },
    { name: "Pomme de terre", unit: "g", defaultQty: 200, cal: 77, p: 2, g: 17, l: 0.1, fiber: 2.2, sugar: 0.8, sodium: 6 },
    { name: "Lentilles (cuites)", unit: "g", defaultQty: 180, cal: 116, p: 9, g: 20, l: 0.4, fiber: 7.9, sugar: 1.8, sodium: 2 },
    { name: "Pois chiches (cuits)", unit: "g", defaultQty: 150, cal: 164, p: 8.9, g: 27, l: 2.6, fiber: 7.6, sugar: 4.8, sodium: 7 },
    { name: "Haricots rouges (cuits)", unit: "g", defaultQty: 150, cal: 127, p: 8.7, g: 23, l: 0.5, fiber: 6.4, sugar: 0.3, sodium: 2 },
    { name: "Flocons d'avoine", unit: "g", defaultQty: 60, cal: 367, p: 14, g: 60, l: 7, fiber: 10, sugar: 1, sodium: 6 },
    { name: "Pain complet (tranche)", unit: "tranche", defaultQty: 1, cal: 82, p: 4, g: 14, l: 1.2, fiber: 2.2, sugar: 1.5, sodium: 150, perUnit: true },
    { name: "Pain blanc (tranche)", unit: "tranche", defaultQty: 1, cal: 75, p: 2.5, g: 14, l: 1, fiber: 0.8, sugar: 1.5, sodium: 145, perUnit: true },
    { name: "Galette de riz", unit: "pièce", defaultQty: 1, cal: 35, p: 0.8, g: 7.5, l: 0.3, fiber: 0.3, sugar: 0, sodium: 10, perUnit: true },
    { name: "Semoule (cuite)", unit: "g", defaultQty: 150, cal: 112, p: 3.8, g: 23, l: 0.2, fiber: 1.4, sugar: 0.1, sodium: 1 },
    { name: "Nouilles de konjac", unit: "g", defaultQty: 200, cal: 10, p: 0, g: 2, l: 0, fiber: 3, sugar: 0, sodium: 5 },
  ],
  "Légumes": [
    { name: "Brocoli", unit: "g", defaultQty: 150, cal: 34, p: 2.8, g: 7, l: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33 },
    { name: "Haricots verts", unit: "g", defaultQty: 150, cal: 31, p: 1.8, g: 7, l: 0.1, fiber: 3.4, sugar: 1.4, sodium: 6 },
    { name: "Courgette", unit: "g", defaultQty: 200, cal: 17, p: 1.2, g: 3.1, l: 0.3, fiber: 1, sugar: 2.5, sodium: 8 },
    { name: "Épinards", unit: "g", defaultQty: 100, cal: 23, p: 2.9, g: 3.6, l: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79 },
    { name: "Salade verte (mixte)", unit: "g", defaultQty: 100, cal: 17, p: 1.3, g: 2.9, l: 0.2, fiber: 1.8, sugar: 0.8, sodium: 10 },
    { name: "Tomate", unit: "g", defaultQty: 150, cal: 18, p: 0.9, g: 3.9, l: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5 },
    { name: "Concombre", unit: "g", defaultQty: 150, cal: 12, p: 0.6, g: 2.2, l: 0.1, fiber: 0.7, sugar: 1.4, sodium: 2 },
    { name: "Poivron", unit: "g", defaultQty: 150, cal: 26, p: 1, g: 6, l: 0.2, fiber: 1.7, sugar: 2.4, sodium: 2 },
    { name: "Carotte", unit: "g", defaultQty: 100, cal: 41, p: 0.9, g: 10, l: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69 },
    { name: "Champignons", unit: "g", defaultQty: 100, cal: 22, p: 3.1, g: 3.3, l: 0.3, fiber: 1, sugar: 2, sodium: 5 },
    { name: "Chou-fleur", unit: "g", defaultQty: 150, cal: 25, p: 1.9, g: 5, l: 0.3, fiber: 2, sugar: 1.9, sodium: 30 },
    { name: "Aubergine", unit: "g", defaultQty: 200, cal: 25, p: 1, g: 6, l: 0.2, fiber: 3, sugar: 3.5, sodium: 2 },
    { name: "Asperges", unit: "g", defaultQty: 150, cal: 20, p: 2.2, g: 3.9, l: 0.1, fiber: 2.1, sugar: 1.9, sodium: 2 },
    { name: "Petits pois", unit: "g", defaultQty: 100, cal: 81, p: 5.4, g: 14, l: 0.4, fiber: 5.7, sugar: 5.7, sodium: 5 },
    { name: "Avocat", unit: "pièce", defaultQty: 1, cal: 240, p: 3, g: 13, l: 22, fiber: 10, sugar: 1, sodium: 10, perUnit: true },
  ],
  "Fruits": [
    { name: "Banane", unit: "pièce", defaultQty: 1, cal: 105, p: 1.3, g: 27, l: 0.4, fiber: 3.1, sugar: 14, sodium: 1, perUnit: true },
    { name: "Pomme", unit: "pièce", defaultQty: 1, cal: 80, p: 0.4, g: 21, l: 0.2, fiber: 3.3, sugar: 15, sodium: 0, perUnit: true },
    { name: "Orange", unit: "pièce", defaultQty: 1, cal: 62, p: 1.2, g: 15, l: 0.2, fiber: 3.1, sugar: 12, sodium: 0, perUnit: true },
    { name: "Fraises", unit: "g", defaultQty: 150, cal: 32, p: 0.7, g: 7.7, l: 0.3, fiber: 2, sugar: 4.9, sodium: 1 },
    { name: "Myrtilles", unit: "g", defaultQty: 100, cal: 57, p: 0.7, g: 14, l: 0.3, fiber: 2.4, sugar: 10, sodium: 1 },
    { name: "Framboises", unit: "g", defaultQty: 100, cal: 52, p: 1.2, g: 12, l: 0.7, fiber: 6.5, sugar: 4.4, sodium: 1 },
    { name: "Kiwi", unit: "pièce", defaultQty: 1, cal: 42, p: 0.8, g: 10, l: 0.4, fiber: 2.1, sugar: 6, sodium: 2, perUnit: true },
    { name: "Mangue", unit: "g", defaultQty: 150, cal: 60, p: 0.8, g: 15, l: 0.4, fiber: 1.6, sugar: 14, sodium: 1 },
    { name: "Raisin", unit: "g", defaultQty: 100, cal: 69, p: 0.7, g: 18, l: 0.2, fiber: 0.9, sugar: 16, sodium: 2 },
    { name: "Poire", unit: "pièce", defaultQty: 1, cal: 96, p: 0.6, g: 26, l: 0.2, fiber: 5.1, sugar: 16, sodium: 2, perUnit: true },
    { name: "Ananas", unit: "g", defaultQty: 150, cal: 50, p: 0.5, g: 13, l: 0.1, fiber: 1.4, sugar: 10, sodium: 1 },
    { name: "Pastèque", unit: "g", defaultQty: 200, cal: 30, p: 0.6, g: 7.6, l: 0.2, fiber: 0.4, sugar: 6.2, sodium: 1 },
    { name: "Compote sans sucre", unit: "g", defaultQty: 100, cal: 42, p: 0.2, g: 10, l: 0.1, fiber: 1.3, sugar: 9, sodium: 3 },
    { name: "Dattes (2 pièces)", unit: "pièce", defaultQty: 2, cal: 133, p: 0.9, g: 36, l: 0.1, fiber: 3.2, sugar: 32, sodium: 1, perUnit: true },
  ],
  "Produits laitiers": [
    { name: "Fromage blanc 0%", unit: "g", defaultQty: 200, cal: 48, p: 8, g: 4, l: 0.1, fiber: 0, sugar: 3.5, sodium: 40 },
    { name: "Yaourt grec 0%", unit: "g", defaultQty: 170, cal: 59, p: 10, g: 3.6, l: 0.4, fiber: 0, sugar: 3.2, sodium: 36 },
    { name: "Skyr", unit: "g", defaultQty: 150, cal: 63, p: 11, g: 4, l: 0.2, fiber: 0, sugar: 3.5, sodium: 40 },
    { name: "Lait demi-écrémé", unit: "ml", defaultQty: 250, cal: 46, p: 3.3, g: 4.8, l: 1.6, fiber: 0, sugar: 4.8, sodium: 44 },
    { name: "Lait d'amande (non sucré)", unit: "ml", defaultQty: 250, cal: 15, p: 0.6, g: 0.3, l: 1.1, fiber: 0.2, sugar: 0, sodium: 75 },
    { name: "Lait d'avoine", unit: "ml", defaultQty: 250, cal: 43, p: 1, g: 7, l: 1.5, fiber: 0.8, sugar: 4, sodium: 40 },
    { name: "Mozzarella", unit: "g", defaultQty: 30, cal: 280, p: 22, g: 2.2, l: 22, fiber: 0, sugar: 1.1, sodium: 627 },
    { name: "Emmental", unit: "g", defaultQty: 30, cal: 380, p: 29, g: 0, l: 29, fiber: 0, sugar: 0, sodium: 400 },
    { name: "Cottage cheese", unit: "g", defaultQty: 150, cal: 72, p: 12, g: 2.7, l: 1, fiber: 0, sugar: 2.7, sodium: 315 },
    { name: "Ricotta", unit: "g", defaultQty: 50, cal: 174, p: 11, g: 3, l: 13, fiber: 0, sugar: 0.3, sodium: 84 },
    { name: "Crème fraîche 15%", unit: "g", defaultQty: 30, cal: 162, p: 2.5, g: 3.5, l: 15, fiber: 0, sugar: 3.5, sodium: 35 },
  ],
  "Matières grasses & Oléagineux": [
    { name: "Huile d'olive", unit: "ml", defaultQty: 10, cal: 884, p: 0, g: 0, l: 100, fiber: 0, sugar: 0, sodium: 0 },
    { name: "Huile de coco", unit: "ml", defaultQty: 10, cal: 862, p: 0, g: 0, l: 100, fiber: 0, sugar: 0, sodium: 0 },
    { name: "Beurre de cacahuète", unit: "g", defaultQty: 15, cal: 588, p: 25, g: 20, l: 50, fiber: 6, sugar: 9, sodium: 426 },
    { name: "Beurre d'amande", unit: "g", defaultQty: 15, cal: 614, p: 21, g: 19, l: 56, fiber: 10, sugar: 4, sodium: 2 },
    { name: "Amandes", unit: "g", defaultQty: 20, cal: 579, p: 21, g: 22, l: 50, fiber: 12, sugar: 4.4, sodium: 1 },
    { name: "Noix", unit: "g", defaultQty: 20, cal: 654, p: 15, g: 14, l: 65, fiber: 6.7, sugar: 2.6, sodium: 2 },
    { name: "Noix de cajou", unit: "g", defaultQty: 20, cal: 553, p: 18, g: 30, l: 44, fiber: 3.3, sugar: 5.9, sodium: 12 },
    { name: "Graines de chia", unit: "g", defaultQty: 15, cal: 486, p: 17, g: 42, l: 31, fiber: 34, sugar: 0, sodium: 16 },
    { name: "Graines de lin", unit: "g", defaultQty: 10, cal: 534, p: 18, g: 29, l: 42, fiber: 27, sugar: 1.6, sodium: 30 },
    { name: "Graines de tournesol", unit: "g", defaultQty: 15, cal: 584, p: 21, g: 20, l: 51, fiber: 8.6, sugar: 2.6, sodium: 9 },
    { name: "Beurre", unit: "g", defaultQty: 10, cal: 717, p: 0.9, g: 0.1, l: 81, fiber: 0, sugar: 0.1, sodium: 643 },
    { name: "Tahini (purée sésame)", unit: "g", defaultQty: 15, cal: 595, p: 17, g: 21, l: 54, fiber: 9.3, sugar: 0.5, sodium: 11 },
  ],
  "Sauces & Assaisonnements": [
    { name: "Vinaigrette maison", unit: "ml", defaultQty: 15, cal: 350, p: 0, g: 3, l: 38, fiber: 0, sugar: 2, sodium: 200 },
    { name: "Sauce soja", unit: "ml", defaultQty: 15, cal: 53, p: 8, g: 5, l: 0.1, fiber: 0.8, sugar: 0.4, sodium: 5493 },
    { name: "Moutarde de Dijon", unit: "g", defaultQty: 10, cal: 66, p: 4, g: 4, l: 4, fiber: 3.3, sugar: 0.9, sodium: 1900 },
    { name: "Vinaigre balsamique", unit: "ml", defaultQty: 15, cal: 88, p: 0.5, g: 17, l: 0, fiber: 0, sugar: 15, sodium: 23 },
    { name: "Miel", unit: "g", defaultQty: 10, cal: 304, p: 0.3, g: 82, l: 0, fiber: 0.2, sugar: 82, sodium: 4 },
    { name: "Sirop d'agave", unit: "g", defaultQty: 10, cal: 310, p: 0, g: 76, l: 0.5, fiber: 0.2, sugar: 68, sodium: 4 },
    { name: "Cannelle (1 c. à café)", unit: "cac", defaultQty: 1, cal: 6, p: 0.1, g: 2, l: 0, fiber: 1.4, sugar: 0.6, sodium: 0, perUnit: true },
    { name: "Curcuma (1 c. à café)", unit: "cac", defaultQty: 1, cal: 9, p: 0.3, g: 2, l: 0.1, fiber: 0.7, sugar: 0.1, sodium: 1, perUnit: true },
  ],
  "Boissons & Autres": [
    { name: "Café noir", unit: "tasse", defaultQty: 1, cal: 2, p: 0.3, g: 0, l: 0, fiber: 0, sugar: 0, sodium: 5, perUnit: true },
    { name: "Thé vert", unit: "tasse", defaultQty: 1, cal: 1, p: 0, g: 0.2, l: 0, fiber: 0, sugar: 0, sodium: 1, perUnit: true },
    { name: "Chocolat noir 85%", unit: "g", defaultQty: 20, cal: 599, p: 13, g: 22, l: 52, fiber: 13, sugar: 12, sodium: 24 },
    { name: "Protéine bar", unit: "pièce", defaultQty: 1, cal: 200, p: 20, g: 22, l: 7, fiber: 3, sugar: 3, sodium: 150, perUnit: true },
    { name: "Galette de riz + confiture", unit: "pièce", defaultQty: 1, cal: 60, p: 0.8, g: 14, l: 0.3, fiber: 0.4, sugar: 5, sodium: 12, perUnit: true },
    { name: "Crackers complets (4 pcs)", unit: "portion", defaultQty: 1, cal: 78, p: 1.8, g: 12, l: 2.5, fiber: 1.6, sugar: 0.8, sodium: 120, perUnit: true },
  ],
};

// ================================================================
// COMPLETE EXERCISE DATABASE
// ================================================================
const EXERCISE_DB = {
  "Pectoraux": [
    { name: "Développé couché barre", muscle: "Pectoraux", secondary: "Triceps, Épaules ant.", sets: "4", reps: "8-12", rest: "90s", difficulty: 3, equipment: "Barre + Banc", tips: "Omoplates serrées, pieds au sol, descente contrôlée jusqu'à la poitrine" },
    { name: "Développé couché haltères", muscle: "Pectoraux", secondary: "Triceps, Épaules ant.", sets: "4", reps: "10-12", rest: "90s", difficulty: 2, equipment: "Haltères + Banc", tips: "Amplitude complète, rotation neutre en bas, mains face à face ou en pronation" },
    { name: "Développé incliné haltères", muscle: "Haut des pectoraux", secondary: "Épaules ant., Triceps", sets: "3", reps: "10-12", rest: "90s", difficulty: 2, equipment: "Haltères + Banc incliné", tips: "Inclinaison 30°, ne pas trop monter pour garder la tension" },
    { name: "Développé incliné barre", muscle: "Haut des pectoraux", secondary: "Épaules ant., Triceps", sets: "3", reps: "8-10", rest: "90s", difficulty: 3, equipment: "Barre + Banc incliné", tips: "Descendre la barre vers le haut de la poitrine" },
    { name: "Écartés haltères", muscle: "Pectoraux (stretch)", secondary: "Épaules ant.", sets: "3", reps: "12-15", rest: "60s", difficulty: 2, equipment: "Haltères + Banc", tips: "Coudes légèrement fléchis, grande amplitude, étirement en bas" },
    { name: "Écartés poulie vis-à-vis", muscle: "Pectoraux (contraction)", secondary: "Épaules ant.", sets: "3", reps: "12-15", rest: "60s", difficulty: 1, equipment: "Poulie", tips: "Croiser légèrement les mains pour maximiser la contraction" },
    { name: "Pompes classiques", muscle: "Pectoraux", secondary: "Triceps, Core", sets: "3", reps: "15-20", rest: "60s", difficulty: 1, equipment: "Poids du corps", tips: "Corps gainé, descente poitrine au sol, coudes à 45°" },
    { name: "Dips (pectoraux)", muscle: "Bas des pectoraux", secondary: "Triceps, Épaules", sets: "3", reps: "8-12", rest: "90s", difficulty: 3, equipment: "Barres parallèles", tips: "Penché en avant, coudes écartés, descente profonde" },
    { name: "Pullover haltère", muscle: "Pectoraux + Dos", secondary: "Triceps, Dentelés", sets: "3", reps: "12", rest: "60s", difficulty: 2, equipment: "Haltère + Banc", tips: "Bras légèrement fléchis, étirement maximal derrière la tête" },
  ],
  "Dos": [
    { name: "Tractions pronation", muscle: "Grand dorsal", secondary: "Biceps, Rhomboïdes", sets: "4", reps: "6-10", rest: "120s", difficulty: 4, equipment: "Barre de traction", tips: "Tirer la poitrine vers la barre, omoplates serrées en haut" },
    { name: "Tractions supination", muscle: "Grand dorsal + Biceps", secondary: "Rhomboïdes", sets: "3", reps: "8-12", rest: "90s", difficulty: 3, equipment: "Barre de traction", tips: "Prise serrée, menton au-dessus de la barre" },
    { name: "Tirage vertical poulie", muscle: "Grand dorsal", secondary: "Biceps, Rhomboïdes", sets: "3", reps: "10-12", rest: "90s", difficulty: 1, equipment: "Poulie haute", tips: "Tirer vers le sternum, pas derrière la nuque" },
    { name: "Rowing barre", muscle: "Milieu du dos", secondary: "Biceps, Lombaires", sets: "4", reps: "8-10", rest: "90s", difficulty: 3, equipment: "Barre", tips: "Dos plat à 45°, tirer vers le nombril, serrer les omoplates" },
    { name: "Rowing haltère un bras", muscle: "Grand dorsal", secondary: "Biceps, Rhomboïdes", sets: "3", reps: "10-12", rest: "90s", difficulty: 2, equipment: "Haltère + Banc", tips: "Dos bien droit, coude le long du corps, tirer haut" },
    { name: "Rowing assis poulie basse", muscle: "Milieu du dos", secondary: "Biceps, Rhomboïdes", sets: "3", reps: "12", rest: "90s", difficulty: 1, equipment: "Poulie basse", tips: "Dos droit, tirer vers l'abdomen, pause 1s en contraction" },
    { name: "Face pulls", muscle: "Deltoïdes post., Rhomboïdes", secondary: "Trapèzes, Coiffe rotateurs", sets: "3", reps: "15-20", rest: "60s", difficulty: 1, equipment: "Poulie corde", tips: "Tirer vers le visage, rotation externe en fin de mouvement" },
    { name: "Soulevé de terre", muscle: "Chaîne postérieure", secondary: "Dos complet, Jambes", sets: "4", reps: "5-8", rest: "180s", difficulty: 5, equipment: "Barre", tips: "Dos neutre, poussée des jambes, barre le long du corps" },
    { name: "Soulevé de terre roumain", muscle: "Ischio-jambiers, Lombaires", secondary: "Fessiers, Dos", sets: "3", reps: "8-10", rest: "120s", difficulty: 3, equipment: "Barre ou Haltères", tips: "Jambes quasi tendues, charnière de hanche, stretch des ischio" },
    { name: "Tirage horizontal machine", muscle: "Milieu du dos", secondary: "Biceps", sets: "3", reps: "12", rest: "60s", difficulty: 1, equipment: "Machine", tips: "Bonne alternative au rowing, contrôler le retour" },
  ],
  "Épaules": [
    { name: "Développé militaire debout", muscle: "Deltoïdes ant. + méd.", secondary: "Triceps, Core", sets: "4", reps: "8-10", rest: "90s", difficulty: 3, equipment: "Barre", tips: "Gainage abdominal, pas de cambrure, pousser au-dessus de la tête" },
    { name: "Développé haltères assis", muscle: "Deltoïdes", secondary: "Triceps", sets: "3", reps: "10-12", rest: "90s", difficulty: 2, equipment: "Haltères + Banc", tips: "Dos calé contre le banc, descendre à 90° minimum" },
    { name: "Élévations latérales", muscle: "Deltoïdes médians", secondary: "", sets: "3", reps: "15", rest: "60s", difficulty: 1, equipment: "Haltères", tips: "Léger, bras légèrement fléchis, monter à hauteur d'épaule" },
    { name: "Élévations frontales", muscle: "Deltoïdes antérieurs", secondary: "", sets: "3", reps: "12", rest: "60s", difficulty: 1, equipment: "Haltères ou Disque", tips: "Bras tendus, monter jusqu'à l'horizontale, alterner ou simultané" },
    { name: "Oiseau (élévations post.)", muscle: "Deltoïdes postérieurs", secondary: "Rhomboïdes", sets: "3", reps: "15", rest: "60s", difficulty: 2, equipment: "Haltères", tips: "Penché en avant, coudes vers le plafond" },
    { name: "Shrugs haltères", muscle: "Trapèzes supérieurs", secondary: "", sets: "3", reps: "12-15", rest: "60s", difficulty: 1, equipment: "Haltères", tips: "Monter les épaules vers les oreilles, pause 2s en haut" },
    { name: "Arnold press", muscle: "Deltoïdes (complet)", secondary: "Triceps", sets: "3", reps: "10-12", rest: "90s", difficulty: 2, equipment: "Haltères", tips: "Rotation pendant la montée, de supination à pronation" },
  ],
  "Bras": [
    { name: "Curl biceps haltères", muscle: "Biceps", secondary: "Avant-bras", sets: "3", reps: "12", rest: "60s", difficulty: 1, equipment: "Haltères", tips: "Coudes fixes le long du corps, supination en haut" },
    { name: "Curl marteau", muscle: "Brachial, Biceps", secondary: "Avant-bras", sets: "3", reps: "12", rest: "60s", difficulty: 1, equipment: "Haltères", tips: "Prise neutre (pouces en haut), travaille le brachial" },
    { name: "Curl barre EZ", muscle: "Biceps", secondary: "Avant-bras", sets: "3", reps: "10-12", rest: "60s", difficulty: 1, equipment: "Barre EZ", tips: "Prise serrée = longue portion, prise large = courte portion" },
    { name: "Curl concentré", muscle: "Biceps (pic)", secondary: "", sets: "3", reps: "12", rest: "60s", difficulty: 1, equipment: "Haltère", tips: "Coude contre la cuisse, contraction maximale en haut" },
    { name: "Extensions triceps poulie", muscle: "Triceps", secondary: "", sets: "3", reps: "12-15", rest: "60s", difficulty: 1, equipment: "Poulie corde", tips: "Coudes fixes, écarter la corde en bas pour la contraction" },
    { name: "Barre au front (skullcrusher)", muscle: "Triceps", secondary: "", sets: "3", reps: "10-12", rest: "60s", difficulty: 2, equipment: "Barre EZ + Banc", tips: "Descendre vers le front, coudes fixes, ne pas tricher" },
    { name: "Dips triceps (banc)", muscle: "Triceps", secondary: "Pectoraux, Épaules", sets: "3", reps: "10-15", rest: "60s", difficulty: 2, equipment: "Banc", tips: "Coudes serrés vers l'arrière, ne pas descendre trop bas" },
    { name: "Extension triceps overhead", muscle: "Triceps (longue portion)", secondary: "", sets: "3", reps: "12", rest: "60s", difficulty: 2, equipment: "Haltère ou Poulie", tips: "Un ou deux bras, stretch complet en bas" },
    { name: "Curl poulie basse", muscle: "Biceps", secondary: "", sets: "3", reps: "12-15", rest: "60s", difficulty: 1, equipment: "Poulie basse", tips: "Tension constante, excellent pour le pump" },
  ],
  "Jambes": [
    { name: "Squat barre", muscle: "Quadriceps, Fessiers", secondary: "Ischio, Core, Lombaires", sets: "4", reps: "8-12", rest: "120s", difficulty: 4, equipment: "Barre + Rack", tips: "Descendre sous le parallèle, genoux dans l'axe des pieds" },
    { name: "Squat goblet", muscle: "Quadriceps, Fessiers", secondary: "Core", sets: "3", reps: "12-15", rest: "90s", difficulty: 2, equipment: "Haltère ou Kettlebell", tips: "Idéal pour apprendre le mouvement, dos droit, profond" },
    { name: "Presse à cuisses", muscle: "Quadriceps, Fessiers", secondary: "Ischio", sets: "4", reps: "10-12", rest: "90s", difficulty: 1, equipment: "Machine presse", tips: "Pieds largeur d'épaules, ne pas verrouiller les genoux" },
    { name: "Fentes marchantes", muscle: "Quadriceps, Fessiers", secondary: "Ischio, Core", sets: "3", reps: "12/jambe", rest: "90s", difficulty: 2, equipment: "Haltères", tips: "Grand pas, genou arrière frôle le sol, buste droit" },
    { name: "Squat bulgare", muscle: "Quadriceps, Fessiers", secondary: "Ischio, Core", sets: "3", reps: "10/jambe", rest: "90s", difficulty: 3, equipment: "Haltères + Banc", tips: "Pied arrière sur le banc, descente verticale" },
    { name: "Leg extension", muscle: "Quadriceps", secondary: "", sets: "3", reps: "12-15", rest: "60s", difficulty: 1, equipment: "Machine", tips: "Extension complète, contraction 1s en haut, retour lent" },
    { name: "Leg curl", muscle: "Ischio-jambiers", secondary: "", sets: "3", reps: "12-15", rest: "60s", difficulty: 1, equipment: "Machine", tips: "Contraction forte en haut, retour contrôlé" },
    { name: "Hip thrust", muscle: "Fessiers", secondary: "Ischio", sets: "3", reps: "12-15", rest: "90s", difficulty: 2, equipment: "Barre + Banc", tips: "Squeeze fessiers 2s en haut, menton rentré" },
    { name: "Mollets debout", muscle: "Mollets (gastrocnémien)", secondary: "Soléaire", sets: "4", reps: "15-20", rest: "60s", difficulty: 1, equipment: "Machine ou Marche", tips: "Amplitude maximale, étirement en bas, pause en haut" },
    { name: "Mollets assis", muscle: "Soléaire", secondary: "", sets: "3", reps: "15-20", rest: "60s", difficulty: 1, equipment: "Machine", tips: "Complément des mollets debout, tempo lent" },
    { name: "Hack squat", muscle: "Quadriceps", secondary: "Fessiers", sets: "3", reps: "10-12", rest: "90s", difficulty: 2, equipment: "Machine hack", tips: "Pieds bas = plus de quadriceps, pieds hauts = plus de fessiers" },
    { name: "Good morning", muscle: "Ischio, Lombaires", secondary: "Fessiers", sets: "3", reps: "10-12", rest: "90s", difficulty: 3, equipment: "Barre", tips: "Charge légère, charnière de hanche, dos neutre" },
  ],
  "Abdominaux & Core": [
    { name: "Crunch classique", muscle: "Grand droit (haut)", secondary: "", sets: "3", reps: "15-20", rest: "45s", difficulty: 1, equipment: "Sol", tips: "Décoller les omoplates, ne pas tirer sur la nuque" },
    { name: "Crunch câble", muscle: "Grand droit", secondary: "", sets: "3", reps: "12-15", rest: "60s", difficulty: 1, equipment: "Poulie haute", tips: "À genoux, enrouler le buste, contraction forte" },
    { name: "Relevés de jambes", muscle: "Grand droit (bas)", secondary: "Psoas", sets: "3", reps: "12-15", rest: "60s", difficulty: 2, equipment: "Barre ou Banc", tips: "Suspendre, monter les jambes sans balancer" },
    { name: "Planche abdominale", muscle: "Core complet", secondary: "Épaules", sets: "3", reps: "30-60s", rest: "60s", difficulty: 1, equipment: "Sol", tips: "Corps aligné, fessiers et abdos contractés" },
    { name: "Planche latérale", muscle: "Obliques, Core", secondary: "Épaules", sets: "3", reps: "30s/côté", rest: "45s", difficulty: 2, equipment: "Sol", tips: "Hanches alignées, ne pas s'affaisser" },
    { name: "Ab wheel (roue abdominale)", muscle: "Grand droit, Core", secondary: "Épaules, Dos", sets: "3", reps: "10-12", rest: "60s", difficulty: 3, equipment: "Roue abdominale", tips: "Débutant: sur les genoux, avancé: debout" },
    { name: "Russian twist", muscle: "Obliques", secondary: "Grand droit", sets: "3", reps: "20", rest: "45s", difficulty: 1, equipment: "Poids ou Médecine ball", tips: "Pieds décollés pour plus de difficulté" },
    { name: "Mountain climbers", muscle: "Core, Cardio", secondary: "Épaules, Quadriceps", sets: "3", reps: "30s", rest: "30s", difficulty: 2, equipment: "Sol", tips: "Rythme rapide, genoux vers la poitrine" },
    { name: "Dead bug", muscle: "Core (stabilisation)", secondary: "Psoas", sets: "3", reps: "10/côté", rest: "45s", difficulty: 1, equipment: "Sol", tips: "Dos plaqué au sol, bras et jambes opposés" },
  ],
  "Cardio": [
    { name: "Marche rapide (inclinaison)", muscle: "Cardio LISS", secondary: "Jambes", sets: "1", reps: "30-45 min", rest: "—", difficulty: 1, equipment: "Tapis", tips: "Inclinaison 5-10%, 60-70% FCmax, zone brûle-graisse" },
    { name: "Course à pied", muscle: "Cardio", secondary: "Jambes", sets: "1", reps: "20-40 min", rest: "—", difficulty: 2, equipment: "Tapis ou Extérieur", tips: "Allure modérée pour du LISS, sprints pour du HIIT" },
    { name: "Vélo elliptique", muscle: "Cardio full body", secondary: "Jambes, Bras", sets: "1", reps: "25-35 min", rest: "—", difficulty: 1, equipment: "Machine", tips: "Résistance modérée, mouvement fluide" },
    { name: "Rameur", muscle: "Cardio + Dos", secondary: "Jambes, Bras", sets: "1", reps: "20-30 min", rest: "—", difficulty: 2, equipment: "Machine rameur", tips: "Pousser avec les jambes d'abord, puis tirer avec le dos" },
    { name: "Vélo d'appartement", muscle: "Cardio, Quadriceps", secondary: "Mollets", sets: "1", reps: "25-40 min", rest: "—", difficulty: 1, equipment: "Vélo", tips: "Résistance variable, bon pour les articulations" },
    { name: "Corde à sauter", muscle: "Cardio, Mollets", secondary: "Épaules, Core", sets: "5-10", reps: "1-2 min", rest: "30s", difficulty: 2, equipment: "Corde à sauter", tips: "Sur la pointe des pieds, poignets souples" },
    { name: "HIIT intervalles (30s/30s)", muscle: "Cardio haute intensité", secondary: "Full body", sets: "10-15", reps: "30s effort", rest: "30s récup", difficulty: 3, equipment: "Vélo/Rameur/Sprint", tips: "Effort maximal 30s, récupération active 30s" },
    { name: "HIIT Tabata (20s/10s)", muscle: "Cardio anaérobie", secondary: "Full body", sets: "8", reps: "20s effort", rest: "10s récup", difficulty: 4, equipment: "Au choix", tips: "4 minutes au total, intensité maximale, très avancé" },
  ],
};

const DIFFICULTY_LABELS = ["", "Débutant", "Facile", "Intermédiaire", "Avancé", "Expert"];
const DIFFICULTY_COLORS = ["", "#34d399", "#60a5fa", "#fbbf24", "#f97316", "#ef4444"];

const DEFAULT_DAY = () => ({
  date: new Date().toISOString().split("T")[0],
  weight: "", sleepHours: "", sleepQuality: 3, water: 0,
  meals: [
    { name: "Petit-déjeuner", items: [], calories: 0 },
    { name: "Déjeuner", items: [], calories: 0 },
    { name: "Collation", items: [], calories: 0 },
    { name: "Dîner", items: [], calories: 0 },
  ],
  workout: { type: "", exercises: [], duration: "", cardio: "", caloriesBurned: "" },
  supplements: [], mood: 3, energy: 3, notes: "",
  costs: { food: "", supplements: "", gym: "", other: "" },
});

const MOODS = ["😫", "😔", "😐", "🙂", "😁"];
const ENERGY_LABELS = ["Épuisé", "Fatigué", "Normal", "Bien", "En feu"];
const formatDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

export default function App() {
  const [days, setDays] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ startWeight: 81, goalWeight: 66, height: 169, age: 30, startDate: "2026-03-25" });
  const [showProfile, setShowProfile] = useState(false);
  // Food picker
  const [foodPicker, setFoodPicker] = useState({ open: false, mealIdx: 0 });
  const [foodSearch, setFoodSearch] = useState("");
  const [foodCategory, setFoodCategory] = useState("Protéines");
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodQty, setFoodQty] = useState("");
  // Exercise picker
  const [exPicker, setExPicker] = useState(false);
  const [exSearch, setExSearch] = useState("");
  const [exCategory, setExCategory] = useState("Pectoraux");
  const [selectedEx, setSelectedEx] = useState(null);
  const [exWeight, setExWeight] = useState("");
  const [exCustomSets, setExCustomSets] = useState("");
  const [exCustomReps, setExCustomReps] = useState("");
  // Supplement
  const [showAddSupplement, setShowAddSupplement] = useState(false);
  const [newSupplement, setNewSupplement] = useState({ name: "", dose: "" });
  const saveTimeout = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY); const res = raw ? { value: raw } : null;
        if (res?.value) { const p = JSON.parse(res.value); if (p.days) setDays(p.days); if (p.profile) setProfile(p.profile); }
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const save = useCallback(async (d, p) => {
    setSaving(true);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ days: d || days, profile: p || profile })); } catch (e) {}
    setSaving(false);
  }, [days, profile]);

  const debouncedSave = useCallback((d, p) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => save(d, p), 600);
  }, [save]);

  const today = days[currentDate] || DEFAULT_DAY();
  const updateDay = (field, value) => { const u = { ...days, [currentDate]: { ...today, [field]: value, date: currentDate } }; setDays(u); debouncedSave(u); };
  const updateNested = (path, value) => {
    const c = JSON.parse(JSON.stringify(today)); c.date = currentDate;
    const k = path.split("."); let o = c; for (let i = 0; i < k.length - 1; i++) o = o[k[i]]; o[k[k.length - 1]] = value;
    const u = { ...days, [currentDate]: c }; setDays(u); debouncedSave(u);
  };
  const navigateDay = (dir) => { const d = new Date(currentDate + "T12:00:00"); d.setDate(d.getDate() + dir); setCurrentDate(d.toISOString().split("T")[0]); };

  // -- Add food from DB --
  const addFoodFromDB = (mealIdx, food, qty) => {
    const c = JSON.parse(JSON.stringify(today)); c.date = currentDate;
    let cal, pr, gr, lr, fi, su, so;
    if (food.perUnit) {
      const mult = parseFloat(qty) || 1;
      cal = Math.round(food.cal * mult); pr = +(food.p * mult).toFixed(1); gr = +(food.g * mult).toFixed(1);
      lr = +(food.l * mult).toFixed(1); fi = +(food.fiber * mult).toFixed(1); su = +(food.sugar * mult).toFixed(1); so = Math.round(food.sodium * mult);
    } else {
      const mult = (parseFloat(qty) || food.defaultQty) / 100;
      cal = Math.round(food.cal * mult); pr = +(food.p * mult).toFixed(1); gr = +(food.g * mult).toFixed(1);
      lr = +(food.l * mult).toFixed(1); fi = +(food.fiber * mult).toFixed(1); su = +(food.sugar * mult).toFixed(1); so = Math.round(food.sodium * mult);
    }
    c.meals[mealIdx].items.push({
      name: food.name, quantity: food.perUnit ? `${qty || 1} ${food.unit}` : `${qty || food.defaultQty}g`,
      calories: cal, protein: pr, carbs: gr, fat: lr, fiber: fi, sugar: su, sodium: so,
    });
    c.meals[mealIdx].calories = c.meals[mealIdx].items.reduce((s, i) => s + (parseFloat(i.calories) || 0), 0);
    const u = { ...days, [currentDate]: c }; setDays(u); debouncedSave(u);
  };

  const removeFoodItem = (mi, ii) => {
    const c = JSON.parse(JSON.stringify(today)); c.date = currentDate;
    c.meals[mi].items.splice(ii, 1);
    c.meals[mi].calories = c.meals[mi].items.reduce((s, i) => s + (parseFloat(i.calories) || 0), 0);
    const u = { ...days, [currentDate]: c }; setDays(u); debouncedSave(u);
  };

  // -- Add exercise from DB --
  const addExFromDB = (ex, weight, customSets, customReps) => {
    const c = JSON.parse(JSON.stringify(today)); c.date = currentDate;
    c.workout.exercises.push({ name: ex.name, sets: customSets || ex.sets, reps: customReps || ex.reps, weight: weight || "", rest: ex.rest, muscle: ex.muscle, tips: ex.tips });
    const u = { ...days, [currentDate]: c }; setDays(u); debouncedSave(u);
  };
  const removeExercise = (i) => {
    const c = JSON.parse(JSON.stringify(today)); c.date = currentDate; c.workout.exercises.splice(i, 1);
    const u = { ...days, [currentDate]: c }; setDays(u); debouncedSave(u);
  };

  const addSupplement = () => {
    if (!newSupplement.name) return;
    const c = JSON.parse(JSON.stringify(today)); c.date = currentDate;
    c.supplements.push({ ...newSupplement, taken: true });
    const u = { ...days, [currentDate]: c }; setDays(u); debouncedSave(u);
    setNewSupplement({ name: "", dose: "" }); setShowAddSupplement(false);
  };
  const removeSupplement = (i) => {
    const c = JSON.parse(JSON.stringify(today)); c.date = currentDate; c.supplements.splice(i, 1);
    const u = { ...days, [currentDate]: c }; setDays(u); debouncedSave(u);
  };

  const totalCalories = today.meals.reduce((s, m) => s + (m.calories || 0), 0);
  const totalProtein = today.meals.reduce((s, m) => s + m.items.reduce((ss, i) => ss + (parseFloat(i.protein) || 0), 0), 0);
  const totalCarbs = today.meals.reduce((s, m) => s + m.items.reduce((ss, i) => ss + (parseFloat(i.carbs) || 0), 0), 0);
  const totalFat = today.meals.reduce((s, m) => s + m.items.reduce((ss, i) => ss + (parseFloat(i.fat) || 0), 0), 0);
  const totalFiber = today.meals.reduce((s, m) => s + m.items.reduce((ss, i) => ss + (parseFloat(i.fiber) || 0), 0), 0);
  const totalSugar = today.meals.reduce((s, m) => s + m.items.reduce((ss, i) => ss + (parseFloat(i.sugar) || 0), 0), 0);
  const totalSodium = today.meals.reduce((s, m) => s + m.items.reduce((ss, i) => ss + (parseFloat(i.sodium) || 0), 0), 0);
  const totalCost = Object.values(today.costs || {}).reduce((s, v) => s + (parseFloat(v) || 0), 0);

  const sortedDays = Object.keys(days).sort();
  const weights = sortedDays.filter(d => days[d].weight).map(d => ({ date: d, weight: parseFloat(days[d].weight) }));
  const currentWeight = weights.length > 0 ? weights[weights.length - 1].weight : profile.startWeight;
  const totalLost = profile.startWeight - currentWeight;
  const remaining = currentWeight - profile.goalWeight;
  const progressPct = Math.min(100, Math.max(0, (totalLost / (profile.startWeight - profile.goalWeight)) * 100));
  const totalSpent = Object.values(days).reduce((s, d) => s + (d.costs ? Object.values(d.costs).reduce((ss, v) => ss + (parseFloat(v) || 0), 0) : 0), 0);

  const calorieTarget = 2068;
  const proteinTarget = 180;

  // Filtered food items
  const filteredFoods = (FOOD_DB[foodCategory] || []).filter(f => !foodSearch || f.name.toLowerCase().includes(foodSearch.toLowerCase()));
  // Filtered exercises
  const filteredExercises = (EXERCISE_DB[exCategory] || []).filter(e => !exSearch || e.name.toLowerCase().includes(exSearch.toLowerCase()));

  const inputStyle = { width: "100%", background: "#0a0e1a", border: "1px solid #2a3a5c", borderRadius: 8, padding: "8px 10px", color: "#e0e6ef", fontSize: 13, fontFamily: "'DM Sans', sans-serif" };
  const cardStyle = { background: "#111827", border: "1px solid #1e2a4a", borderRadius: 12, padding: 16, marginBottom: 12 };
  const btnPrimary = { background: "#1e40af", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0e1a", color: "#e0e6ef" }}><div style={{ fontSize: 40, animation: "pulse 1.5s infinite" }}>⏳</div></div>;

  const tabs = [
    { id: "overview", label: "Résumé", icon: "📊" },
    { id: "food", label: "Nutrition", icon: "🍽️" },
    { id: "workout", label: "Training", icon: "💪" },
    { id: "body", label: "Corps", icon: "🧘" },
    { id: "costs", label: "€", icon: "💰" },
    { id: "history", label: "Histo", icon: "📈" },
  ];

  // ======================== RENDER ========================
  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#e0e6ef", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,textarea{font-family:'DM Sans',sans-serif}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#2a3352;border-radius:3px}
        .food-row:hover{background:#1a2444 !important}
        .ex-row:hover{background:#1a2444 !important}
      `}</style>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#0f1628,#1a2444)", borderBottom: "1px solid #1e2a4a", padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 900, margin: "0 auto" }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 700 }}><span style={{ color: "#60a5fa" }}>FIT</span>TRACK</span>
            <span style={{ fontSize: 9, marginLeft: 6, color: "#4a5580", fontFamily: "'Space Mono'" }}>PRO {saving ? "| Sauvegarde..." : ""}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setShowProfile(!showProfile)} style={{ background: "#1e2a4a", border: "1px solid #2a3a5c", borderRadius: 8, padding: "5px 10px", color: "#60a5fa", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>⚙️</button>
            <button onClick={async () => { if (confirm("Tout supprimer ?")) { setDays({}); try { localStorage.removeItem(STORAGE_KEY); } catch(e) {} }}} style={{ background: "#1e1520", border: "1px solid #3a2040", borderRadius: 8, padding: "5px 10px", color: "#f87171", fontSize: 11, cursor: "pointer" }}>🗑️</button>
          </div>
        </div>
      </div>

      {showProfile && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "10px 16px", animation: "slideUp .3s" }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Profil</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[{ l: "Poids départ (kg)", f: "startWeight" }, { l: "Objectif (kg)", f: "goalWeight" }, { l: "Taille (cm)", f: "height" }, { l: "Âge", f: "age" }, { l: "Date début", f: "startDate", t: "date" }].map(x => (
                <div key={x.f}><div style={{ fontSize: 9, color: "#4a5580", marginBottom: 3 }}>{x.l}</div>
                <input type={x.t || "number"} value={profile[x.f]} onChange={e => { const np = { ...profile, [x.f]: e.target.value }; setProfile(np); debouncedSave(days, np); }} style={inputStyle} /></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DATE NAV */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <button onClick={() => navigateDay(-1)} style={{ background: "#1e2a4a", border: "none", borderRadius: 8, width: 34, height: 34, color: "#60a5fa", fontSize: 16, cursor: "pointer" }}>←</button>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700 }}>{formatDate(currentDate)}</div></div>
        <button onClick={() => navigateDay(1)} style={{ background: "#1e2a4a", border: "none", borderRadius: 8, width: 34, height: 34, color: "#60a5fa", fontSize: 16, cursor: "pointer" }}>→</button>
        <a href="https://buy.stripe.com/5643234" target="_blank" rel="noopener noreferrer" style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)", border: "none", borderRadius: 8, padding: "5px 10px", color: "#fff", fontSize: 11, cursor: "pointer", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center" }}>☕ Soutenir</a>
        <button onClick={() => setCurrentDate(new Date().toISOString().split("T")[0])} style={{ background: "#1a2444", border: "1px solid #2a3a5c", borderRadius: 8, padding: "5px 10px", color: "#60a5fa", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>Auj.</button>
      </div>

      {/* TABS */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 3 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ background: activeTab === t.id ? "#1e2a4a" : "transparent", border: activeTab === t.id ? "1px solid #2a3a5c" : "1px solid transparent", borderRadius: 8, padding: "7px 10px", color: activeTab === t.id ? "#60a5fa" : "#4a5580", fontSize: 11, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "14px 16px 50px" }}>

      {/* ============ OVERVIEW ============ */}
      {activeTab === "overview" && (
        <div style={{ animation: "slideUp .3s" }}>
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#4a5580" }}>{profile.startWeight}kg</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa" }}>{currentWeight}kg</span>
              <span style={{ fontSize: 11, color: "#4a5580" }}>{profile.goalWeight}kg</span>
            </div>
            <div style={{ background: "#1e2a4a", borderRadius: 20, height: 10, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg,#3b82f6,#60a5fa)", width: `${progressPct}%`, height: "100%", borderRadius: 20, transition: "width .5s" }} />
            </div>
            <div style={{ textAlign: "center", marginTop: 6, fontSize: 11, color: "#4a5580" }}>{totalLost > 0 ? `${totalLost.toFixed(1)}kg perdus` : "—"} • {remaining > 0 ? `${remaining.toFixed(1)}kg restants` : "Objectif !"}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[
              { l: "Calories", v: `${totalCalories}`, s: `/${calorieTarget}`, c: totalCalories > calorieTarget ? "#f87171" : "#34d399" },
              { l: "Protéines", v: `${totalProtein.toFixed(0)}g`, s: `/${proteinTarget}g`, c: totalProtein >= proteinTarget ? "#34d399" : "#fbbf24" },
              { l: "Eau", v: `${today.water||0}`, s: "verres", c: "#60a5fa" },
              { l: "Fibres", v: `${totalFiber.toFixed(0)}g`, s: "/30g", c: "#a78bfa" },
              { l: "Sucres", v: `${totalSugar.toFixed(0)}g`, s: "total", c: "#fbbf24" },
              { l: "Sodium", v: `${totalSodium}mg`, s: "/2300mg", c: totalSodium > 2300 ? "#f87171" : "#60a5fa" },
            ].map((k, i) => (
              <div key={i} style={{ background: "#111827", border: "1px solid #1e2a4a", borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 9, color: "#4a5580", fontFamily: "'Space Mono'", marginBottom: 4 }}>{k.l}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: k.c, fontFamily: "'Space Mono'" }}>{k.v}</div>
                <div style={{ fontSize: 9, color: "#4a5580" }}>{k.s}</div>
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Saisie rapide</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><div style={{ fontSize: 9, color: "#4a5580", marginBottom: 3 }}>Poids (kg)</div><input type="number" step="0.1" value={today.weight} onChange={e => updateDay("weight", e.target.value)} placeholder="80.5" style={inputStyle} /></div>
              <div><div style={{ fontSize: 9, color: "#4a5580", marginBottom: 3 }}>Sommeil (h)</div><input type="number" step="0.5" value={today.sleepHours} onChange={e => updateDay("sleepHours", e.target.value)} placeholder="7.5" style={inputStyle} /></div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 9, color: "#4a5580", marginBottom: 4 }}>Eau (verres 250ml)</div>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {Array.from({ length: 14 }, (_, i) => (
                  <button key={i} onClick={() => updateDay("water", i + 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: i < (today.water||0) ? "#1e40af" : "#1e2a4a", color: i < (today.water||0) ? "#93c5fd" : "#2a3a5c", fontSize: 12, cursor: "pointer" }}>💧</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ FOOD ============ */}
      {activeTab === "food" && (
        <div style={{ animation: "slideUp .3s" }}>
          {/* Macro bars */}
          <div style={cardStyle}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, textAlign: "center" }}>
              {[
                { l: "Calories", v: totalCalories, t: calorieTarget, u: "kcal", c: "#60a5fa" },
                { l: "Prot", v: totalProtein.toFixed(0), t: proteinTarget, u: "g", c: "#34d399" },
                { l: "Gluc", v: totalCarbs.toFixed(0), t: 195, u: "g", c: "#fbbf24" },
                { l: "Lip", v: totalFat.toFixed(0), t: 63, u: "g", c: "#f87171" },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: 9, color: "#4a5580" }}>{m.l}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: m.c, fontFamily: "'Space Mono'" }}>{m.v}</div>
                  <div style={{ fontSize: 9, color: "#4a5580" }}>/{m.t}{m.u}</div>
                  <div style={{ margin: "4px auto 0", width: 36, background: "#1e2a4a", borderRadius: 10, height: 3, overflow: "hidden" }}>
                    <div style={{ background: m.c, width: `${Math.min(100, (parseFloat(m.v) / m.t) * 100)}%`, height: "100%", borderRadius: 10 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10, textAlign: "center" }}>
              {[
                { l: "Fibres", v: `${totalFiber.toFixed(0)}g`, c: "#a78bfa" },
                { l: "Sucres", v: `${totalSugar.toFixed(0)}g`, c: "#fbbf24" },
                { l: "Sodium", v: `${totalSodium}mg`, c: "#60a5fa" },
              ].map((m, i) => (
                <div key={i} style={{ background: "#0a0e1a", borderRadius: 6, padding: "6px 4px" }}>
                  <div style={{ fontSize: 8, color: "#4a5580" }}>{m.l}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: m.c, fontFamily: "'Space Mono'" }}>{m.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Meals */}
          {today.meals.map((meal, mi) => (
            <div key={mi} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{["🌅","☀️","🍎","🌙"][mi]} {meal.name}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#60a5fa", fontFamily: "'Space Mono'" }}>{meal.calories} kcal</span>
              </div>
              {meal.items.map((item, ii) => (
                <div key={ii} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 8px", background: "#0a0e1a", borderRadius: 6, marginBottom: 3, fontSize: 11 }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ color: "#4a5580", marginLeft: 6 }}>{item.quantity}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <span style={{ color: "#34d399", fontFamily: "'Space Mono'", fontSize: 9 }}>P:{item.protein}</span>
                    <span style={{ color: "#fbbf24", fontFamily: "'Space Mono'", fontSize: 9 }}>G:{item.carbs}</span>
                    <span style={{ color: "#f87171", fontFamily: "'Space Mono'", fontSize: 9 }}>L:{item.fat}</span>
                    {item.fiber > 0 && <span style={{ color: "#a78bfa", fontFamily: "'Space Mono'", fontSize: 9 }}>Fi:{item.fiber}</span>}
                    <span style={{ color: "#60a5fa", fontWeight: 600, fontSize: 11 }}>{item.calories}</span>
                    <button onClick={() => removeFoodItem(mi, ii)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
                  </div>
                </div>
              ))}
              <button onClick={() => { setFoodPicker({ open: true, mealIdx: mi }); setSelectedFood(null); setFoodSearch(""); setFoodQty(""); }}
                style={{ width: "100%", marginTop: 4, background: "none", border: "1px dashed #2a3a5c", borderRadius: 6, padding: "7px", color: "#4a5580", fontSize: 11, cursor: "pointer" }}>
                + Ajouter depuis la base
              </button>
            </div>
          ))}

          {/* FOOD PICKER MODAL */}
          {foodPicker.open && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn .2s" }}>
              <div style={{ width: "100%", maxWidth: 500, maxHeight: "85vh", background: "#111827", borderRadius: "16px 16px 0 0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #1e2a4a" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>🍽️ Ajouter un aliment</span>
                    <button onClick={() => setFoodPicker({ open: false, mealIdx: 0 })} style={{ background: "none", border: "none", color: "#f87171", fontSize: 20, cursor: "pointer" }}>×</button>
                  </div>
                  <input value={foodSearch} onChange={e => setFoodSearch(e.target.value)} placeholder="Rechercher un aliment..."
                    style={{ ...inputStyle, marginBottom: 8 }} />
                  <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4 }}>
                    {Object.keys(FOOD_DB).map(cat => (
                      <button key={cat} onClick={() => { setFoodCategory(cat); setSelectedFood(null); }}
                        style={{ padding: "4px 10px", borderRadius: 16, border: foodCategory === cat ? "1px solid #3b82f6" : "1px solid #2a3a5c", background: foodCategory === cat ? "#1e3a5f" : "transparent", color: foodCategory === cat ? "#60a5fa" : "#4a5580", fontSize: 10, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{cat}</button>
                    ))}
                  </div>
                </div>

                {!selectedFood ? (
                  <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
                    {filteredFoods.map((f, i) => (
                      <div key={i} className="food-row" onClick={() => { setSelectedFood(f); setFoodQty(f.perUnit ? String(f.defaultQty) : String(f.defaultQty)); }}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #0a0e1a", transition: "background .15s" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>
                          <div style={{ fontSize: 10, color: "#4a5580", fontFamily: "'Space Mono'" }}>
                            P:{f.p} G:{f.g} L:{f.l} | {f.perUnit ? `par ${f.unit}` : "pour 100g"}
                          </div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#60a5fa", fontFamily: "'Space Mono'" }}>
                          {f.cal} <span style={{ fontSize: 9, color: "#4a5580" }}>kcal</span>
                        </div>
                      </div>
                    ))}
                    {filteredFoods.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#4a5580" }}>Aucun résultat</div>}
                  </div>
                ) : (
                  <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{selectedFood.name}</div>
                    <div style={{ fontSize: 11, color: "#4a5580", marginBottom: 12 }}>Valeurs {selectedFood.perUnit ? `par ${selectedFood.unit}` : "pour 100g"}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
                      {[
                        { l: "Calories", v: selectedFood.cal, u: "kcal", c: "#60a5fa" },
                        { l: "Protéines", v: selectedFood.p, u: "g", c: "#34d399" },
                        { l: "Glucides", v: selectedFood.g, u: "g", c: "#fbbf24" },
                        { l: "Lipides", v: selectedFood.l, u: "g", c: "#f87171" },
                      ].map((n, i) => (
                        <div key={i} style={{ background: "#0a0e1a", borderRadius: 8, padding: 8, textAlign: "center" }}>
                          <div style={{ fontSize: 8, color: "#4a5580" }}>{n.l}</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: n.c, fontFamily: "'Space Mono'" }}>{n.v}</div>
                          <div style={{ fontSize: 8, color: "#4a5580" }}>{n.u}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 14 }}>
                      {[
                        { l: "Fibres", v: `${selectedFood.fiber}g` },
                        { l: "Sucres", v: `${selectedFood.sugar}g` },
                        { l: "Sodium", v: `${selectedFood.sodium}mg` },
                      ].map((n, i) => (
                        <div key={i} style={{ background: "#0a0e1a", borderRadius: 6, padding: "5px 4px", textAlign: "center" }}>
                          <div style={{ fontSize: 8, color: "#4a5580" }}>{n.l}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#e0e6ef", fontFamily: "'Space Mono'" }}>{n.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: "#4a5580", marginBottom: 4 }}>
                        Quantité ({selectedFood.perUnit ? selectedFood.unit + "(s)" : "grammes"})
                      </div>
                      <input type="number" value={foodQty} onChange={e => setFoodQty(e.target.value)} style={{ ...inputStyle, fontSize: 18, fontWeight: 700, textAlign: "center" }} />
                      {!selectedFood.perUnit && foodQty && (
                        <div style={{ marginTop: 6, textAlign: "center", fontSize: 12, color: "#60a5fa", fontFamily: "'Space Mono'" }}>
                          = {Math.round(selectedFood.cal * parseFloat(foodQty) / 100)} kcal | P:{(selectedFood.p * parseFloat(foodQty) / 100).toFixed(1)} G:{(selectedFood.g * parseFloat(foodQty) / 100).toFixed(1)} L:{(selectedFood.l * parseFloat(foodQty) / 100).toFixed(1)}
                        </div>
                      )}
                      {selectedFood.perUnit && foodQty && (
                        <div style={{ marginTop: 6, textAlign: "center", fontSize: 12, color: "#60a5fa", fontFamily: "'Space Mono'" }}>
                          = {Math.round(selectedFood.cal * parseFloat(foodQty))} kcal | P:{(selectedFood.p * parseFloat(foodQty)).toFixed(1)} G:{(selectedFood.g * parseFloat(foodQty)).toFixed(1)} L:{(selectedFood.l * parseFloat(foodQty)).toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setSelectedFood(null)} style={{ flex: 1, background: "#1e2a4a", border: "none", borderRadius: 8, padding: 10, color: "#4a5580", fontSize: 13, cursor: "pointer" }}>← Retour</button>
                      <button onClick={() => { addFoodFromDB(foodPicker.mealIdx, selectedFood, foodQty); setFoodPicker({ open: false, mealIdx: 0 }); }}
                        style={{ flex: 2, ...btnPrimary, padding: 10, fontSize: 13 }}>✓ Ajouter</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============ WORKOUT ============ */}
      {activeTab === "workout" && (
        <div style={{ animation: "slideUp .3s" }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Type de séance</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
              {["Push", "Pull", "Legs", "Full Body", "Cardio", "Repos"].map(t => (
                <button key={t} onClick={() => updateNested("workout.type", t)}
                  style={{ padding: "5px 12px", borderRadius: 20, border: today.workout?.type === t ? "1px solid #3b82f6" : "1px solid #2a3a5c", background: today.workout?.type === t ? "#1e3a5f" : "#0a0e1a", color: today.workout?.type === t ? "#60a5fa" : "#4a5580", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{t}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div><div style={{ fontSize: 9, color: "#4a5580", marginBottom: 3 }}>Durée (min)</div><input type="number" value={today.workout?.duration||""} onChange={e => updateNested("workout.duration", e.target.value)} style={inputStyle} /></div>
              <div><div style={{ fontSize: 9, color: "#4a5580", marginBottom: 3 }}>Calories brûlées</div><input type="number" value={today.workout?.caloriesBurned||""} onChange={e => updateNested("workout.caloriesBurned", e.target.value)} style={inputStyle} /></div>
            </div>
            <div><div style={{ fontSize: 9, color: "#4a5580", marginBottom: 3 }}>Cardio</div><input value={today.workout?.cardio||""} onChange={e => updateNested("workout.cardio", e.target.value)} placeholder="ex: 30min marche inclinaison 6%" style={inputStyle} /></div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Exercices du jour</div>
            {(today.workout?.exercises||[]).map((ex, i) => (
              <div key={i} style={{ padding: "8px 10px", background: "#0a0e1a", borderRadius: 8, marginBottom: 5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{ex.name}</div>
                    <div style={{ fontSize: 10, color: "#4a5580", fontFamily: "'Space Mono'" }}>
                      {ex.sets}×{ex.reps} {ex.weight ? `@ ${ex.weight}kg` : ""} | repos {ex.rest}
                    </div>
                    {ex.muscle && <div style={{ fontSize: 9, color: "#60a5fa", marginTop: 2 }}>{ex.muscle}</div>}
                  </div>
                  <button onClick={() => removeExercise(i)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 16 }}>×</button>
                </div>
                {ex.tips && <div style={{ fontSize: 9, color: "#4a5580", marginTop: 4, fontStyle: "italic", borderTop: "1px solid #1e2a4a", paddingTop: 4 }}>💡 {ex.tips}</div>}
              </div>
            ))}
            <button onClick={() => { setExPicker(true); setSelectedEx(null); setExSearch(""); setExWeight(""); setExCustomSets(""); setExCustomReps(""); }}
              style={{ width: "100%", marginTop: 4, background: "none", border: "1px dashed #2a3a5c", borderRadius: 6, padding: "7px", color: "#4a5580", fontSize: 11, cursor: "pointer" }}>+ Ajouter depuis la bibliothèque</button>
          </div>

          {/* EXERCISE PICKER MODAL */}
          {exPicker && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn .2s" }}>
              <div style={{ width: "100%", maxWidth: 500, maxHeight: "85vh", background: "#111827", borderRadius: "16px 16px 0 0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #1e2a4a" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>💪 Bibliothèque d'exercices</span>
                    <button onClick={() => setExPicker(false)} style={{ background: "none", border: "none", color: "#f87171", fontSize: 20, cursor: "pointer" }}>×</button>
                  </div>
                  <input value={exSearch} onChange={e => setExSearch(e.target.value)} placeholder="Rechercher un exercice..." style={{ ...inputStyle, marginBottom: 8 }} />
                  <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4 }}>
                    {Object.keys(EXERCISE_DB).map(cat => (
                      <button key={cat} onClick={() => { setExCategory(cat); setSelectedEx(null); }}
                        style={{ padding: "4px 10px", borderRadius: 16, border: exCategory === cat ? "1px solid #3b82f6" : "1px solid #2a3a5c", background: exCategory === cat ? "#1e3a5f" : "transparent", color: exCategory === cat ? "#60a5fa" : "#4a5580", fontSize: 10, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{cat}</button>
                    ))}
                  </div>
                </div>

                {!selectedEx ? (
                  <div style={{ flex: 1, overflowY: "auto" }}>
                    {filteredExercises.map((ex, i) => (
                      <div key={i} className="ex-row" onClick={() => setSelectedEx(ex)}
                        style={{ padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #0a0e1a", transition: "background .15s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</div>
                            <div style={{ fontSize: 10, color: "#4a5580" }}>{ex.muscle} {ex.secondary ? `+ ${ex.secondary}` : ""}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 11, color: "#60a5fa", fontFamily: "'Space Mono'" }}>{ex.sets}×{ex.reps}</div>
                            <div style={{ fontSize: 9, color: DIFFICULTY_COLORS[ex.difficulty] }}>{DIFFICULTY_LABELS[ex.difficulty]}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{selectedEx.name}</div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                      <span style={{ fontSize: 10, padding: "2px 8px", background: "#1e3a5f", borderRadius: 10, color: "#60a5fa" }}>{selectedEx.muscle}</span>
                      <span style={{ fontSize: 10, padding: "2px 8px", background: "#0a0e1a", borderRadius: 10, color: DIFFICULTY_COLORS[selectedEx.difficulty] }}>{DIFFICULTY_LABELS[selectedEx.difficulty]}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                      {[
                        { l: "Séries", v: selectedEx.sets },
                        { l: "Reps", v: selectedEx.reps },
                        { l: "Repos", v: selectedEx.rest },
                      ].map((n, i) => (
                        <div key={i} style={{ background: "#0a0e1a", borderRadius: 8, padding: 8, textAlign: "center" }}>
                          <div style={{ fontSize: 8, color: "#4a5580" }}>{n.l}</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: "#60a5fa", fontFamily: "'Space Mono'" }}>{n.v}</div>
                        </div>
                      ))}
                    </div>
                    {selectedEx.secondary && <div style={{ fontSize: 11, color: "#4a5580", marginBottom: 8 }}>Muscles secondaires : <span style={{ color: "#e0e6ef" }}>{selectedEx.secondary}</span></div>}
                    <div style={{ fontSize: 11, color: "#4a5580", marginBottom: 4 }}>Équipement : <span style={{ color: "#e0e6ef" }}>{selectedEx.equipment}</span></div>
                    <div style={{ background: "#0a0e1a", borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 12, color: "#fbbf24" }}>💡 {selectedEx.tips}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                      <div><div style={{ fontSize: 9, color: "#4a5580", marginBottom: 3 }}>Séries</div><input value={exCustomSets} onChange={e => setExCustomSets(e.target.value)} placeholder={selectedEx.sets} style={inputStyle} /></div>
                      <div><div style={{ fontSize: 9, color: "#4a5580", marginBottom: 3 }}>Reps</div><input value={exCustomReps} onChange={e => setExCustomReps(e.target.value)} placeholder={selectedEx.reps} style={inputStyle} /></div>
                      <div><div style={{ fontSize: 9, color: "#4a5580", marginBottom: 3 }}>Charge (kg)</div><input type="number" value={exWeight} onChange={e => setExWeight(e.target.value)} placeholder="—" style={inputStyle} /></div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setSelectedEx(null)} style={{ flex: 1, background: "#1e2a4a", border: "none", borderRadius: 8, padding: 10, color: "#4a5580", fontSize: 13, cursor: "pointer" }}>← Retour</button>
                      <button onClick={() => { addExFromDB(selectedEx, exWeight, exCustomSets, exCustomReps); setExPicker(false); }}
                        style={{ flex: 2, ...btnPrimary, padding: 10, fontSize: 13 }}>✓ Ajouter</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============ BODY ============ */}
      {activeTab === "body" && (
        <div style={{ animation: "slideUp .3s" }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Mesures</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><div style={{ fontSize: 9, color: "#4a5580", marginBottom: 3 }}>Poids (kg)</div><input type="number" step="0.1" value={today.weight} onChange={e => updateDay("weight", e.target.value)} style={{ ...inputStyle, fontSize: 16, fontWeight: 700 }} /></div>
              <div><div style={{ fontSize: 9, color: "#4a5580", marginBottom: 3 }}>Sommeil (h)</div><input type="number" step="0.5" value={today.sleepHours} onChange={e => updateDay("sleepHours", e.target.value)} style={{ ...inputStyle, fontSize: 16, fontWeight: 700 }} /></div>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Humeur</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {MOODS.map((m, i) => (
                <button key={i} onClick={() => updateDay("mood", i+1)} style={{ fontSize: 26, background: today.mood===i+1?"#1e3a5f":"transparent", border: today.mood===i+1?"2px solid #3b82f6":"2px solid transparent", borderRadius: 12, padding: "4px 8px", cursor: "pointer", filter: today.mood===i+1?"none":"grayscale(.5)" }}>{m}</button>
              ))}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Énergie</div>
            <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
              {ENERGY_LABELS.map((l, i) => (
                <button key={i} onClick={() => updateDay("energy", i+1)} style={{ flex: 1, padding: "7px 2px", borderRadius: 8, border: today.energy===i+1?"1px solid #3b82f6":"1px solid #2a3a5c", background: today.energy===i+1?"#1e3a5f":"#0a0e1a", color: today.energy===i+1?"#60a5fa":"#4a5580", fontSize: 9, fontWeight: 600, cursor: "pointer" }}>{l}</button>
              ))}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Qualité du sommeil</div>
            <div style={{ display: "flex", gap: 5 }}>
              {["Terrible","Mauvais","Moyen","Bon","Excellent"].map((l, i) => (
                <button key={i} onClick={() => updateDay("sleepQuality", i+1)} style={{ flex: 1, padding: "7px 2px", borderRadius: 8, border: today.sleepQuality===i+1?"1px solid #a78bfa":"1px solid #2a3a5c", background: today.sleepQuality===i+1?"#2d1b69":"#0a0e1a", color: today.sleepQuality===i+1?"#a78bfa":"#4a5580", fontSize: 9, fontWeight: 600, cursor: "pointer" }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Suppléments</div>
            {(today.supplements||[]).map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 10px", background: "#0a0e1a", borderRadius: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 12 }}>✅ <strong>{s.name}</strong> <span style={{ color: "#4a5580" }}>{s.dose}</span></span>
                <button onClick={() => removeSupplement(i)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}>×</button>
              </div>
            ))}
            {showAddSupplement ? (
              <div style={{ marginTop: 6, display: "flex", gap: 5 }}>
                <input placeholder="Nom" value={newSupplement.name} onChange={e => setNewSupplement({...newSupplement, name: e.target.value})} style={{ ...inputStyle, flex: 2 }} />
                <input placeholder="Dose" value={newSupplement.dose} onChange={e => setNewSupplement({...newSupplement, dose: e.target.value})} style={{ ...inputStyle, flex: 1 }} />
                <button onClick={addSupplement} style={{ ...btnPrimary, padding: "6px 10px" }}>✓</button>
                <button onClick={() => setShowAddSupplement(false)} style={{ background: "#1e2a4a", border: "none", borderRadius: 8, padding: "6px 10px", color: "#4a5580", cursor: "pointer" }}>✗</button>
              </div>
            ) : (
              <button onClick={() => setShowAddSupplement(true)} style={{ width: "100%", marginTop: 4, background: "none", border: "1px dashed #2a3a5c", borderRadius: 6, padding: "7px", color: "#4a5580", fontSize: 11, cursor: "pointer" }}>+ Ajouter</button>
            )}
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Notes du jour</div>
            <textarea value={today.notes} onChange={e => updateDay("notes", e.target.value)} placeholder="Ressenti, douleurs, observations..." style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} />
          </div>
        </div>
      )}

      {/* ============ COSTS ============ */}
      {activeTab === "costs" && (
        <div style={{ animation: "slideUp .3s" }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Dépenses du jour</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[{ l: "🍎 Alimentation", f: "food" }, { l: "💊 Suppléments", f: "supplements" }, { l: "🏋️ Sport", f: "gym" }, { l: "📦 Autre", f: "other" }].map(c => (
                <div key={c.f}><div style={{ fontSize: 9, color: "#4a5580", marginBottom: 3 }}>{c.l}</div><input type="number" step="0.01" value={today.costs?.[c.f]||""} onChange={e => updateNested(`costs.${c.f}`, e.target.value)} placeholder="0" style={{ ...inputStyle, color: "#fbbf24", fontWeight: 600 }} /></div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: 10, background: "#1a1a0e", border: "1px solid #3a3520", borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#4a5580" }}>Total jour</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#fbbf24", fontFamily: "'Space Mono'" }}>{totalCost.toFixed(2)}€</div>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Cumul total</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {(() => { const cats = { food: 0, supplements: 0, gym: 0, other: 0 }; Object.values(days).forEach(d => { if (d.costs) Object.keys(cats).forEach(k => cats[k] += parseFloat(d.costs[k]) || 0); }); const lbls = { food: "🍎 Alim.", supplements: "💊 Suppl.", gym: "🏋️ Sport", other: "📦 Autre" }; return Object.entries(cats).map(([k, v]) => (
                <div key={k} style={{ background: "#0a0e1a", borderRadius: 8, padding: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#4a5580" }}>{lbls[k]}</div><div style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24", fontFamily: "'Space Mono'" }}>{v.toFixed(0)}€</div>
                </div>
              )); })()}
            </div>
            <div style={{ marginTop: 10, padding: 10, background: "#1a1a0e", border: "1px solid #3a3520", borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#4a5580" }}>Total cumulé</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#fbbf24", fontFamily: "'Space Mono'" }}>{totalSpent.toFixed(2)}€</div>
            </div>
          </div>
        </div>
      )}

      {/* ============ HISTORY ============ */}
      {activeTab === "history" && (
        <div style={{ animation: "slideUp .3s" }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Courbe de poids</div>
            {weights.length > 1 ? (
              <div style={{ position: "relative", height: 150, background: "#0a0e1a", borderRadius: 8, overflow: "hidden" }}>
                {(() => {
                  const minW = Math.min(...weights.map(w => w.weight), profile.goalWeight) - 1;
                  const maxW = Math.max(...weights.map(w => w.weight), profile.startWeight) + 1;
                  const range = maxW - minW;
                  const goalY = ((maxW - profile.goalWeight) / range) * 130 + 10;
                  return (<>
                    <div style={{ position: "absolute", top: goalY, left: 0, right: 0, borderTop: "1px dashed #34d399", opacity: .3 }}>
                      <span style={{ position: "absolute", right: 4, top: -12, fontSize: 8, color: "#34d399" }}>{profile.goalWeight}kg</span>
                    </div>
                    <svg width="100%" height="150" style={{ position: "absolute", top: 0, left: 0 }}>
                      {weights.map((w, i) => {
                        const x = (i / (weights.length - 1)) * 92 + 4;
                        const y = ((maxW - w.weight) / range) * 130 + 10;
                        const next = weights[i + 1];
                        return (<g key={i}>
                          {next && <line x1={`${x}%`} y1={y} x2={`${((i+1)/(weights.length-1))*92+4}%`} y2={((maxW-next.weight)/range)*130+10} stroke="#3b82f6" strokeWidth="2" />}
                          <circle cx={`${x}%`} cy={y} r="3.5" fill="#60a5fa" />
                          <text x={`${x}%`} y={y-7} fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="Space Mono">{w.weight}</text>
                        </g>);
                      })}
                    </svg>
                  </>);
                })()}
              </div>
            ) : <div style={{ padding: 24, textAlign: "center", color: "#4a5580", fontSize: 12 }}>Enregistre ton poids sur plusieurs jours pour voir la courbe</div>}
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Journal</div>
            {sortedDays.length === 0 ? <div style={{ padding: 20, textAlign: "center", color: "#4a5580", fontSize: 12 }}>Aucune donnée</div> :
              [...sortedDays].reverse().map(d => {
                const day = days[d];
                const dc = day.meals?.reduce((s, m) => s + (m.calories||0), 0) || 0;
                return (
                  <button key={d} onClick={() => { setCurrentDate(d); setActiveTab("overview"); }}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "8px 10px", background: d===currentDate?"#1e3a5f":"#0a0e1a", border: d===currentDate?"1px solid #3b82f6":"1px solid #1e2a4a", borderRadius: 8, marginBottom: 3, cursor: "pointer", textAlign: "left", color: "#e0e6ef" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{formatDate(d)}</div>
                      <div style={{ fontSize: 9, color: "#4a5580", fontFamily: "'Space Mono'" }}>{day.weight?`${day.weight}kg`:"—"} | {day.sleepHours?`${day.sleepHours}h`:"—"} | {day.workout?.type||"—"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 600, color: "#60a5fa", fontFamily: "'Space Mono'" }}>{dc} kcal</div></div>
                  </button>
                );
              })
            }
          </div>
        </div>
      )}

      </div>
    </div>
  );
}

/**
 * YachtClean Pro — Client-side quoting formulas.
 *
 * Mirrors the backend core/quoting.py for instant preview
 * before server-side confirmation. All money in EUR.
 */

import type { FoulingType, SubstrateType, FinishType, CostBreakdown } from "./types";

// ── Rate Factors ─────────────────────────────────────────

export const FOULING_FACTORS: Record<FoulingType, number> = {
    bio_fouling: 0.7,
    heavy_oxidation: 0.85,
    old_antifouling: 0.6,
};

export const SUBSTRATE_FACTORS: Record<SubstrateType, number> = {
    carbon_fiber: 0.8,
    aluminum: 1.0,
    steel: 1.1,
};

export const FINISH_FACTORS: Record<FinishType, number> = {
    bare_clean: 1.0,
    pre_paint_ready: 0.9,
    mirror_polish: 0.7,
};

// ── Cost Constants ───────────────────────────────────────

export const BASE_ABLATION_RATE = 0.5; // m²/h
export const HOURLY_COST = 350; // €/h
export const SETUP_COST = 500; // €
export const MOBILIZATION_RATE = 2.5; // €/km

// ── Main Calculation ─────────────────────────────────────

export function calculateQuote(
    hullAreaM2: number,
    fouling: FoulingType,
    substrate: SubstrateType,
    finish: FinishType,
    distanceKm: number = 0
): CostBreakdown {
    if (hullAreaM2 <= 0) {
        throw new Error(`Hull area must be positive, got ${hullAreaM2}`);
    }

    const effectiveRate =
        BASE_ABLATION_RATE *
        FOULING_FACTORS[fouling] *
        SUBSTRATE_FACTORS[substrate] *
        FINISH_FACTORS[finish];

    const cleaningTimeH = hullAreaM2 / effectiveRate;
    const costCleaning = cleaningTimeH * HOURLY_COST;
    const costMobilization = distanceKm * MOBILIZATION_RATE;
    const costTotal = costCleaning + SETUP_COST + costMobilization;

    return {
        hull_area_m2: round2(hullAreaM2),
        effective_rate_m2h: round2(effectiveRate),
        cleaning_time_h: round2(cleaningTimeH),
        cost_cleaning: round2(costCleaning),
        cost_setup: SETUP_COST,
        cost_mobilization: round2(costMobilization),
        cost_total: round2(costTotal),
    };
}

// ── ROI / TCO (simplified client-side) ───────────────────

export interface TCOInputs {
    hullAreaM2: number;
    laserQuoteTotal: number;
    laserTimeH: number;
    years?: number;
    cleaningsPerYear?: number;
    dailyDowntimeCost?: number;
}

export interface TCOBreakdown {
    direct: number;
    waste: number;
    downtime: number;
    fines: number;
    damage: number;
    total: number;
}

export interface ROIComparison {
    laser: TCOBreakdown;
    sandblasting: TCOBreakdown;
    chemical: TCOBreakdown;
    roiPct: number;
    annualSavings: number;
}

export function calculateROI(inputs: TCOInputs): ROIComparison {
    const {
        hullAreaM2,
        laserQuoteTotal,
        laserTimeH,
        years = 1,
        cleaningsPerYear = 1,
        dailyDowntimeCost = 1500,
    } = inputs;

    const n = years * cleaningsPerYear;
    const workHoursPerDay = 8;

    // Laser
    const laserDowntimeDays = laserTimeH / workHoursPerDay;
    const laser: TCOBreakdown = {
        direct: laserQuoteTotal * n,
        waste: 0,
        downtime: laserDowntimeDays * dailyDowntimeCost * n,
        fines: 0,
        damage: 0,
        total: 0,
    };
    laser.total = laser.direct + laser.downtime;

    // Sandblasting
    const sbDowntimeDays = (laserTimeH * 2.5) / workHoursPerDay;
    const sandblasting: TCOBreakdown = {
        direct: hullAreaM2 * 80 * n,
        waste: hullAreaM2 * 15 * n,
        downtime: sbDowntimeDays * dailyDowntimeCost * n,
        fines: 2000 * years,
        damage: 3000 * n,
        total: 0,
    };
    sandblasting.total =
        sandblasting.direct +
        sandblasting.waste +
        sandblasting.downtime +
        sandblasting.fines +
        sandblasting.damage;

    // Chemical
    const chDowntimeDays = (laserTimeH * 3.0) / workHoursPerDay;
    const chemical: TCOBreakdown = {
        direct: hullAreaM2 * 55 * n,
        waste: hullAreaM2 * 25 * n,
        downtime: chDowntimeDays * dailyDowntimeCost * n,
        fines: 5000 * years,
        damage: 1500 * n,
        total: 0,
    };
    chemical.total =
        chemical.direct +
        chemical.waste +
        chemical.downtime +
        chemical.fines +
        chemical.damage;

    // ROI
    const bestTrad = Math.min(sandblasting.total, chemical.total);
    const roiPct = bestTrad > 0 ? ((bestTrad - laser.total) / bestTrad) * 100 : 0;

    return {
        laser,
        sandblasting,
        chemical,
        roiPct: round1(roiPct),
        annualSavings: round2((bestTrad - laser.total) / Math.max(years, 1)),
    };
}

// ── Helpers ──────────────────────────────────────────────

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}

function round1(n: number): number {
    return Math.round(n * 10) / 10;
}

/** Format EUR currency */
export function formatEUR(amount: number): string {
    return new Intl.NumberFormat("en-EU", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/** Format hours with 1 decimal */
export function formatHours(h: number): string {
    return `${h.toFixed(1)}h`;
}

/** Format m² with 1 decimal */
export function formatArea(m2: number): string {
    return `${m2.toFixed(1)} m²`;
}

/**
 * Nuclear Physics — Client-side formulas for real-time UI calculations.
 *
 * Implements:
 *   - Inverse Square Law:     I(r) = I₀ · (r₀/r)²
 *   - Radioactive Decay:      A(t) = A₀ · e^(-λt)
 *   - Shielding Attenuation:  I = I₀ · e^(-μx)
 *   - Decontamination Factor: DF = Aᵢ / Aꜰ
 */

export const LN2 = Math.LN2; // 0.693147...

// ── Isotope Database ─────────────────────────────────────

export interface IsotopeInfo {
    name: string;
    halfLifeSeconds: number;
    halfLifeHuman: string;
    category: "fission" | "activation" | "natural" | "transuranic";
}

export const ISOTOPES: Record<string, IsotopeInfo> = {
    "Co-60": { name: "Cobalto-60", halfLifeSeconds: 1.664e8, halfLifeHuman: "5.27 años", category: "activation" },
    "Cs-137": { name: "Cesio-137", halfLifeSeconds: 9.523e8, halfLifeHuman: "30.17 años", category: "fission" },
    "Sr-90": { name: "Estroncio-90", halfLifeSeconds: 9.085e8, halfLifeHuman: "28.8 años", category: "fission" },
    "I-131": { name: "Yodo-131", halfLifeSeconds: 6.930e5, halfLifeHuman: "8.02 días", category: "fission" },
    "H-3": { name: "Tritio", halfLifeSeconds: 3.888e8, halfLifeHuman: "12.32 años", category: "activation" },
    "Pu-239": { name: "Plutonio-239", halfLifeSeconds: 7.608e11, halfLifeHuman: "24,110 años", category: "transuranic" },
    "Am-241": { name: "Americio-241", halfLifeSeconds: 1.364e10, halfLifeHuman: "432.2 años", category: "transuranic" },
    "U-235": { name: "Uranio-235", halfLifeSeconds: 2.221e16, halfLifeHuman: "704M años", category: "natural" },
    "U-238": { name: "Uranio-238", halfLifeSeconds: 1.410e17, halfLifeHuman: "4,468M años", category: "natural" },
    "Ra-226": { name: "Radio-226", halfLifeSeconds: 5.049e10, halfLifeHuman: "1,600 años", category: "natural" },
    "C-14": { name: "Carbono-14", halfLifeSeconds: 1.808e11, halfLifeHuman: "5,730 años", category: "natural" },
};

// ── Shielding Materials ──────────────────────────────────

export interface ShieldMaterial {
    name: string;
    nameEs: string;
    mu: number;         // cm⁻¹ at 1 MeV
    hvl: number;        // Half-Value Layer (cm)
    color: string;      // UI color
}

export const SHIELD_MATERIALS: Record<string, ShieldMaterial> = {
    lead: { name: "Lead", nameEs: "Plomo", mu: 0.7721, hvl: 0.90, color: "#64748b" },
    steel: { name: "Steel", nameEs: "Acero", mu: 0.4655, hvl: 1.49, color: "#94a3b8" },
    concrete: { name: "Concrete", nameEs: "Hormigón", mu: 0.1495, hvl: 4.64, color: "#a1a1aa" },
    water: { name: "Water", nameEs: "Agua", mu: 0.0707, hvl: 9.80, color: "#38bdf8" },
    polyethylene: { name: "Polyethylene", nameEs: "Polietileno", mu: 0.0481, hvl: 14.40, color: "#f1f5f9" },
};

// ── Inverse Square Law ───────────────────────────────────

export interface InverseSquareResult {
    intensity: number;
    safeDistance: number;
    safetyFactor: number;
}

export function inverseSquareLaw(
    sourceIntensity: number,
    distance: number,
    safeLimit: number = 2.5,
    refDistance: number = 1.0,
): InverseSquareResult {
    const intensity = sourceIntensity * (refDistance / distance) ** 2;
    const safeDistance = safeLimit > 0 && sourceIntensity > safeLimit
        ? refDistance * Math.sqrt(sourceIntensity / safeLimit)
        : refDistance;
    return {
        intensity: Math.round(intensity * 10000) / 10000,
        safeDistance: Math.round(safeDistance * 100) / 100,
        safetyFactor: Math.round((safeLimit / Math.max(intensity, 1e-10)) * 1000) / 1000,
    };
}

// ── Radioactive Decay ────────────────────────────────────

export interface DecayResult {
    remaining: number;
    fraction: number;
    halfLivesElapsed: number;
}

export function radioactiveDecay(
    initialActivity: number,
    elapsedSeconds: number,
    halfLifeSeconds: number,
): DecayResult {
    const lambda = LN2 / halfLifeSeconds;
    const remaining = initialActivity * Math.exp(-lambda * elapsedSeconds);
    return {
        remaining: Math.round(remaining * 10000) / 10000,
        fraction: remaining / Math.max(initialActivity, 1e-30),
        halfLivesElapsed: Math.round((elapsedSeconds / halfLifeSeconds) * 10000) / 10000,
    };
}

// ── Shielding Attenuation ────────────────────────────────

export interface ShieldingResult {
    attenuated: number;
    reductionPct: number;
    factor: number;
}

export function shieldingAttenuation(
    initialIntensity: number,
    thicknessCm: number,
    mu: number,
): ShieldingResult {
    const factor = Math.exp(-mu * thicknessCm);
    return {
        attenuated: Math.round(initialIntensity * factor * 1000000) / 1000000,
        reductionPct: Math.round((1 - factor) * 10000) / 100,
        factor: Math.round(factor * 100000000) / 100000000,
    };
}

// ── Decontamination Factor ───────────────────────────────

export interface DFResult {
    df: number;
    efficiencyPct: number;
    classification: "low" | "moderate" | "high" | "exceptional";
    classificationEs: string;
    color: string;
}

export function decontaminationFactor(
    initialBq: number,
    finalBq: number,
): DFResult {
    const df = initialBq / Math.max(finalBq, 1e-10);
    const eff = df > 1 ? (1 - 1 / df) * 100 : 0;

    let classification: DFResult["classification"];
    let classificationEs: string;
    let color: string;

    if (df >= 100) {
        classification = "exceptional";
        classificationEs = "Excepcional";
        color = "#10b981";
    } else if (df >= 10) {
        classification = "high";
        classificationEs = "Alto";
        color = "#06b6d4";
    } else if (df >= 2) {
        classification = "moderate";
        classificationEs = "Moderado";
        color = "#f59e0b";
    } else {
        classification = "low";
        classificationEs = "Bajo";
        color = "#ef4444";
    }

    return {
        df: Math.round(df * 100) / 100,
        efficiencyPct: Math.round(eff * 100) / 100,
        classification,
        classificationEs,
        color,
    };
}

// ── Danger Zone Classification ───────────────────────────

export function dangerLevel(intensity: number): {
    level: string; levelEs: string; color: string;
} {
    if (intensity >= 100) return { level: "critical", levelEs: "CRÍTICO", color: "#dc2626" };
    if (intensity >= 20) return { level: "danger", levelEs: "PELIGRO", color: "#ef4444" };
    if (intensity >= 2.5) return { level: "caution", levelEs: "PRECAUCIÓN", color: "#f59e0b" };
    return { level: "safe", levelEs: "SEGURO", color: "#10b981" };
}

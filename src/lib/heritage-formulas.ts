/**
 * Heritage Integrity Dashboard — Client-side formulas.
 *
 * Contains ΔE calculation, thermal threshold checks,
 * and classification utilities for real-time UI feedback.
 */

// ── CIELAB ΔE (CIE76) ───────────────────────────────────

export interface CIELABColor {
    L: number;  // 0–100
    a: number;  // −128 to +127
    b: number;  // −128 to +127
}

export interface DeltaEResult {
    deltaE: number;
    classification: "imperceptible" | "acceptable" | "noticeable" | "significant";
    classificationEs: string;
    patinaPreserved: boolean;
    color: string;  // CSS color for badges
}

export function calculateDeltaE(before: CIELABColor, after: CIELABColor): number {
    return Math.sqrt(
        (after.L - before.L) ** 2 +
        (after.a - before.a) ** 2 +
        (after.b - before.b) ** 2
    );
}

export function classifyDeltaE(deltaE: number): DeltaEResult {
    if (deltaE < 1.0) {
        return {
            deltaE: Math.round(deltaE * 1000) / 1000,
            classification: "imperceptible",
            classificationEs: "Imperceptible",
            patinaPreserved: true,
            color: "#10b981",
        };
    } else if (deltaE < 3.0) {
        return {
            deltaE: Math.round(deltaE * 1000) / 1000,
            classification: "acceptable",
            classificationEs: "Aceptable",
            patinaPreserved: true,
            color: "#06b6d4",
        };
    } else if (deltaE < 5.0) {
        return {
            deltaE: Math.round(deltaE * 1000) / 1000,
            classification: "noticeable",
            classificationEs: "Notable",
            patinaPreserved: false,
            color: "#f59e0b",
        };
    } else {
        return {
            deltaE: Math.round(deltaE * 1000) / 1000,
            classification: "significant",
            classificationEs: "Significativo",
            patinaPreserved: false,
            color: "#ef4444",
        };
    }
}

// ── Thermal ──────────────────────────────────────────────

export interface ThermalCheck {
    safe: boolean;
    temperature: number;
    threshold: number;
    excess: number;
    severity: "safe" | "warning" | "critical";
    color: string;
}

export function checkThermalThreshold(
    temperature: number,
    threshold: number = 50.0,
): ThermalCheck {
    const excess = Math.max(0, temperature - threshold);
    let severity: ThermalCheck["severity"] = "safe";
    let color = "#10b981";

    if (temperature >= 60) {
        severity = "critical";
        color = "#dc2626";
    } else if (temperature >= threshold) {
        severity = "warning";
        color = "#f59e0b";
    }

    return {
        safe: temperature < threshold,
        temperature,
        threshold,
        excess: Math.round(excess * 10) / 10,
        severity,
        color,
    };
}

// ── CIELAB → sRGB approximation (for color preview) ─────

export function labToRgb(L: number, a: number, b: number): string {
    // CIELAB → XYZ (D65 illuminant)
    let y = (L + 16) / 116;
    let x = a / 500 + y;
    let z = y - b / 200;

    const f = (t: number) =>
        t > 0.206897 ? t ** 3 : (t - 16 / 116) / 7.787;

    x = f(x) * 0.95047;
    y = f(y) * 1.0;
    z = f(z) * 1.08883;

    // XYZ → linear sRGB
    let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    let bl = x * 0.0557 + y * -0.2040 + z * 1.0570;

    // Gamma correction
    const gamma = (c: number) =>
        c > 0.0031308 ? 1.055 * c ** (1 / 2.4) - 0.055 : 12.92 * c;

    r = Math.round(Math.max(0, Math.min(1, gamma(r))) * 255);
    g = Math.round(Math.max(0, Math.min(1, gamma(g))) * 255);
    bl = Math.round(Math.max(0, Math.min(1, gamma(bl))) * 255);

    return `rgb(${r}, ${g}, ${bl})`;
}

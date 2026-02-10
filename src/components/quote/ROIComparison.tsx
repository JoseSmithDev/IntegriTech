/**
 * ROIComparison — Stacked bar chart comparing TCO across methods.
 *
 * Renders a visual bar chart (pure CSS, no external charting lib needed)
 * showing Laser vs. Sandblasting vs. Chemical with cost-category breakdown.
 */

"use client";

import React, { useMemo } from "react";
import { calculateROI, formatEUR, type TCOInputs } from "../../lib/formulas";
import { CHART_COLORS } from "../../lib/constants";

// ── Props ────────────────────────────────────────────────

interface ROIComparisonProps {
    hullAreaM2: number;
    laserQuoteTotal: number;
    laserTimeH: number;
    years?: number;
    cleaningsPerYear?: number;
}

// ── Cost Categories ──────────────────────────────────────

const CATEGORIES = [
    { key: "direct", label: "Costo Directo", color: "#3b82f6" },
    { key: "waste", label: "Residuos", color: "#f59e0b" },
    { key: "downtime", label: "Inactividad", color: "#8b5cf6" },
    { key: "fines", label: "Multas Amb.", color: "#ef4444" },
    { key: "damage", label: "Reparaciones", color: "#f97316" },
] as const;

type CatKey = (typeof CATEGORIES)[number]["key"];

// ── Component ───────────────────────────────────────────

export default function ROIComparison({
    hullAreaM2,
    laserQuoteTotal,
    laserTimeH,
    years = 1,
    cleaningsPerYear = 1,
}: ROIComparisonProps) {
    const roi = useMemo(
        () =>
            calculateROI({
                hullAreaM2,
                laserQuoteTotal,
                laserTimeH,
                years,
                cleaningsPerYear,
            }),
        [hullAreaM2, laserQuoteTotal, laserTimeH, years, cleaningsPerYear]
    );

    const methods = [
        { key: "laser", label: "⚡ Láser", data: roi.laser, color: CHART_COLORS.laser },
        { key: "sandblasting", label: "🔨 Arenado", data: roi.sandblasting, color: CHART_COLORS.sandblasting },
        { key: "chemical", label: "🧪 Químico", data: roi.chemical, color: CHART_COLORS.chemical },
    ] as const;

    const maxTotal = Math.max(...methods.map((m) => m.data.total));

    return (
        <div style={styles.card}>
            <h3 style={styles.title}>📊 Costo Total de Propiedad (TCO)</h3>
            <p style={styles.subtitle}>
                Comparativa {years} años · {cleaningsPerYear}× limpieza/año
            </p>

            {/* Bar chart */}
            <div style={styles.chartContainer}>
                {methods.map((method) => {
                    const barWidth = maxTotal > 0 ? (method.data.total / maxTotal) * 100 : 0;
                    return (
                        <div key={method.key} style={styles.barRow}>
                            <div style={styles.barLabel}>
                                <span>{method.label}</span>
                                <span style={{ fontWeight: 700, color: method.color }}>
                                    {formatEUR(method.data.total)}
                                </span>
                            </div>
                            <div style={styles.barTrack}>
                                <div
                                    style={{
                                        ...styles.barFill,
                                        width: `${barWidth}%`,
                                        background: method.color,
                                    }}
                                />
                                {/* Stacked segments */}
                                <div style={styles.barSegments}>
                                    {CATEGORIES.map((cat) => {
                                        const value = method.data[cat.key as CatKey];
                                        if (value <= 0) return null;
                                        const segWidth = maxTotal > 0 ? (value / maxTotal) * 100 : 0;
                                        return (
                                            <div
                                                key={cat.key}
                                                style={{
                                                    width: `${segWidth}%`,
                                                    height: "100%",
                                                    background: cat.color,
                                                    opacity: 0.85,
                                                }}
                                                title={`${cat.label}: ${formatEUR(value)}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div style={styles.legend}>
                {CATEGORIES.map((cat) => (
                    <div key={cat.key} style={styles.legendItem}>
                        <div
                            style={{ ...styles.legendDot, background: cat.color }}
                        />
                        <span>{cat.label}</span>
                    </div>
                ))}
            </div>

            {/* Savings callout */}
            <div style={styles.savingsCard}>
                <div style={styles.savingsLabel}>Ahorro con Láser</div>
                <div style={styles.savingsRow}>
                    <div style={styles.savingsStat}>
                        <span style={styles.savingsValue}>
                            {roi.roiPct > 0 ? "+" : ""}
                            {roi.roiPct}%
                        </span>
                        <span style={styles.savingsCaption}>ROI</span>
                    </div>
                    <div style={styles.savingsDivider} />
                    <div style={styles.savingsStat}>
                        <span style={styles.savingsValue}>
                            {formatEUR(roi.annualSavings)}
                        </span>
                        <span style={styles.savingsCaption}>Ahorro Anual</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Styles ───────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    card: {
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 16,
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    title: {
        margin: 0,
        fontSize: 20,
        fontWeight: 700,
        color: "#f1f5f9",
    },
    subtitle: {
        margin: 0,
        fontSize: 13,
        color: "#64748b",
    },
    chartContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    barRow: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },
    barLabel: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 14,
        color: "#cbd5e1",
        fontWeight: 500,
    },
    barTrack: {
        height: 28,
        borderRadius: 8,
        background: "rgba(30, 41, 59, 0.6)",
        overflow: "hidden",
        position: "relative" as const,
    },
    barFill: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        height: "100%",
        borderRadius: 8,
        opacity: 0.15,
        transition: "width 0.6s ease",
    },
    barSegments: {
        display: "flex",
        height: "100%",
        position: "relative" as const,
        zIndex: 1,
    },
    legend: {
        display: "flex",
        flexWrap: "wrap" as const,
        gap: 12,
        paddingTop: 4,
    },
    legendItem: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: "#94a3b8",
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 3,
    },
    savingsCard: {
        background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.1) 100%)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        borderRadius: 12,
        padding: 20,
        textAlign: "center" as const,
    },
    savingsLabel: {
        fontSize: 13,
        fontWeight: 600,
        color: "#10b981",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
        marginBottom: 12,
    },
    savingsRow: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
    },
    savingsStat: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
    },
    savingsValue: {
        fontSize: 28,
        fontWeight: 800,
        color: "#10b981",
        fontVariantNumeric: "tabular-nums",
    },
    savingsCaption: {
        fontSize: 12,
        color: "#94a3b8",
    },
    savingsDivider: {
        width: 1,
        height: 40,
        background: "rgba(255, 255, 255, 0.1)",
    },
};

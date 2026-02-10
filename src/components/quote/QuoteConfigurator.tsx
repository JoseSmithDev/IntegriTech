/**
 * QuoteConfigurator — Interactive form for generating a cleaning quote.
 *
 * Lets the user select fouling type, substrate, and finish, then shows
 * a real-time cost preview computed client-side before server confirmation.
 */

"use client";

import React, { useState, useMemo } from "react";
import {
    calculateQuote,
    formatEUR,
    formatHours,
    formatArea,
} from "../../lib/formulas";
import {
    FOULING_LABELS,
    SUBSTRATE_LABELS,
    FINISH_LABELS,
} from "../../lib/types";
import type { FoulingType, SubstrateType, FinishType } from "../../lib/types";

// ── Props ────────────────────────────────────────────────

interface QuoteConfiguratorProps {
    /** Hull area from mesh analysis */
    hullAreaM2: number;
    /** Default substrate from yacht record */
    defaultSubstrate?: SubstrateType;
    /** Callback with the computed quote */
    onQuoteReady?: (quote: ReturnType<typeof calculateQuote>) => void;
    /** Callback when substrate changes */
    onSubstrateChange?: (substrate: SubstrateType) => void;
}

// ── Component ───────────────────────────────────────────

// Spanish Translations
const FOULING_ES: Record<FoulingType, string> = {
    bio_fouling: "Incrustaciones Biológicas",
    heavy_oxidation: "Oxidación Severa / Óxido",
    old_antifouling: "Pintura Antifouling Vieja",
};

const SUBSTRATE_ES: Record<SubstrateType, string> = {
    aluminum: "Aluminio 5083",
    steel: "Acero Naval",
    carbon_fiber: "Fibra de Carbono / Gelcoat",
};

const FINISH_ES: Record<FinishType, string> = {
    bare_clean: "Limpieza Básica (Sa 2.5)",
    pre_paint_ready: "Listo para Pintar (Ra 4-6)",
    mirror_polish: "Pulido Espejo",
};

export default function QuoteConfigurator({
    hullAreaM2,
    defaultSubstrate = "aluminum",
    onQuoteReady,
    onSubstrateChange,
}: QuoteConfiguratorProps) {
    const [fouling, setFouling] = useState<FoulingType>("bio_fouling");
    const [substrate, setSubstrate] = useState<SubstrateType>(defaultSubstrate);
    const [finish, setFinish] = useState<FinishType>("bare_clean");
    const [distanceKm, setDistanceKm] = useState(0);

    const handleSubstrateChange = (s: SubstrateType) => {
        setSubstrate(s);
        onSubstrateChange?.(s);
    };

    // Real-time client-side preview
    const quote = useMemo(() => {
        if (hullAreaM2 <= 0) return null;
        return calculateQuote(hullAreaM2, fouling, substrate, finish, distanceKm);
    }, [hullAreaM2, fouling, substrate, finish, distanceKm]);

    const handleSubmit = () => {
        if (quote && onQuoteReady) {
            onQuoteReady(quote);
        }
    };

    return (
        <div style={styles.card}>
            <h3 style={styles.title}>⚡ Configurador de Presupuesto</h3>

            {/* Hull Area (read-only) */}
            <div style={styles.field}>
                <label style={styles.label}>Área del Casco</label>
                <div style={styles.readonlyValue}>{formatArea(hullAreaM2)}</div>
            </div>

            {/* Fouling Type */}
            <div style={styles.field}>
                <label style={styles.label}>Tipo de Suciedad</label>
                <div style={styles.radioGroup}>
                    {(Object.keys(FOULING_LABELS) as FoulingType[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => setFouling(key)}
                            style={{
                                ...styles.radioButton,
                                ...(fouling === key ? styles.radioActive : {}),
                            }}
                        >
                            {FOULING_ES[key]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Substrate Material */}
            <div style={styles.field}>
                <label style={styles.label}>Material del Sustrato</label>
                <div style={styles.radioGroup}>
                    {(Object.keys(SUBSTRATE_LABELS) as SubstrateType[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => handleSubstrateChange(key)}
                            style={{
                                ...styles.radioButton,
                                ...(substrate === key ? styles.radioActive : {}),
                            }}
                        >
                            {SUBSTRATE_ES[key]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desired Finish */}
            <div style={styles.field}>
                <label style={styles.label}>Acabado Deseado</label>
                <div style={styles.radioGroup}>
                    {(Object.keys(FINISH_LABELS) as FinishType[]).map((key) => (
                        <button
                            key={key}
                            onClick={() => setFinish(key)}
                            style={{
                                ...styles.radioButton,
                                ...(finish === key ? styles.radioActive : {}),
                            }}
                        >
                            {FINISH_ES[key]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobilization Distance */}
            <div style={styles.field}>
                <label style={styles.label}>Distancia de Movilización (km)</label>
                <input
                    type="number"
                    min={0}
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Math.max(0, Number(e.target.value)))}
                    style={styles.input}
                />
            </div>

            {/* Divider */}
            <div style={styles.divider} />

            {/* Cost Preview */}
            {quote && (
                <div style={styles.preview}>
                    <h4 style={styles.previewTitle}>Vista Previa de Costos</h4>
                    <div style={styles.previewRow}>
                        <span>Tasa Efectiva</span>
                        <span>{quote.effective_rate_m2h} m²/h</span>
                    </div>
                    <div style={styles.previewRow}>
                        <span>Tiempo Limpieza</span>
                        <span>{formatHours(quote.cleaning_time_h)}</span>
                    </div>
                    <div style={styles.previewRow}>
                        <span>Costo Limpieza</span>
                        <span>{formatEUR(quote.cost_cleaning)}</span>
                    </div>
                    <div style={styles.previewRow}>
                        <span>Tarifa Preparación</span>
                        <span>{formatEUR(quote.cost_setup)}</span>
                    </div>
                    {quote.cost_mobilization > 0 && (
                        <div style={styles.previewRow}>
                            <span>Movilización</span>
                            <span>{formatEUR(quote.cost_mobilization)}</span>
                        </div>
                    )}
                    <div style={{ ...styles.previewRow, ...styles.totalRow }}>
                        <span>Total</span>
                        <span style={styles.totalValue}>
                            {formatEUR(quote.cost_total)}
                        </span>
                    </div>
                </div>
            )}

            <button onClick={handleSubmit} style={styles.submitButton}>
                Generar Presupuesto Oficial →
            </button>
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
        letterSpacing: "-0.02em",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontWeight: 600,
        color: "#94a3b8",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
    },
    readonlyValue: {
        fontSize: 24,
        fontWeight: 700,
        color: "#06b6d4",
        fontVariantNumeric: "tabular-nums",
    },
    radioGroup: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap" as const,
    },
    radioButton: {
        padding: "8px 14px",
        borderRadius: 8,
        border: "1px solid rgba(255, 255, 255, 0.12)",
        background: "rgba(30, 41, 59, 0.6)",
        color: "#cbd5e1",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 500,
        transition: "all 0.2s",
        outline: "none",
    },
    radioActive: {
        background: "rgba(6, 182, 212, 0.15)",
        borderColor: "#06b6d4",
        color: "#06b6d4",
        fontWeight: 600,
    },
    input: {
        padding: "10px 14px",
        borderRadius: 8,
        border: "1px solid rgba(255, 255, 255, 0.12)",
        background: "rgba(30, 41, 59, 0.6)",
        color: "#f1f5f9",
        fontSize: 15,
        outline: "none",
        width: 120,
    },
    divider: {
        height: 1,
        background: "rgba(255, 255, 255, 0.06)",
    },
    preview: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    previewTitle: {
        margin: 0,
        fontSize: 15,
        fontWeight: 600,
        color: "#e2e8f0",
    },
    previewRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 14,
        color: "#94a3b8",
    },
    totalRow: {
        borderTop: "1px solid rgba(255,255,255,0.1)",
        paddingTop: 10,
        marginTop: 4,
        fontSize: 16,
        fontWeight: 700,
        color: "#f1f5f9",
    },
    totalValue: {
        color: "#10b981",
        fontSize: 20,
    },
    submitButton: {
        padding: "14px 24px",
        borderRadius: 12,
        border: "none",
        background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
        color: "#fff",
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 4px 16px rgba(6, 182, 212, 0.3)",
    },
};

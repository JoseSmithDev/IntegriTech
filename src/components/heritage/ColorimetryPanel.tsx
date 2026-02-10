/**
 * ColorimetryPanel — CIELAB ΔE calculator with real-time color preview.
 *
 * Allows before/after color measurements and computes ΔE to verify patina preservation.
 */

"use client";

import React, { useState, useMemo } from "react";
import {
    calculateDeltaE,
    classifyDeltaE,
    labToRgb,
    type CIELABColor,
} from "../../lib/heritage-formulas";

interface ColorimetryPanelProps {
    onMeasurementAdd?: (measurement: {
        before: CIELABColor;
        after: CIELABColor;
        deltaE: number;
        patinaPreserved: boolean;
    }) => void;
}

export default function ColorimetryPanel({ onMeasurementAdd }: ColorimetryPanelProps) {
    const [beforeL, setBeforeL] = useState(65);
    const [beforeA, setBeforeA] = useState(5);
    const [beforeB, setBeforeB] = useState(20);

    const [afterL, setAfterL] = useState(68);
    const [afterA, setAfterA] = useState(4);
    const [afterB, setAfterB] = useState(18);

    const [history, setHistory] = useState<Array<{ id: string; deltaE: number; classification: string; color: string }>>([]);

    const before: CIELABColor = { L: beforeL, a: beforeA, b: beforeB };
    const after: CIELABColor = { L: afterL, a: afterA, b: afterB };

    const deltaE = useMemo(() => calculateDeltaE(before, after), [beforeL, beforeA, beforeB, afterL, afterA, afterB]);
    const result = useMemo(() => classifyDeltaE(deltaE), [deltaE]);

    const beforeRgb = useMemo(() => labToRgb(beforeL, beforeA, beforeB), [beforeL, beforeA, beforeB]);
    const afterRgb = useMemo(() => labToRgb(afterL, afterA, afterB), [afterL, afterA, afterB]);

    const handleSave = () => {
        const entry = {
            id: `cm-${Date.now()}`,
            deltaE: result.deltaE,
            classification: result.classificationEs,
            color: result.color,
        };
        setHistory((prev) => [entry, ...prev].slice(0, 10));
        onMeasurementAdd?.({
            before,
            after,
            deltaE: result.deltaE,
            patinaPreserved: result.patinaPreserved,
        });
    };

    return (
        <div style={styles.wrapper}>
            <h4 style={styles.title}>🎨 Validación Colorimétrica (CIELAB ΔE)</h4>

            <div style={styles.panels}>
                {/* Before */}
                <div style={styles.panel}>
                    <div style={styles.panelHeader}>
                        <span style={styles.panelLabel}>ANTES</span>
                        <div style={{ ...styles.colorPreview, background: beforeRgb }} />
                    </div>
                    <div style={styles.sliders}>
                        <SliderRow label="L* (Luminosidad)" value={beforeL} min={0} max={100} onChange={setBeforeL} color="#f1f5f9" />
                        <SliderRow label="a* (Verde↔Rojo)" value={beforeA} min={-128} max={127} onChange={setBeforeA} color="#ef4444" />
                        <SliderRow label="b* (Azul↔Amarillo)" value={beforeB} min={-128} max={127} onChange={setBeforeB} color="#eab308" />
                    </div>
                </div>

                {/* After */}
                <div style={styles.panel}>
                    <div style={styles.panelHeader}>
                        <span style={styles.panelLabel}>DESPUÉS</span>
                        <div style={{ ...styles.colorPreview, background: afterRgb }} />
                    </div>
                    <div style={styles.sliders}>
                        <SliderRow label="L* (Luminosidad)" value={afterL} min={0} max={100} onChange={setAfterL} color="#f1f5f9" />
                        <SliderRow label="a* (Verde↔Rojo)" value={afterA} min={-128} max={127} onChange={setAfterA} color="#ef4444" />
                        <SliderRow label="b* (Azul↔Amarillo)" value={afterB} min={-128} max={127} onChange={setAfterB} color="#eab308" />
                    </div>
                </div>
            </div>

            {/* Result */}
            <div style={{
                ...styles.resultCard,
                borderColor: `${result.color}44`,
                boxShadow: `0 0 20px ${result.color}11`,
            }}>
                <div style={styles.resultRow}>
                    <div>
                        <div style={styles.deltaLabel}>ΔE</div>
                        <div style={{ ...styles.deltaValue, color: result.color }}>
                            {result.deltaE.toFixed(3)}
                        </div>
                    </div>
                    <div style={styles.resultRight}>
                        <span style={{
                            ...styles.classBadge,
                            background: `${result.color}22`,
                            color: result.color,
                            borderColor: `${result.color}44`,
                        }}>
                            {result.classificationEs}
                        </span>
                        <span style={{
                            ...styles.patinaBadge,
                            background: result.patinaPreserved ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                            color: result.patinaPreserved ? "#10b981" : "#ef4444",
                        }}>
                            {result.patinaPreserved ? "✅ Pátina Preservada" : "❌ Pátina en Riesgo"}
                        </span>
                    </div>
                </div>

                {/* Scale */}
                <div style={styles.scale}>
                    <div style={styles.scaleBar}>
                        <div style={{ ...styles.scaleSegment, flex: 1, background: "#10b981" }} />
                        <div style={{ ...styles.scaleSegment, flex: 2, background: "#06b6d4" }} />
                        <div style={{ ...styles.scaleSegment, flex: 2, background: "#f59e0b" }} />
                        <div style={{ ...styles.scaleSegment, flex: 5, background: "#ef4444" }} />
                    </div>
                    <div style={styles.scaleLabels}>
                        <span>0</span><span>1</span><span>3</span><span>5</span><span>10+</span>
                    </div>
                    {/* Marker */}
                    <div style={{
                        ...styles.scaleMarker,
                        left: `${Math.min(100, (deltaE / 10) * 100)}%`,
                    }}>
                        ▲
                    </div>
                </div>

                <button onClick={handleSave} style={styles.saveBtn}>
                    💾 Guardar Medición
                </button>
            </div>

            {/* History */}
            {history.length > 0 && (
                <div style={styles.history}>
                    <h5 style={styles.historyTitle}>Historial de Mediciones</h5>
                    <div style={styles.historyList}>
                        {history.map((h) => (
                            <div key={h.id} style={styles.historyItem}>
                                <span style={{ ...styles.historyDot, background: h.color }} />
                                <span style={{ color: h.color, fontWeight: 700, minWidth: 50 }}>
                                    ΔE {h.deltaE.toFixed(2)}
                                </span>
                                <span style={{ color: "#94a3b8", fontSize: 11 }}>{h.classification}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Slider Sub-component ─────────────────────────────────

function SliderRow({ label, value, min, max, onChange, color }: {
    label: string; value: number; min: number; max: number;
    onChange: (v: number) => void; color: string;
}) {
    return (
        <div style={styles.sliderRow}>
            <div style={styles.sliderHeader}>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
            </div>
            <input
                type="range" min={min} max={max} value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{ width: "100%" }}
            />
        </div>
    );
}

// ── Styles ───────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        display: "flex", flexDirection: "column", gap: 16,
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        borderRadius: 16, padding: 20,
        border: "1px solid rgba(255,255,255,0.08)",
    },
    title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    panels: {
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
    },
    panel: {
        display: "flex", flexDirection: "column", gap: 10,
        background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 14,
        border: "1px solid rgba(255,255,255,0.06)",
    },
    panelHeader: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
    },
    panelLabel: {
        fontSize: 11, fontWeight: 700, color: "#94a3b8",
        letterSpacing: "0.05em",
    },
    colorPreview: {
        width: 36, height: 36, borderRadius: 8,
        border: "2px solid rgba(255,255,255,0.1)",
    },
    sliders: { display: "flex", flexDirection: "column", gap: 6 },
    sliderRow: { display: "flex", flexDirection: "column", gap: 2 },
    sliderHeader: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
    },
    resultCard: {
        background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 16,
        border: "1px solid", display: "flex", flexDirection: "column", gap: 12,
    },
    resultRow: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
    },
    deltaLabel: { fontSize: 12, color: "#64748b", fontWeight: 600 },
    deltaValue: { fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 },
    resultRight: { display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" },
    classBadge: {
        fontSize: 11, fontWeight: 700, padding: "4px 10px",
        borderRadius: 6, border: "1px solid",
        textTransform: "uppercase" as const, letterSpacing: "0.05em",
    },
    patinaBadge: {
        fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
    },
    scale: { position: "relative", paddingBottom: 20 },
    scaleBar: {
        display: "flex", height: 6, borderRadius: 3, overflow: "hidden",
    },
    scaleSegment: { height: "100%" },
    scaleLabels: {
        display: "flex", justifyContent: "space-between",
        fontSize: 9, color: "#475569", marginTop: 4,
    },
    scaleMarker: {
        position: "absolute", bottom: 0, transform: "translateX(-50%)",
        fontSize: 10, color: "#f1f5f9",
    },
    saveBtn: {
        padding: "8px 16px", borderRadius: 8,
        background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)",
        color: "#06b6d4", fontWeight: 600, fontSize: 13, cursor: "pointer",
    },
    history: { display: "flex", flexDirection: "column", gap: 6 },
    historyTitle: { margin: 0, fontSize: 13, fontWeight: 600, color: "#94a3b8" },
    historyList: { display: "flex", flexDirection: "column", gap: 4 },
    historyItem: {
        display: "flex", alignItems: "center", gap: 8,
        fontSize: 12, color: "#e2e8f0",
    },
    historyDot: { width: 8, height: 8, borderRadius: "50%" },
};

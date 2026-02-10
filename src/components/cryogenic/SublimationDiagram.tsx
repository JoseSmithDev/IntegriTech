/**
 * SublimationDiagram — Animated 4-step CO₂ pellet lifecycle.
 */
"use client";
import React from "react";

const STEPS = [
    {
        num: "01", icon: "🧊", title: "Pellet CO₂",
        desc: "Pellets de hielo seco (−78.5°C) se cargan en la tolva y se aceleran mediante aire comprimido a velocidades supersónicas.",
        color: "#38bdf8",
    },
    {
        num: "02", icon: "💥", title: "Impacto & Choque Térmico",
        desc: "Al impactar la superficie, el diferencial de temperatura extremo (ΔT > 100°C) provoca una contracción instantánea del contaminante.",
        color: "#f59e0b",
    },
    {
        num: "03", icon: "💨", title: "Fractura & Sublimación",
        desc: "La energía cinética fractura el contaminante debilitado. El CO₂ sublima instantáneamente (sólido → gas), sin residuo líquido.",
        color: "#8b5cf6",
    },
    {
        num: "04", icon: "✨", title: "Superficie Limpia",
        desc: "El sustrato queda perfectamente limpio sin daño mecánico, térmico ni químico. Listo para operación inmediata.",
        color: "#10b981",
    },
];

export default function SublimationDiagram() {
    return (
        <div style={s.wrap}>
            <h3 style={s.sectionTitle}>Proceso de Sublimación CO₂</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
                Los pellets de CO₂ reciclado subliman al impacto — el único método de limpieza industrial que no genera residuo secundario.
            </p>

            <div style={s.stepsRow}>
                {STEPS.map((step, i) => (
                    <React.Fragment key={i}>
                        <div style={{ ...s.stepCard, borderColor: `${step.color}25` }}>
                            <div style={{ ...s.numBadge, background: `${step.color}18`, color: step.color }}>{step.num}</div>
                            <div style={{ fontSize: 28, margin: "8px 0" }}>{step.icon}</div>
                            <h4 style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{step.title}</h4>
                            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.5, color: "#94a3b8" }}>{step.desc}</p>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div style={s.arrow}>→</div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Phase transition formula */}
            <div style={s.formula}>
                <span style={{ fontSize: 13, color: "#64748b" }}>Reacción:</span>
                <code style={s.formulaCode}>CO₂(s) → CO₂(g) &nbsp; ΔH = 571 kJ/kg &nbsp; @ −78.5°C, 1 atm</code>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: {
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,.08)",
    },
    sectionTitle: { margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#f1f5f9" },
    stepsRow: {
        display: "flex", alignItems: "stretch", gap: 0,
    },
    stepCard: {
        flex: 1, padding: 18, borderRadius: 14,
        background: "rgba(0,0,0,.2)", border: "1px solid",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    },
    numBadge: {
        fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 4,
        letterSpacing: "0.05em",
    },
    arrow: {
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 6px", fontSize: 20, color: "#475569", fontWeight: 300,
    },
    formula: {
        marginTop: 20, padding: "10px 16px", borderRadius: 10,
        background: "rgba(56,189,248,.06)", border: "1px solid rgba(56,189,248,.12)",
        display: "flex", alignItems: "center", gap: 12,
    },
    formulaCode: {
        fontSize: 13, fontWeight: 600, color: "#38bdf8",
        fontFamily: "'JetBrains Mono', monospace",
    },
};

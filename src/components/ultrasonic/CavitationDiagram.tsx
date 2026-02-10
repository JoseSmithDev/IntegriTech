/**
 * CavitationDiagram — Visual explanation of the cavitation process.
 */
"use client";
import React from "react";

const STEPS = [
    {
        num: "01", icon: "〰️", title: "Ondas Ultrasónicas",
        desc: "Un transductor piezoeléctrico genera ondas de 25–40 kHz en el medio líquido, creando ciclos de compresión y rarefacción.",
        color: "#a78bfa",
    },
    {
        num: "02", icon: "🫧", title: "Cavitación",
        desc: "En las fases de baja presión, millones de burbujas de vacío microscópicas se forman instantáneamente en el líquido.",
        color: "#38bdf8",
    },
    {
        num: "03", icon: "💥", title: "Implosión",
        desc: "Las burbujas implosionan violentamente al regresar la presión positiva, generando microjets de hasta 400 km/h que impactan la superficie.",
        color: "#f59e0b",
    },
    {
        num: "04", icon: "✨", title: "Superficie Limpia",
        desc: "Los contaminantes son desprendidos a nivel molecular. La pieza queda limpia en cada cavidad, hilo y canal interno.",
        color: "#10b981",
    },
];

export default function CavitationDiagram() {
    return (
        <div style={s.wrap}>
            <h3 style={s.sectionTitle}>Proceso de Cavitación Controlada</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
                La energía de implosión de millones de microburbujas limpia cada micrón de geometrías complejas sin contacto mecánico.
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

            <div style={s.formula}>
                <span style={{ fontSize: 13, color: "#64748b" }}>Frecuencia óptima:</span>
                <code style={s.formulaCode}>f = 25–40 kHz &nbsp; | &nbsp; Microjet ≈ 400 km/h &nbsp; | &nbsp; ΔP &gt; 1000 atm (local)</code>
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
    stepsRow: { display: "flex", alignItems: "stretch", gap: 0 },
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
        background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.12)",
        display: "flex", alignItems: "center", gap: 12,
    },
    formulaCode: {
        fontSize: 13, fontWeight: 600, color: "#a78bfa",
        fontFamily: "'JetBrains Mono', monospace",
    },
};

/**
 * ROIMatrix — Visual ROI advantage of integrated 360° vs traditional methods.
 */
"use client";
import React from "react";

const METRICS = [
    { label: "Reducción de Parada", integrated: "−60%", traditional: "Referencia", icon: "⏱️" },
    { label: "Residuos Secundarios", integrated: "0 kg", traditional: "120–400 kg/operación", icon: "🗑️" },
    { label: "Daño al Sustrato", integrated: "0 μm", traditional: "15–50 μm erosión", icon: "🛡️" },
    { label: "MTTR Promedio", integrated: "−55%", traditional: "Referencia", icon: "🔧" },
    { label: "Cumplimiento ESG", integrated: "ISO 14001 ✓", traditional: "Parcial / No", icon: "🌿" },
    { label: "Coste Total 5 Años", integrated: "−42%", traditional: "Referencia", icon: "💰" },
];

export default function ROIMatrix() {
    return (
        <div style={s.wrap}>
            <h3 style={s.sectionTitle}>ROI: Solución Integrada vs Métodos Tradicionales</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
                La integración 360° genera ahorros compuestos que multiplican el retorno de cada tecnología individual.
            </p>

            <div style={s.grid}>
                {METRICS.map((m, i) => (
                    <div key={i} style={s.card}>
                        <div style={{ fontSize: 20, marginBottom: 8 }}>{m.icon}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, marginBottom: 10 }}>{m.label}</div>
                        <div style={s.comparison}>
                            <div style={s.integratedVal}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#064e3b", marginBottom: 2 }}>360° INTEGRADA</div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: "#10b981" }}>{m.integrated}</div>
                            </div>
                            <div style={s.vs}>vs</div>
                            <div style={s.traditionalVal}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#7f1d1d", marginBottom: 2 }}>TRADICIONAL</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>{m.traditional}</div>
                            </div>
                        </div>
                    </div>
                ))}
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
    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
    card: {
        padding: 18, borderRadius: 14, textAlign: "center" as const,
        background: "rgba(0,0,0,.2)", border: "1px solid rgba(255,255,255,.05)",
    },
    comparison: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
    integratedVal: {
        padding: "8px 12px", borderRadius: 8,
        background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.15)",
    },
    vs: { fontSize: 11, color: "#475569", fontWeight: 600 },
    traditionalVal: {
        padding: "8px 12px", borderRadius: 8,
        background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)",
    },
};

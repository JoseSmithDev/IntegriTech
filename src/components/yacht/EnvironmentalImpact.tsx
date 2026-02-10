/**
 * EnvironmentalImpact — Eco-dashboard.
 */
"use client";
import React from "react";

export default function EnvironmentalImpact() {
    return (
        <div style={s.wrap}>
            <div style={s.header}>
                <h3 style={s.title}>🌿 Impacto Ambiental Positivo</h3>
                <span style={s.badge}>IMO 2020 CONFORME</span>
            </div>

            <div style={s.grid}>
                <EcoCard label="CO₂ Evitado" value="1.2" unit="ton" icon="☁️" color="#10b981" desc="vs arenado tradicional" />
                <EcoCard label="Residuos Sólidos" value="-98" unit="%" icon="🗑️" color="#06b6d4" desc="sin medios abrasivos" />
                <EcoCard label="Agua Ahorrada" value="8,500" unit="L" icon="💧" color="#3b82f6" desc="proceso seco" />
                <EcoCard label="Químicos" value="0" unit="L" icon="🧪" color="#8b5cf6" desc="libre de solventes" />
            </div>

            <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.05)", fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
                <strong style={{ color: "#e2e8f0" }}>Análisis de Ciclo de Vida (LCA):</strong> La limpieza láser reduce la huella de carbono operativa en un 85% comparado con el chorreado de arena y elimina completamente la generación de lodos tóxicos asociados al decapado químico.
            </div>
        </div>
    );
}

function EcoCard({ label, value, unit, icon, color, desc }: any) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: 14, borderRadius: 12, background: `${color}11`, border: `1px solid ${color}22` }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div>
                <div style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: "-0.02em" }}>{value}<span style={{ fontSize: 13, fontWeight: 600, marginLeft: 2 }}>{unit}</span></div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{label}</div>
            </div>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{desc}</div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 16, background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,.08)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    badge: { fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 4, background: "rgba(16,185,129,.15)", color: "#10b981", border: "1px solid rgba(16,185,129,.3)" },
    grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 },
};

/**
 * CryoComparison — Method comparison table.
 */
"use client";
import React from "react";

const CRITERIA = [
    { label: "Residuos Secundarios", cryo: "Ninguno (sublimación)", sand: "Arena contaminada", chem: "Solventes tóxicos", water: "Agua residual" },
    { label: "Daño al Sustrato", cryo: "Ninguno", sand: "Erosión superficial", chem: "Corrosión química", water: "Infiltración" },
    { label: "Tiempo de Parada", cryo: "0 (in-situ)", sand: "4–8 h desmontaje", chem: "6–12 h inmersión", water: "2–4 h secado" },
    { label: "Seguridad Eléctrica", cryo: "100% seguro", sand: "Riesgo polvo", chem: "Riesgo vapores", water: "Conductivo ⚠️" },
    { label: "Impacto Ambiental", cryo: "CO₂ reciclado", sand: "Sílice residual", chem: "Emisiones VOC", water: "Consumo hídrico" },
    { label: "Certificación ISO", cryo: "14001 ✓ ESG ✓", sand: "Parcial", chem: "Requiere gestión", water: "Variable" },
];

const METHODS = [
    { key: "cryo", label: "❄️ Criogénica", color: "#38bdf8" },
    { key: "sand", label: "🏜️ Arenado", color: "#f97316" },
    { key: "chem", label: "🧪 Química", color: "#ef4444" },
    { key: "water", label: "💧 Hidro", color: "#3b82f6" },
];

export default function CryoComparison() {
    return (
        <div style={s.wrap}>
            <h3 style={s.sectionTitle}>Comparativa de Métodos</h3>

            <div style={s.table}>
                {/* Header */}
                <div style={{ ...s.row, background: "rgba(0,0,0,.3)", borderRadius: "10px 10px 0 0" }}>
                    <div style={{ ...s.cell, flex: 1.5, fontWeight: 700, fontSize: 11, color: "#64748b", textTransform: "uppercase" as const }}>Criterio</div>
                    {METHODS.map((m) => (
                        <div key={m.key} style={{ ...s.cell, flex: 1, fontWeight: 700, fontSize: 11, color: m.color, textAlign: "center" as const }}>{m.label}</div>
                    ))}
                </div>

                {/* Rows */}
                {CRITERIA.map((c, i) => (
                    <div key={i} style={{ ...s.row, background: i % 2 === 0 ? "rgba(0,0,0,.1)" : "transparent" }}>
                        <div style={{ ...s.cell, flex: 1.5, fontWeight: 600, fontSize: 12, color: "#cbd5e1" }}>{c.label}</div>
                        {METHODS.map((m) => {
                            const val = (c as any)[m.key] as string;
                            const isBest = m.key === "cryo";
                            return (
                                <div key={m.key} style={{ ...s.cell, flex: 1, textAlign: "center" as const, fontSize: 11, color: isBest ? "#10b981" : "#94a3b8", fontWeight: isBest ? 700 : 400 }}>
                                    {isBest && "✓ "}{val}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div style={s.footer}>
                <span style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>✓ Criogénica es superior en todos los criterios evaluados</span>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: {
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,.08)",
    },
    sectionTitle: { margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: "#f1f5f9" },
    table: { borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,.06)" },
    row: { display: "flex", alignItems: "center" },
    cell: { padding: "10px 14px" },
    footer: {
        marginTop: 16, padding: "10px 16px", borderRadius: 8,
        background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.15)",
        textAlign: "center" as const,
    },
};

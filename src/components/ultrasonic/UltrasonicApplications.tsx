/**
 * UltrasonicApplications — Primary application sectors.
 */
"use client";
import React from "react";

const SECTORS = [
    {
        icon: "⚓", color: "#38bdf8",
        title: "Marítimo / Náutico",
        desc: "Limpieza profunda de intercambiadores de calor, inyectores de combustible y herrajes marinos expuestos a salinidad y corrosión.",
        tags: ["Intercambiadores", "Inyectores", "Herrajes"],
        stat: "Elimina corrosión salina",
    },
    {
        icon: "🏭", color: "#f59e0b",
        title: "Industrial / Cerámica",
        desc: "Restauración de insertos de moldes pequeños, boquillas de extrusión y válvulas de precisión con geometrías complejas internas.",
        tags: ["Moldes", "Boquillas", "Válvulas"],
        stat: "Geometrías ≤ 0.5mm",
    },
    {
        icon: "🏎️", color: "#ef4444",
        title: "Automotriz / Racing",
        desc: "Carburadores, componentes de turbocompresor y culatas de motor. Desengrase total sin desmontaje de piezas delicadas.",
        tags: ["Carburadores", "Turbo", "Culatas"],
        stat: "0 daño por fricción",
    },
];

export default function UltrasonicApplications() {
    return (
        <div>
            <h3 style={s.sectionTitle}>Aplicaciones Principales</h3>
            <div style={s.grid}>
                {SECTORS.map((sec, i) => (
                    <div key={i} style={{ ...s.card, borderColor: `${sec.color}20` }}>
                        <div style={{ fontSize: 32, marginBottom: 12 }}>{sec.icon}</div>
                        <h4 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>{sec.title}</h4>
                        <p style={{ margin: "0 0 14px", fontSize: 12, lineHeight: 1.6, color: "#94a3b8" }}>{sec.desc}</p>

                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 14 }}>
                            {sec.tags.map((t) => (
                                <span key={t} style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, color: sec.color, background: `${sec.color}10`, border: `1px solid ${sec.color}25` }}>{t}</span>
                            ))}
                        </div>

                        <div style={{ marginTop: "auto", padding: "10px 14px", borderRadius: 8, background: `${sec.color}0a`, border: `1px solid ${sec.color}20`, textAlign: "center" as const }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: sec.color }}>{sec.stat}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    sectionTitle: { margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: "#f1f5f9" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
    card: {
        padding: 24, borderRadius: 16,
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        border: "1px solid", display: "flex", flexDirection: "column",
    },
};

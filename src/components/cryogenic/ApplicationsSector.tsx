/**
 * ApplicationsSector — Primary industrial applications for cryogenic cleaning.
 */
"use client";
import React from "react";

const SECTORS = [
    {
        icon: "🏭", color: "#f59e0b",
        title: "Cerámica & Vidrio",
        desc: "Restauración de moldes y prensas sin ciclos de enfriamiento térmico. Eliminación de residuos cerámicos, adhesivos y desmoldeantes sin dañar superficies de precisión.",
        tags: ["Moldes", "Prensas", "Hornos"],
        stat: "40% menos de downtime",
    },
    {
        icon: "⚡", color: "#06b6d4",
        title: "Generación de Energía",
        desc: "Limpieza segura de interruptores, aisladores y transformadores. Ideal para subestaciones eléctricas donde los métodos húmedos representan riesgo de arco eléctrico.",
        tags: ["Switchgear", "Aisladores", "Turbinas"],
        stat: "100% seguro eléctrico",
    },
    {
        icon: "✈️", color: "#8b5cf6",
        title: "Automotriz & Aeroespacial",
        desc: "Desengrase de precisión y eliminación de recubrimientos especializados. Aprobado para componentes de vuelo y superficies con tolerancias micrométricas.",
        tags: ["Motores", "Recubrimientos", "Utillaje"],
        stat: "0 μm desgaste superficial",
    },
];

export default function ApplicationsSector() {
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
                                <span key={t} style={{ ...s.tag, color: sec.color, background: `${sec.color}10`, borderColor: `${sec.color}25` }}>{t}</span>
                            ))}
                        </div>

                        <div style={{ ...s.statBar, background: `${sec.color}0a`, borderColor: `${sec.color}20` }}>
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
    tag: {
        fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4,
        border: "1px solid",
    },
    statBar: {
        marginTop: "auto", padding: "10px 14px", borderRadius: 8,
        border: "1px solid", textAlign: "center" as const,
    },
};

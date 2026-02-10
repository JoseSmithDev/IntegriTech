/**
 * TechAdvantages — 4-card grid of core technical advantages.
 */
"use client";
import React from "react";

const ADVANTAGES = [
    {
        icon: "🔧", color: "#f59e0b",
        title: "Limpieza In-Situ",
        desc: "Elimina la necesidad de desmontaje. Limpiamos la maquinaria mientras está caliente y en pleno funcionamiento, reduciendo significativamente el MTTR (Mean Time To Repair).",
        tag: "Sin parada de producción",
    },
    {
        icon: "🛡️", color: "#06b6d4",
        title: "No Abrasivo & No Conductivo",
        desc: "Seguro para moldes cerámicos de alta precisión, componentes eléctricos y sensores sensibles. Sin desgaste superficial ni estrés mecánico.",
        tag: "Seguro para electrónica",
    },
    {
        icon: "💎", color: "#8b5cf6",
        title: "Proceso de Sublimación",
        desc: "Los pellets de CO₂ subliman al impacto, pasando directamente de sólido a gas. Cero residuos secundarios — sin agua, arena ni solventes que gestionar.",
        tag: "0% residuos secundarios",
    },
    {
        icon: "🌿", color: "#10b981",
        title: "Cumplimiento Ambiental",
        desc: "Solución 100% ecológica que cumple con los requisitos ISO 14001 y ESG utilizando CO₂ reciclado. Sin emisiones adicionales al medio ambiente.",
        tag: "ISO 14001 · ESG",
    },
];

export default function TechAdvantages() {
    return (
        <div style={s.wrap}>
            <h3 style={s.sectionTitle}>Ventajas Técnicas Clave</h3>
            <div style={s.grid}>
                {ADVANTAGES.map((a, i) => (
                    <div key={i} style={{ ...s.card, borderColor: `${a.color}22` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <div style={{ ...s.iconWrap, background: `${a.color}15`, border: `1px solid ${a.color}30` }}>
                                <span style={{ fontSize: 20 }}>{a.icon}</span>
                            </div>
                            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{a.title}</h4>
                        </div>
                        <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.6, color: "#94a3b8" }}>{a.desc}</p>
                        <span style={{ ...s.tag, background: `${a.color}12`, color: a.color, borderColor: `${a.color}30` }}>{a.tag}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: {},
    sectionTitle: { margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: "#f1f5f9" },
    grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 },
    card: {
        padding: 22, borderRadius: 16,
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        border: "1px solid", transition: "transform 0.2s",
    },
    iconWrap: {
        width: 40, height: 40, borderRadius: 10, display: "flex",
        alignItems: "center", justifyContent: "center",
    },
    tag: {
        display: "inline-block", fontSize: 10, fontWeight: 700,
        padding: "4px 10px", borderRadius: 5, border: "1px solid",
        letterSpacing: "0.03em",
    },
};

/**
 * CavitationAdvantages — Core technical advantages of ultrasonic cleaning.
 */
"use client";
import React from "react";

const ADVANTAGES = [
    {
        icon: "🔬", color: "#a78bfa",
        title: "Penetración Total",
        desc: "Alcanza cada micrón de canales internos, galerías y superficies intrincadas donde ningún método mecánico puede acceder.",
    },
    {
        icon: "🛡️", color: "#06b6d4",
        title: "Integridad del Material",
        desc: "Proceso no abrasivo que elimina depósitos de carbono, óxidos y biofilms sin alterar las tolerancias dimensionales.",
    },
    {
        icon: "🧬", color: "#f59e0b",
        title: "Descontaminación Micro-Superficial",
        desc: "Ideal para ingeniería de alta precisión, sistemas de inyección de combustible y componentes electrónicos afectados por salinidad u oxidación.",
    },
    {
        icon: "🌿", color: "#10b981",
        title: "Química Eco-Friendly",
        desc: "Utilizamos detergentes biodegradables de base acuosa, formulados específicamente para cada aleación: aluminio, latón, acero inoxidable o titanio.",
    },
];

export default function CavitationAdvantages() {
    return (
        <div style={s.wrap}>
            <h3 style={s.sectionTitle}>Ventajas Técnicas de la Cavitación</h3>
            <div style={s.grid}>
                {ADVANTAGES.map((a, i) => (
                    <div key={i} style={{ ...s.card, borderColor: `${a.color}22` }}>
                        <div style={{ ...s.iconCircle, background: `${a.color}12`, border: `1px solid ${a.color}25` }}>
                            <span style={{ fontSize: 22 }}>{a.icon}</span>
                        </div>
                        <h4 style={{ margin: "12px 0 6px", fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{a.title}</h4>
                        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: "#94a3b8" }}>{a.desc}</p>
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
    sectionTitle: { margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: "#f1f5f9" },
    grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 },
    card: {
        padding: 20, borderRadius: 14,
        background: "rgba(0,0,0,.2)", border: "1px solid",
        textAlign: "center" as const,
    },
    iconCircle: {
        width: 48, height: 48, borderRadius: "50%", display: "inline-flex",
        alignItems: "center", justifyContent: "center",
    },
};

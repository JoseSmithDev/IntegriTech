/**
 * ServiceModes — Workshop & Mobile dual-mode service cards.
 */
"use client";
import React from "react";

const MODES = [
    {
        icon: "🚐", color: "#f59e0b",
        title: "Unidades Móviles In-Situ",
        desc: "Nuestras estaciones ultrasónicas portátiles permiten realizar limpieza de precisión directamente en su instalación o embarcación, minimizando la cadena de custodia de piezas críticas.",
        features: ["Limpieza en instalación del cliente", "Sin transporte de piezas", "Configuración en < 30 min", "Tanques de 20–80 L"],
    },
    {
        icon: "🏭", color: "#06b6d4",
        title: "Centro Técnico en Taller",
        desc: "Para lotes de alto volumen o restauración especializada, nuestro taller está equipado con tanques de gran capacidad y sistemas de filtración avanzados para un acabado superior.",
        features: ["Tanques hasta 500 L", "Filtración multi-etapa", "Secado por aire caliente", "Control de temperatura ±1°C"],
    },
];

export default function ServiceModes() {
    return (
        <div>
            <h3 style={s.sectionTitle}>Versatilidad de Servicio</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b" }}>
                Ofrecemos un servicio dual diseñado para adaptarse a su logística.
            </p>
            <div style={s.grid}>
                {MODES.map((m, i) => (
                    <div key={i} style={{ ...s.card, borderColor: `${m.color}22` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                            <div style={{ ...s.iconWrap, background: `${m.color}15`, border: `1px solid ${m.color}30` }}>
                                <span style={{ fontSize: 24 }}>{m.icon}</span>
                            </div>
                            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>{m.title}</h4>
                        </div>
                        <p style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.6, color: "#94a3b8" }}>{m.desc}</p>
                        <div style={s.featureList}>
                            {m.features.map((f) => (
                                <div key={f} style={s.feature}>
                                    <span style={{ color: m.color }}>✓</span>
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    sectionTitle: { margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#f1f5f9" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    card: {
        padding: 24, borderRadius: 16,
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        border: "1px solid",
    },
    iconWrap: {
        width: 48, height: 48, borderRadius: 12, display: "flex",
        alignItems: "center", justifyContent: "center",
    },
    featureList: { display: "flex", flexDirection: "column", gap: 8 },
    feature: {
        display: "flex", gap: 8, alignItems: "center",
        fontSize: 12, color: "#cbd5e1", fontWeight: 500,
    },
};

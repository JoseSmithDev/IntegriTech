/**
 * CryoHero — Hero section with animated KPI counters for Cryogenic Cleaning.
 */
"use client";
import React from "react";

const KPIS = [
    { value: "−78.5°C", label: "Temp. Sublimación", icon: "🧊", color: "#38bdf8" },
    { value: "Supersónica", label: "Velocidad Pellet", icon: "💨", color: "#818cf8" },
    { value: "0%", label: "Residuos Secundarios", icon: "♻️", color: "#34d399" },
    { value: "99.9%", label: "Uptime Preservado", icon: "⚡", color: "#fbbf24" },
];

export default function CryoHero() {
    return (
        <div style={s.wrap}>
            {/* Frost decoration */}
            <div style={s.frost1} />
            <div style={s.frost2} />

            <div style={s.content}>
                <div style={s.badge}>❄️ LIMPIEZA CRIOGÉNICA AVANZADA</div>
                <h1 style={s.title}>Mantenimiento de Precisión<br />con Cero Tiempo de Parada</h1>
                <p style={s.subtitle}>
                    Servicio especializado de <strong>Dry Ice Blasting</strong> que utiliza pellets de CO₂ acelerados
                    a velocidades supersónicas para descontaminar superficies industriales mediante choque térmico
                    y energía cinética, sin comprometer la integridad estructural del sustrato.
                </p>
            </div>

            <div style={s.kpiRow}>
                {KPIS.map((k, i) => (
                    <div key={i} style={{ ...s.kpiCard, borderColor: `${k.color}33` }}>
                        <span style={{ fontSize: 24 }}>{k.icon}</span>
                        <div style={{ fontSize: 22, fontWeight: 800, color: k.color, letterSpacing: "-0.02em" }}>{k.value}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{k.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: {
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0c1929 0%, #0f2744 40%, #162b50 100%)",
        borderRadius: 20, padding: "48px 40px 36px", border: "1px solid rgba(56,189,248,.15)",
    },
    frost1: {
        position: "absolute", top: -60, right: -60, width: 200, height: 200,
        background: "radial-gradient(circle, rgba(56,189,248,.12) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
    },
    frost2: {
        position: "absolute", bottom: -40, left: "30%", width: 300, height: 150,
        background: "radial-gradient(ellipse, rgba(129,140,248,.08) 0%, transparent 70%)",
        pointerEvents: "none",
    },
    content: { position: "relative", zIndex: 1, marginBottom: 32 },
    badge: {
        display: "inline-block", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
        padding: "6px 14px", borderRadius: 6,
        background: "rgba(56,189,248,.1)", color: "#38bdf8", border: "1px solid rgba(56,189,248,.25)",
        marginBottom: 16,
    },
    title: {
        margin: "0 0 12px", fontSize: 32, fontWeight: 800, color: "#f1f5f9",
        lineHeight: 1.2, letterSpacing: "-0.02em",
    },
    subtitle: {
        margin: 0, maxWidth: 680, fontSize: 14, lineHeight: 1.7, color: "#94a3b8",
    },
    kpiRow: {
        position: "relative", zIndex: 1,
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14,
    },
    kpiCard: {
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        padding: "18px 12px", borderRadius: 14,
        background: "rgba(0,0,0,.25)", border: "1px solid",
        textAlign: "center",
    },
};

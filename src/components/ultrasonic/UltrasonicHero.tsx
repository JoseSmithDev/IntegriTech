/**
 * UltrasonicHero — Hero section with KPIs for Ultrasonic Cleaning.
 */
"use client";
import React from "react";

const KPIS = [
    { value: "25–40 kHz", label: "Rango Frecuencia", icon: "〰️", color: "#a78bfa" },
    { value: "Millones", label: "Burbujas / segundo", icon: "🫧", color: "#38bdf8" },
    { value: "100%", label: "Penetración Interna", icon: "🔬", color: "#34d399" },
    { value: "±0 μm", label: "Tolerancia Preservada", icon: "📐", color: "#fbbf24" },
];

export default function UltrasonicHero() {
    return (
        <div style={s.wrap}>
            <div style={s.wave1} />
            <div style={s.wave2} />

            <div style={s.content}>
                <div style={s.badge}>🔊 LIMPIEZA POR ULTRASONIDO</div>
                <h1 style={s.title}>Cavitación Ultrasónica de Precisión:<br />Limpieza Interna Profunda para Componentes Críticos</h1>
                <p style={s.subtitle}>
                    Nuestro sistema de limpieza ultrasónica utiliza ondas sonoras de alta frecuencia (25–40 kHz) para generar
                    millones de burbujas de vacío microscópicas en un medio líquido especializado. Este proceso de <strong>cavitación controlada</strong> garantiza
                    la eliminación de contaminantes en geometrías complejas, agujeros ciegos e hilos internos donde la limpieza mecánica es imposible.
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
        background: "linear-gradient(135deg, #1a0a2e 0%, #1e1145 40%, #251650 100%)",
        borderRadius: 20, padding: "48px 40px 36px", border: "1px solid rgba(167,139,250,.15)",
    },
    wave1: {
        position: "absolute", top: -50, right: -40, width: 220, height: 220,
        background: "radial-gradient(circle, rgba(167,139,250,.12) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
    },
    wave2: {
        position: "absolute", bottom: -30, left: "25%", width: 300, height: 140,
        background: "radial-gradient(ellipse, rgba(56,189,248,.08) 0%, transparent 70%)",
        pointerEvents: "none",
    },
    content: { position: "relative", zIndex: 1, marginBottom: 32 },
    badge: {
        display: "inline-block", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
        padding: "6px 14px", borderRadius: 6,
        background: "rgba(167,139,250,.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,.25)",
        marginBottom: 16,
    },
    title: {
        margin: "0 0 12px", fontSize: 30, fontWeight: 800, color: "#f1f5f9",
        lineHeight: 1.2, letterSpacing: "-0.02em",
    },
    subtitle: {
        margin: 0, maxWidth: 700, fontSize: 14, lineHeight: 1.7, color: "#94a3b8",
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

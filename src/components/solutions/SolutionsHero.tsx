/**
 * SolutionsHero — 360° Technical Recovery Solution hero banner.
 */
"use client";
import React from "react";

export default function SolutionsHero() {
    return (
        <div style={s.wrap}>
            <div style={s.glow1} />
            <div style={s.glow2} />
            <div style={s.glow3} />

            <div style={s.content}>
                <div style={s.badge}>360° TECHNICAL RECOVERY SOLUTION</div>
                <h1 style={s.title}>Tres Tecnologías.<br />Una Solución Integrada.<br />ROI Superior.</h1>
                <p style={s.subtitle}>
                    Integramos <strong>Ablación por Láser de Fibra</strong>, <strong>Blasting Criogénico con Hielo Seco</strong>
                    y <strong>Cavitación Ultrasónica de Alta Frecuencia</strong> en un ecosistema unificado de recuperación
                    de superficies — ofreciendo un retorno de inversión que ningún método aislado puede igualar.
                </p>
            </div>

            <div style={s.techRow}>
                <TechPill icon="⚡" label="Ablación Láser" sub="Ablación selectiva · 1064nm Nd:YAG" color="#06b6d4" />
                <div style={s.plus}>+</div>
                <TechPill icon="❄️" label="Blasting Criogénico" sub="Sublimación por choque térmico · CO₂" color="#38bdf8" />
                <div style={s.plus}>+</div>
                <TechPill icon="🔊" label="Cavitación Ultrasónica" sub="Cavitación acústica · 25–40 kHz" color="#a78bfa" />
            </div>
        </div>
    );
}

function TechPill({ icon, label, sub, color }: { icon: string; label: string; sub: string; color: string }) {
    return (
        <div style={{ ...s.pill, borderColor: `${color}30`, background: `${color}08` }}>
            <span style={{ fontSize: 28 }}>{icon}</span>
            <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{label}</div>
                <div style={{ fontSize: 10, color: "#64748b", fontStyle: "italic" }}>{sub}</div>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: {
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0a0f1a 0%, #0f1d2e 30%, #1a1035 70%, #0f172a 100%)",
        borderRadius: 20, padding: "52px 44px 40px",
        border: "1px solid rgba(255,255,255,.08)",
    },
    glow1: {
        position: "absolute", top: -80, left: -40, width: 260, height: 260,
        background: "radial-gradient(circle, rgba(6,182,212,.1) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
    },
    glow2: {
        position: "absolute", top: "40%", right: -60, width: 200, height: 200,
        background: "radial-gradient(circle, rgba(56,189,248,.08) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
    },
    glow3: {
        position: "absolute", bottom: -50, left: "50%", width: 300, height: 150,
        background: "radial-gradient(ellipse, rgba(167,139,250,.07) 0%, transparent 70%)",
        pointerEvents: "none",
    },
    content: { position: "relative", zIndex: 1, marginBottom: 36 },
    badge: {
        display: "inline-block", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em",
        padding: "6px 16px", borderRadius: 6, marginBottom: 18,
        background: "linear-gradient(135deg, rgba(6,182,212,.12), rgba(167,139,250,.12))",
        color: "#94a3b8",
        border: "1px solid rgba(255,255,255,.1)",
    },
    title: {
        margin: "0 0 14px", fontSize: 36, fontWeight: 800, color: "#f1f5f9",
        lineHeight: 1.15, letterSpacing: "-0.03em",
    },
    subtitle: {
        margin: 0, maxWidth: 720, fontSize: 15, lineHeight: 1.7, color: "#94a3b8",
    },
    techRow: {
        position: "relative", zIndex: 1,
        display: "flex", alignItems: "center", gap: 0,
    },
    pill: {
        flex: 1, display: "flex", alignItems: "center", gap: 14,
        padding: "16px 18px", borderRadius: 14, border: "1px solid",
    },
    plus: {
        padding: "0 10px", fontSize: 20, fontWeight: 300, color: "#475569",
    },
};

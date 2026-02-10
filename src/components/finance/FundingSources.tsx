"use client";
import React, { useState } from "react";

interface FundingSource {
    id: string;
    name: string;
    icon: string;
    min: number;
    max: number;
    color: string;
    type: "capital" | "préstamo" | "subvención" | "leasing";
    typeLabel: string;
    description: string;
    details: string[];
}

const SOURCES: FundingSource[] = [
    {
        id: "socio", name: "Aportación Socio Inversor", icon: "🤝",
        min: 40000, max: 80000, color: "#06b6d4", type: "capital", typeLabel: "Capital Social",
        description: "Base del capital social de la empresa.",
        details: ["Equity directo — sin deuda", "Participación proporcional en la sociedad", "Deducción por inversión en empresa de nueva creación"],
    },
    {
        id: "enisa", name: "Préstamo ENISA", icon: "🏛️",
        min: 25000, max: 80000, color: "#8b5cf6", type: "préstamo", typeLabel: "Reembolsable",
        description: "Préstamo participativo con carencia de 5 años, sin garantías personales.",
        details: ["Carencia total de 5 años", "Sin garantías personales ni aval", "Tipo de interés vinculado a resultados", "Compatible con otras ayudas públicas"],
    },
    {
        id: "ico", name: "Línea ICO / Leasing", icon: "🏦",
        min: 15000, max: 40000, color: "#3b82f6", type: "leasing", typeLabel: "Leasing Fiscal",
        description: "Financiación para maquinaria pesada con ventaja fiscal.",
        details: ["Deducción fiscal del 100% de las cuotas", "Maquinaria como garantía (sin aval adicional)", "Plazos de 3 a 7 años", "Opción de compra al final del contrato"],
    },
    {
        id: "kit", name: "Kit Digital", icon: "💻",
        min: 3000, max: 6000, color: "#10b981", type: "subvención", typeLabel: "Fondo Perdido",
        description: "Subvención a fondo perdido para digitalización.",
        details: ["No se devuelve — 100% a fondo perdido", "Tramitación rápida (Acelera Pyme)", "Cubre: web, CRM, ERP, ciberseguridad", "Compatible con todas las demás ayudas"],
    },
    {
        id: "ivace", name: "Ayudas Europeas / IVACE", icon: "🇪🇺",
        min: 5000, max: 50000, color: "#f59e0b", type: "subvención", typeLabel: "Variable",
        description: "Fondos europeos y autonómicos, posibilidad de fondo perdido.",
        details: ["Convocatorias periódicas (IVACE, CDTI)", "Posibilidad de fondo perdido parcial o total", "I+D industrial y economía circular", "Requiere justificación técnica del proyecto"],
    },
];

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
    capital: { bg: "rgba(6,182,212,.15)", text: "#06b6d4" },
    préstamo: { bg: "rgba(139,92,246,.15)", text: "#8b5cf6" },
    subvención: { bg: "rgba(16,185,129,.15)", text: "#10b981" },
    leasing: { bg: "rgba(59,130,246,.15)", text: "#3b82f6" },
};

function fmt(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(0)}k€` : `${n}€`; }

export default function FundingSources() {
    const [selected, setSelected] = useState<string | null>(null);
    const [useMax, setUseMax] = useState(false);

    const values = SOURCES.map(s => useMax ? s.max : s.min);
    const total = values.reduce((a, b) => a + b, 0);

    // Build conic gradient
    let cumPct = 0;
    const gradStops = SOURCES.map((s, i) => {
        const pct = (values[i] / total) * 100;
        const start = cumPct;
        cumPct += pct;
        return `${s.color} ${start}% ${cumPct}%`;
    }).join(", ");

    return (
        <div style={st.wrap}>
            <div style={st.header}>
                <div>
                    <h3 style={st.title}>💰 Fuentes de Financiación</h3>
                    <p style={st.subtitle}>Estructura de capital para la puesta en marcha de IntegriTech Pro</p>
                </div>
                <div style={st.toggleWrap}>
                    <button onClick={() => setUseMax(false)} style={{ ...st.toggleBtn, ...(useMax ? {} : st.toggleActive) }}>Mínimo</button>
                    <button onClick={() => setUseMax(true)} style={{ ...st.toggleBtn, ...(!useMax ? {} : st.toggleActive) }}>Máximo</button>
                </div>
            </div>

            <div style={st.body}>
                {/* Pie chart */}
                <div style={st.chartCol}>
                    <div style={{
                        width: 220, height: 220, borderRadius: "50%",
                        background: `conic-gradient(${gradStops})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 0 40px rgba(6,182,212,.12)",
                    }}>
                        <div style={{
                            width: 120, height: 120, borderRadius: "50%",
                            background: "#0f172a", display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                        }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>{fmt(total)}</div>
                            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>CAPITAL TOTAL</div>
                        </div>
                    </div>
                    {/* Legend */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16 }}>
                        {SOURCES.map((s, i) => (
                            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}
                                onClick={() => setSelected(selected === s.id ? null : s.id)}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
                            >
                                <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                                <span style={{ color: "#94a3b8", flex: 1 }}>{s.name}</span>
                                <span style={{ color: s.color, fontWeight: 700 }}>{((values[i] / total) * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Funding Cards */}
                <div style={st.cardsCol}>
                    {SOURCES.map((s, i) => {
                        const isOpen = selected === s.id;
                        const tc = TYPE_COLORS[s.type];
                        return (
                            <div key={s.id} onClick={() => setSelected(isOpen ? null : s.id)} style={{
                                ...st.card,
                                borderColor: isOpen ? `${s.color}66` : "rgba(255,255,255,.06)",
                                background: isOpen ? `linear-gradient(135deg, ${s.color}08, ${s.color}03)` : "rgba(0,0,0,.2)",
                            }}>
                                <div style={st.cardHead}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ fontSize: 22 }}>{s.icon}</span>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{s.name}</div>
                                            <div style={{ fontSize: 11, color: "#64748b" }}>{s.description}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" as const }}>
                                        <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{fmt(values[i])}</div>
                                        <span style={{
                                            fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                                            background: tc.bg, color: tc.text, textTransform: "uppercase" as const,
                                        }}>{s.typeLabel}</span>
                                    </div>
                                </div>
                                <div style={{ fontSize: 10, color: "#475569" }}>Rango: {fmt(s.min)} — {fmt(s.max)}</div>
                                {isOpen && (
                                    <ul style={{ margin: "8px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
                                        {s.details.map((d, j) => (
                                            <li key={j} style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{d}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const st: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 20, background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,.08)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 12 },
    title: { margin: 0, fontSize: 20, fontWeight: 800, color: "#f1f5f9" },
    subtitle: { margin: "4px 0 0", fontSize: 13, color: "#64748b" },
    toggleWrap: { display: "flex", gap: 4, background: "rgba(0,0,0,.3)", borderRadius: 8, padding: 3 },
    toggleBtn: { padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "none", background: "transparent", color: "#64748b", cursor: "pointer" },
    toggleActive: { background: "rgba(6,182,212,.15)", color: "#06b6d4" },
    body: { display: "flex", gap: 28, flexWrap: "wrap" as const },
    chartCol: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: 240 },
    cardsCol: { display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 320 },
    card: { padding: "14px 16px", borderRadius: 12, border: "1px solid", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 6 },
    cardHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
};

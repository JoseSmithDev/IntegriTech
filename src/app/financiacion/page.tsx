"use client";

import React, { useState, useEffect } from "react";
import FundingSources from "@/components/finance/FundingSources";
import CapitalRoute from "@/components/finance/CapitalRoute";
import ViabilitySimulator from "@/components/finance/ViabilitySimulator";
import FinancialAdvisor from "@/components/finance/FinancialAdvisor";
import RiskAnalysis from "@/components/finance/RiskAnalysis";

/* ═══════ Section metadata ═══════ */

const SECTIONS = [
    { id: "tech", num: "01", icon: "⚡", label: "Tecnologías", color: "#06b6d4" },
    { id: "sectors", num: "02", icon: "🏭", label: "Sectores", color: "#f59e0b" },
    { id: "analysis", num: "03", icon: "📊", label: "Análisis 360°", color: "#ef4444" },
    { id: "capital", num: "04", icon: "💎", label: "Capital", color: "#8b5cf6" },
    { id: "viability", num: "05", icon: "📐", label: "Viabilidad", color: "#10b981" },
    { id: "advisor", num: "06", icon: "🤖", label: "Asesor IA", color: "#06b6d4" },
];

/* ═══════ Static data ═══════ */

const TECHNOLOGIES = [
    {
        icon: "⚡", name: "Ablación Láser",
        sub: "Fibra 1064nm Nd:YAG · 50–500W", color: "#06b6d4",
        desc: "Eliminación selectiva capa a capa sin contacto mecánico ni residuos. Precisión micrométrica que preserva el sustrato original.",
        stats: [
            { label: "Precisión", value: "±2 μm" },
            { label: "Tasa", value: "4–18 m²/h" },
            { label: "Residuos", value: "0 kg" },
        ],
    },
    {
        icon: "❄️", name: "Blasting Criogénico",
        sub: "Sublimación CO₂ · -78 °C", color: "#38bdf8",
        desc: "Pellets de CO₂ impactan la superficie provocando contracción térmica diferencial. El contaminante se desprende sin generar residuo secundario.",
        stats: [
            { label: "Temperatura", value: "-78 °C" },
            { label: "Tasa", value: "8–25 m²/h" },
            { label: "Residuos", value: "0 kg" },
        ],
    },
    {
        icon: "🔊", name: "Cavitación Ultrasónica",
        sub: "Acústica · 25–40 kHz", color: "#a78bfa",
        desc: "Microburbujas ultrasónicas implotan sobre geometrías complejas, eliminando contaminantes sin contacto abrasivo.",
        stats: [
            { label: "Frecuencia", value: "25–40 kHz" },
            { label: "Piezas/h", value: "12–30" },
            { label: "Residuos", value: "Filtrado" },
        ],
    },
];

const SECTORS_DATA = [
    {
        icon: "🛥️", name: "Yates & Náutica", color: "#06b6d4", href: "/",
        desc: "Cascos, hélices, ejes y sistemas auxiliares para flotas de alto valor.",
        kpis: ["60% menos downtime en dique seco", "ROI 300% vs. arenado"],
    },
    {
        icon: "🏛️", name: "Patrimonio Histórico", color: "#f59e0b", href: "/heritage",
        desc: "Conservación no invasiva de fachadas, monumentos y piezas artísticas.",
        kpis: ["0 μm de daño al sustrato", "Trazabilidad ICOMOS"],
    },
    {
        icon: "☢️", name: "Nuclear", color: "#ef4444", href: "/nuclear",
        desc: "Descontaminación radiológica con factor DF >100.",
        kpis: ["95% reducción volumen residuos", "Cumplimiento ALARA"],
    },
    {
        icon: "🏭", name: "Industrial", color: "#10b981", href: "/solutions",
        desc: "Mantenimiento de activos críticos: intercambiadores, turbinas, moldes.",
        kpis: ["55% menos MTTR", "ISO 14001 / ESG"],
    },
];

/* ═══════ Page component ═══════ */

export default function FinanciacionPage() {
    const [activeSection, setActiveSection] = useState("tech");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
            },
            { rootMargin: "-30% 0px -60% 0px" }
        );
        SECTIONS.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>

            {/* ─── HERO ─────────────────────────────────────────── */}
            <div style={st.hero}>
                <div style={st.heroInner}>
                    <div style={st.heroGlow} />
                    <div style={st.heroGlow2} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <span style={st.badge}>💼 DOSSIER DE INVERSIÓN</span>
                        <h1 style={st.h1}>
                            <span style={{ fontWeight: 400, color: "#94a3b8" }}>Invierte en </span>
                            <span style={st.grad}>IntegriTech Pro</span>
                        </h1>
                        <p style={st.heroSub}>
                            Plataforma integral de limpieza industrial — Láser, Criogenia y Ultrasonidos —
                            con tecnología propietaria, contratos recurrentes y un mercado de €2.8B.
                        </p>
                        <div style={st.kpiRow}>
                            <Kpi l="Mercado TAM" v="€2.8B" s="CAGR 8.2%" />
                            <Kpi l="Inversión Mín." v="88k€" s="Capital mixto" />
                            <Kpi l="ROI Objetivo" v="+140%" s="18 meses" />
                            <Kpi l="Breakeven" v="8 meses" s="Esc. realista" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── STICKY SECTION NAV ────────────────────────────── */}
            <nav style={st.stickyNav}>
                <div style={st.stickyInner}>
                    {SECTIONS.map(sec => (
                        <a
                            key={sec.id}
                            href={`#${sec.id}`}
                            onClick={(e) => { e.preventDefault(); document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                            style={{
                                ...st.pill,
                                background: activeSection === sec.id ? `${sec.color}18` : "transparent",
                                color: activeSection === sec.id ? sec.color : "#64748b",
                                borderColor: activeSection === sec.id ? `${sec.color}40` : "transparent",
                            }}
                        >
                            <span>{sec.icon}</span>{sec.label}
                        </a>
                    ))}
                </div>
            </nav>

            {/* ═══════════════════════════════════════════════════════
                BAND 01 — TECNOLOGÍAS (fondo oscuro)
            ═══════════════════════════════════════════════════════ */}
            <section id="tech" style={{ ...st.band, background: "#070c17" }}>
                <div style={st.bandInner}>
                    <SectionHeader num="01" title="Tres Tecnologías, Una Solución 360°" sub="Cada tecnología cubre un nicho complementario. Juntas, maximizan la cartera de servicios sin subcontratar." color="#06b6d4" badge="PROPUESTA DE VALOR" />
                    <div style={st.techGrid}>
                        {TECHNOLOGIES.map(t => (
                            <div key={t.name} style={{ ...st.techCard, borderColor: `${t.color}20` }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                    <span style={{ fontSize: 28, width: 44, height: 44, borderRadius: 12, background: `${t.color}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.icon}</span>
                                    <div>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>{t.name}</div>
                                        <div style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>{t.sub}</div>
                                    </div>
                                </div>
                                <p style={{ margin: "0 0 14px", fontSize: 12, color: "#94a3b8", lineHeight: 1.55 }}>{t.desc}</p>
                                <div style={{ display: "flex", gap: 6 }}>
                                    {t.stats.map(s => (
                                        <div key={s.label} style={{ flex: 1, textAlign: "center" as const, padding: "8px 4px", borderRadius: 8, background: `${t.color}08`, border: `1px solid ${t.color}15` }}>
                                            <div style={{ fontSize: 15, fontWeight: 800, color: t.color }}>{s.value}</div>
                                            <div style={{ fontSize: 9, color: "#64748b", fontWeight: 600, textTransform: "uppercase" as const }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Divider from="#06b6d4" to="#f59e0b" />

            {/* ═══════════════════════════════════════════════════════
                BAND 02 — SECTORES (fondo medio)
            ═══════════════════════════════════════════════════════ */}
            <section id="sectors" style={{ ...st.band, background: "#0c1422" }}>
                <div style={st.bandInner}>
                    <SectionHeader num="02" title="Sectores de Alto Valor Añadido" sub="Verticales con contratos recurrentes, barrera de entrada alta y margen bruto >60%." color="#f59e0b" badge="MERCADOS OBJETIVO" />
                    <div style={st.sectorGrid}>
                        {SECTORS_DATA.map(sec => (
                            <a key={sec.name} href={sec.href} style={{ ...st.sectorCard, borderColor: `${sec.color}16`, textDecoration: "none" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontSize: 28 }}>{sec.icon}</span>
                                    <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>{sec.name}</div>
                                </div>
                                <p style={{ margin: "8px 0 0", fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{sec.desc}</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 10 }}>
                                    {sec.kpis.map((k, i) => (
                                        <div key={i} style={{ fontSize: 11, color: sec.color, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: sec.color, flexShrink: 0 }} />
                                            {k}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 14, fontSize: 10, color: "#475569", fontWeight: 600 }}>Ver dashboard →</div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <Divider from="#f59e0b" to="#ef4444" />

            {/* ═══════════════════════════════════════════════════════
                BAND 03 — ANÁLISIS 360° (fondo oscuro)
            ═══════════════════════════════════════════════════════ */}
            <section id="analysis" style={{ ...st.band, background: "#070c17" }}>
                <div style={st.bandInner}>
                    <SectionHeader num="03" title="Análisis de Viabilidad & Riesgos" sub="Evaluación 360° de fortalezas, debilidades, handicaps, dependencias críticas y gobernanza societaria." color="#ef4444" badge="DUE DILIGENCE" />
                    <RiskAnalysis />
                </div>
            </section>

            <Divider from="#ef4444" to="#8b5cf6" />

            {/* ═══════════════════════════════════════════════════════
                BAND 04 — ESTRUCTURA DE CAPITAL (fondo medio)
            ═══════════════════════════════════════════════════════ */}
            <section id="capital" style={{ ...st.band, background: "#0c1422" }}>
                <div style={st.bandInner}>
                    <SectionHeader num="04" title="Estructura de Capital & Ruta de Financiación" sub="Mix optimizado de capital social, deuda pública sin aval y subvenciones a fondo perdido." color="#8b5cf6" badge="ESTRUCTURA FINANCIERA" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                        <FundingSources />
                        <CapitalRoute />
                    </div>
                </div>
            </section>

            <Divider from="#8b5cf6" to="#10b981" />

            {/* ═══════════════════════════════════════════════════════
                BAND 05 — SIMULADOR (fondo oscuro)
            ═══════════════════════════════════════════════════════ */}
            <section id="viability" style={{ ...st.band, background: "#070c17" }}>
                <div style={st.bandInner}>
                    <SectionHeader num="05" title="Simulador de Viabilidad Económica" sub="Tres escenarios de tracción comercial con cálculos reales de revenue, costes, breakeven y ROI." color="#10b981" badge="PROYECCIONES" />
                    <ViabilitySimulator />
                </div>
            </section>

            <Divider from="#10b981" to="#06b6d4" />

            {/* ═══════════════════════════════════════════════════════
                BAND 06 — ASESOR IA (fondo medio)
            ═══════════════════════════════════════════════════════ */}
            <section id="advisor" style={{ ...st.band, background: "#0c1422" }}>
                <div style={st.bandInner}>
                    <SectionHeader num="06" title="Experto Financiero Virtual" sub="Un asistente IA que responde dudas sobre financiación reembolsable, fondo perdido, ENISA, Kit Digital y leasing fiscal." color="#06b6d4" badge="ASISTENTE INTELIGENTE" />
                    <FinancialAdvisor />
                </div>
            </section>

            {/* ─── DISCLAIMER ─────────────────────────────────────── */}
            <footer style={st.footer}>
                <div style={st.footerInner}>
                    ⚠️ <strong>Aviso legal:</strong> Las cifras y proyecciones presentadas son estimaciones basadas en datos públicos y supuestos de mercado.
                    No constituyen asesoramiento financiero profesional. Consulte con un asesor fiscal cualificado antes de tomar decisiones de inversión.
                    Las condiciones de ENISA, Kit Digital y ayudas públicas están sujetas a las convocatorias vigentes.
                </div>
            </footer>
        </div>
    );
}

/* ═══════ Helpers ═══════ */

function Kpi({ l, v, s }: { l: string; v: string; s: string }) {
    return (
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "14px 18px", flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{l}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9", marginTop: 2 }}>{v}</div>
            <div style={{ fontSize: 10, color: "#06b6d4", fontWeight: 600 }}>{s}</div>
        </div>
    );
}

function SectionHeader({ num, title, sub, color, badge }: { num: string; title: string; sub: string; color: string; badge: string }) {
    return (
        <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                <span style={{
                    fontSize: 28, fontWeight: 900, color: `${color}30`,
                    fontFamily: "monospace", lineHeight: 1,
                }}>{num}</span>
                <span style={{
                    fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 5,
                    background: `${color}12`, color, border: `1px solid ${color}30`,
                    textTransform: "uppercase" as const, letterSpacing: "0.08em",
                }}>{badge}</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.02em" }}>{title}</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b", maxWidth: 640, lineHeight: 1.5 }}>{sub}</p>
        </div>
    );
}

function Divider({ from, to }: { from: string; to: string }) {
    return (
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent 5%, ${from}40 30%, ${to}40 70%, transparent 95%)` }} />
    );
}

/* ═══════ Styles ═══════ */

const st: Record<string, React.CSSProperties> = {
    /* Hero */
    hero: { background: "linear-gradient(145deg, #050a15 0%, #0d1a2e 50%, #08101e 100%)", borderBottom: "1px solid rgba(6,182,212,.08)" },
    heroInner: { position: "relative", maxWidth: 1100, margin: "0 auto", padding: "52px 32px 40px", overflow: "hidden" },
    heroGlow: { position: "absolute", top: -80, right: -40, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,.1) 0%, transparent 65%)", pointerEvents: "none" as const },
    heroGlow2: { position: "absolute", bottom: -50, left: 40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,.07) 0%, transparent 65%)", pointerEvents: "none" as const },
    badge: { display: "inline-block", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 6, background: "rgba(6,182,212,.12)", color: "#06b6d4", border: "1px solid rgba(6,182,212,.2)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 16 },
    h1: { margin: 0, fontSize: 36, fontWeight: 900, color: "#f1f5f9", lineHeight: 1.15, letterSpacing: "-0.02em" },
    grad: { background: "linear-gradient(135deg, #06b6d4, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    heroSub: { margin: "14px 0 0", fontSize: 14, color: "#94a3b8", lineHeight: 1.65, maxWidth: 640 },
    kpiRow: { display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" as const },

    /* Sticky nav */
    stickyNav: {
        position: "sticky" as const, top: 64, zIndex: 90,
        background: "rgba(5,10,21,.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,.05)",
    },
    stickyInner: { maxWidth: 1100, margin: "0 auto", padding: "8px 32px", display: "flex", gap: 6, flexWrap: "wrap" as const },
    pill: {
        display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600,
        padding: "5px 12px", borderRadius: 8, border: "1px solid",
        textDecoration: "none", cursor: "pointer", transition: "all .2s",
    },

    /* Full-width bands */
    band: { padding: "56px 0" },
    bandInner: { maxWidth: 1100, margin: "0 auto", padding: "0 32px" },

    /* Grids */
    techGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
    techCard: { background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 16, padding: 20, border: "1px solid" },
    sectorGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 },
    sectorCard: { background: "linear-gradient(135deg, #0f172a, #1a2540)", borderRadius: 16, padding: 20, border: "1px solid", display: "flex", flexDirection: "column" as const },

    /* Footer */
    footer: { background: "#060a14", borderTop: "1px solid rgba(255,255,255,.04)", padding: "20px 0" },
    footerInner: { maxWidth: 1100, margin: "0 auto", padding: "0 32px", fontSize: 11, color: "#475569", lineHeight: 1.5 },
};

"use client";
import React, { useState, useMemo } from "react";

type Scenario = "pessimistic" | "realistic" | "optimistic";

interface ScenarioData {
    id: Scenario;
    label: string;
    icon: string;
    color: string;
    description: string;
    servicesPerWeek: string;
    avgTicket: number;
    weeklyRevenue: number;
    monthlyRevenue: number;
    annualRevenue: number;
    monthlyCosts: number;
    monthlyProfit: number;
    breakEvenMonths: number;
    roi18Months: number;
    highlights: string[];
}

const INITIAL_INVESTMENT = 120000;
const FIXED_MONTHLY_COSTS = 4200; // Alquiler + seguros + salarios base + gastos generales
const VAR_COST_PER_SERVICE = 180; // Consumibles + desplazamiento + desgaste equipo

function buildScenario(id: Scenario, label: string, icon: string, color: string, description: string, servPerWeek: number, avgTicket: number, highlights: string[]): ScenarioData {
    const weeklyRev = servPerWeek * avgTicket;
    const monthlyRev = weeklyRev * 4.33;
    const annualRev = monthlyRev * 12;
    const monthlyVarCosts = servPerWeek * VAR_COST_PER_SERVICE * 4.33;
    const totalMonthlyCosts = FIXED_MONTHLY_COSTS + monthlyVarCosts;
    const monthlyProfit = monthlyRev - totalMonthlyCosts;
    const breakEven = monthlyProfit > 0 ? Math.ceil(INITIAL_INVESTMENT / monthlyProfit) : 999;
    const profit18 = monthlyProfit * 18;
    const roi18 = ((profit18 - INITIAL_INVESTMENT) / INITIAL_INVESTMENT) * 100;

    return {
        id, label, icon, color, description,
        servicesPerWeek: `${servPerWeek} servicio${servPerWeek > 1 ? "s" : ""}/semana`,
        avgTicket, weeklyRevenue: weeklyRev, monthlyRevenue: monthlyRev,
        annualRevenue: annualRev, monthlyCosts: totalMonthlyCosts,
        monthlyProfit, breakEvenMonths: breakEven, roi18Months: roi18,
        highlights,
    };
}

const SCENARIOS: ScenarioData[] = [
    buildScenario("pessimistic", "Pesimista", "📉", "#ef4444",
        "Escenario conservador con baja tracción comercial — 1 servicio semanal. Foco en alcanzar el punto de equilibrio.",
        1, 1800,
        [
            "Punto de equilibrio como métrica principal",
            "Cash-flow negativo hasta breakeven — requiere reserva de tesorería",
            "Foco en fidelización: convertir cada cliente en contrato recurrente",
            "Prioridad: penetración en mercado local (radio 50km)",
        ]),
    buildScenario("realistic", "Realista", "📊", "#f59e0b",
        "Escenario base con tracción moderada — 3 servicios semanales. ROI positivo a 18 meses.",
        3, 1600,
        [
            "ROI a 18 meses como métrica de éxito",
            "Mix de clientes: 60% puntuales + 40% contratos anuales de mantenimiento",
            "Capacidad operativa: 1 equipo, 1 operador + 1 comercial",
            "Reinversión del 30% de beneficio en marketing digital y ferias",
        ]),
    buildScenario("optimistic", "Optimista", "🚀", "#10b981",
        "Escenario de escalabilidad con contratos industriales recurrentes y expansión territorial.",
        7, 2200,
        [
            "Contratos industriales recurrentes (mensuales/trimestrales)",
            "Base instalada: 8–12 clientes industriales en contrato",
            "Segundo equipo operativo a partir del mes 10",
            "Expansión territorial: oficina satélite o franquicia a 24 meses",
            "Facturación objetivo >500k€/año en el año 2",
        ]),
];

function fmt(n: number) {
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k€`;
    return `${n.toFixed(0)}€`;
}

export default function ViabilitySimulator() {
    const [activeIdx, setActiveIdx] = useState(1); // Default: realistic
    const sc = SCENARIOS[activeIdx];

    return (
        <div style={s.wrap}>
            <h3 style={s.title}>📐 Simulador de Viabilidad Económica</h3>
            <p style={s.subtitle}>Inversión inicial estimada: <strong style={{ color: "#06b6d4" }}>{fmt(INITIAL_INVESTMENT)}</strong> · Costes fijos: {fmt(FIXED_MONTHLY_COSTS)}/mes</p>

            {/* Scenario tabs */}
            <div style={s.tabs}>
                {SCENARIOS.map((sc, i) => (
                    <button key={sc.id} onClick={() => setActiveIdx(i)} style={{
                        ...s.tab,
                        borderColor: i === activeIdx ? sc.color : "rgba(255,255,255,.06)",
                        background: i === activeIdx ? `${sc.color}11` : "transparent",
                        color: i === activeIdx ? sc.color : "#64748b",
                    }}>
                        <span style={{ fontSize: 20 }}>{sc.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{sc.label}</span>
                        <span style={{ fontSize: 10 }}>{sc.servicesPerWeek}</span>
                    </button>
                ))}
            </div>

            {/* KPI Row */}
            <div style={s.kpiRow}>
                <KPI label="Ingresos Mensuales" value={fmt(sc.monthlyRevenue)} color={sc.color} />
                <KPI label="Costes Mensuales" value={fmt(sc.monthlyCosts)} color="#94a3b8" />
                <KPI label="Beneficio Mensual" value={fmt(sc.monthlyProfit)} color={sc.monthlyProfit > 0 ? "#10b981" : "#ef4444"} />
                <KPI label="Punto de Equilibrio" value={sc.breakEvenMonths < 100 ? `${sc.breakEvenMonths} meses` : "N/A"} color="#f59e0b" />
                <KPI label="ROI a 18 Meses" value={`${sc.roi18Months > 0 ? "+" : ""}${sc.roi18Months.toFixed(0)}%`} color={sc.roi18Months > 0 ? "#10b981" : "#ef4444"} />
            </div>

            {/* Revenue bar visualization */}
            <div style={s.barSection}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, marginBottom: 8 }}>Desglose Mensual</div>
                <div style={{ display: "flex", gap: 4, height: 32, borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ flex: sc.monthlyCosts, background: "rgba(239,68,68,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fca5a5" }}>
                        Costes {fmt(sc.monthlyCosts)}
                    </div>
                    {sc.monthlyProfit > 0 && (
                        <div style={{ flex: sc.monthlyProfit, background: "rgba(16,185,129,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#6ee7b7" }}>
                            Beneficio {fmt(sc.monthlyProfit)}
                        </div>
                    )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "#475569" }}>
                    <span>0€</span>
                    <span>Ingreso Total: {fmt(sc.monthlyRevenue)}/mes</span>
                </div>
            </div>

            {/* Description + Highlights */}
            <div style={s.infoBox}>
                <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{sc.description}</p>
                <ul style={{ margin: "10px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
                    {sc.highlights.map((h, i) => (
                        <li key={i} style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.4 }}>{h}</li>
                    ))}
                </ul>
            </div>

            {/* Annual projection */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <MiniStat label="Facturación Anual" value={fmt(sc.annualRevenue)} color={sc.color} />
                <MiniStat label="Ticket Medio" value={`${sc.avgTicket}€/servicio`} color="#94a3b8" />
                <MiniStat label="Coste Variable" value={`${VAR_COST_PER_SERVICE}€/serv`} color="#64748b" />
            </div>
        </div>
    );
}

function KPI({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 110, padding: "10px 12px", borderRadius: 10, background: `${color}08`, border: `1px solid ${color}18` }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const }}>{label}</span>
            <span style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: "-0.02em" }}>{value}</span>
        </div>
    );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div style={{ textAlign: "center" as const }}>
            <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 10, color: "#475569" }}>{label}</div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 16, background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,.08)" },
    title: { margin: 0, fontSize: 20, fontWeight: 800, color: "#f1f5f9" },
    subtitle: { margin: "4px 0 0", fontSize: 13, color: "#64748b" },
    tabs: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 },
    tab: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 8px", borderRadius: 12, border: "1px solid", cursor: "pointer", transition: "all 0.2s" },
    kpiRow: { display: "flex", gap: 8, flexWrap: "wrap" as const },
    barSection: { background: "rgba(0,0,0,.2)", borderRadius: 12, padding: 14 },
    infoBox: { background: "rgba(0,0,0,.15)", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,.04)" },
};

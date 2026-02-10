"use client";
import React, { useState } from "react";

interface Step {
    num: number;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    timing: string;
    description: string;
    keyPoints: string[];
}

const STEPS: Step[] = [
    {
        num: 1, title: "Inyección Inicial del Socio", subtitle: "Capital Social",
        icon: "🤝", color: "#06b6d4", timing: "Mes 0",
        description: "El socio inversor aporta el capital fundacional que constituye la base de la sociedad (SL). Esta inyección es la palanca que activa todas las fuentes de financiación pública posteriores.",
        keyPoints: [
            "Constitución de la SL con capital social mínimo + prima de emisión",
            "Deducción fiscal del 30% por inversión en empresa de nueva creación (Art. 68.1 LIRPF)",
            "El capital social es requisito previo para solicitar ENISA",
            "Permite demostrar solvencia ante ICO y entidades de leasing",
        ],
    },
    {
        num: 2, title: "Kit Digital", subtitle: "Fondo Perdido Inmediato",
        icon: "💻", color: "#10b981", timing: "Mes 1–2",
        description: "Solicitud inmediata del Kit Digital a través de Acelera Pyme. Subvención 100% a fondo perdido para herramientas de digitalización: web profesional, CRM, ERP, facturación electrónica.",
        keyPoints: [
            "3.000€ – 6.000€ sin devolución",
            "Tramitación rápida: resolución en 3–6 semanas",
            "Cubre: web corporativa, software de gestión, presencia digital",
            "No consume capacidad de endeudamiento",
        ],
    },
    {
        num: 3, title: "Préstamo ENISA", subtitle: "Apalancamiento sin Aval",
        icon: "🏛️", color: "#8b5cf6", timing: "Mes 2–4",
        description: "Tramitación del préstamo participativo ENISA. Es la fuente de financiación más estratégica: largo plazo, sin garantías personales y con carencia total de 5 años.",
        keyPoints: [
            "25.000€ – 80.000€ de financiación a largo plazo",
            "Carencia total de 5 años — no se paga nada hasta el año 6",
            "Sin aval personal ni garantías reales",
            "Interés variable vinculado a los resultados de la empresa",
            "Compatible con todas las demás ayudas públicas",
        ],
    },
    {
        num: 4, title: "Adquisición de Activos vía Leasing", subtitle: "Ventaja Fiscal",
        icon: "🏦", color: "#3b82f6", timing: "Mes 3–6",
        description: "Financiación de equipamiento pesado (sistema láser de fibra, equipo de blasting criogénico, tanque ultrasónico) mediante leasing operativo con ventaja fiscal directa.",
        keyPoints: [
            "15.000€ – 40.000€ en maquinaria industrial",
            "Cuotas 100% deducibles como gasto operativo",
            "La propia máquina sirve como garantía — sin aval adicional",
            "Opción de compra al final del contrato (valor residual ~1%)",
            "Mejora la estructura del balance (activo fuera de balance en leasing operativo)",
        ],
    },
];

export default function CapitalRoute() {
    const [active, setActive] = useState(0);
    const step = STEPS[active];

    return (
        <div style={s.wrap}>
            <h3 style={s.title}>🗺️ Ruta del Capital</h3>
            <p style={s.subtitle}>Secuencia óptima para maximizar el apalancamiento con mínimo riesgo personal</p>

            {/* Timeline bar */}
            <div style={s.timeline}>
                {/* Connection line */}
                <div style={s.line} />
                {STEPS.map((st, i) => (
                    <div key={i} onClick={() => setActive(i)} style={{
                        ...s.stepNode,
                        borderColor: i <= active ? st.color : "rgba(255,255,255,.1)",
                        background: i === active ? `${st.color}22` : i < active ? `${st.color}11` : "rgba(0,0,0,.3)",
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: "50%", display: "flex",
                            alignItems: "center", justifyContent: "center", fontSize: 18,
                            background: i <= active ? `${st.color}22` : "rgba(255,255,255,.03)",
                            border: `2px solid ${i <= active ? st.color : "rgba(255,255,255,.1)"}`,
                            transition: "all 0.3s",
                        }}>
                            {st.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: i <= active ? st.color : "#475569", textTransform: "uppercase" as const }}>{st.timing}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: i <= active ? "#f1f5f9" : "#64748b" }}>{st.title}</div>
                            <div style={{ fontSize: 10, color: "#475569" }}>{st.subtitle}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail panel */}
            <div style={{ ...s.detail, borderColor: `${step.color}33` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{step.icon}</span>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>Paso {step.num}: {step.title}</div>
                        <span style={{
                            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                            background: `${step.color}22`, color: step.color,
                        }}>{step.subtitle} · {step.timing}</span>
                    </div>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{step.description}</p>
                <ul style={{ margin: "10px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 5 }}>
                    {step.keyPoints.map((p, i) => (
                        <li key={i} style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.4 }}>{p}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 16, background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,.08)" },
    title: { margin: 0, fontSize: 20, fontWeight: 800, color: "#f1f5f9" },
    subtitle: { margin: "4px 0 0", fontSize: 13, color: "#64748b" },
    timeline: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, position: "relative" },
    line: { position: "absolute", top: 18, left: "5%", right: "5%", height: 2, background: "linear-gradient(90deg, #06b6d4, #8b5cf6, #3b82f6)", opacity: 0.2, zIndex: 0 },
    stepNode: { position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "12px 8px", borderRadius: 12, border: "1px solid", cursor: "pointer", transition: "all 0.2s", textAlign: "center" as const },
    detail: { background: "rgba(0,0,0,.2)", borderRadius: 14, padding: 20, border: "1px solid", transition: "border-color 0.3s" },
};

"use client";
import React, { useState } from "react";

/* ═══════ Types ═══════ */

type Impact = "bajo" | "medio" | "alto" | "crítico";
type TabId = "pros" | "contras" | "handicaps" | "dependencias" | "gobernanza";

interface Row {
    factor: string;
    description: string;
    impact: Impact;
    mitigation: string;
}

interface Tab {
    id: TabId;
    icon: string;
    label: string;
    color: string;
    summary: string;
    rows: Row[];
}

/* ═══════ Data ═══════ */

const IMPACT_STYLE: Record<Impact, { bg: string; text: string; label: string }> = {
    bajo: { bg: "rgba(16,185,129,.12)", text: "#10b981", label: "BAJO" },
    medio: { bg: "rgba(245,158,11,.12)", text: "#f59e0b", label: "MEDIO" },
    alto: { bg: "rgba(239,68,68,.12)", text: "#ef4444", label: "ALTO" },
    crítico: { bg: "rgba(220,38,38,.18)", text: "#dc2626", label: "CRÍTICO" },
};

const TABS: Tab[] = [
    {
        id: "pros", icon: "✅", label: "Fortalezas", color: "#10b981",
        summary: "Ventajas competitivas estructurales del modelo IntegriTech Pro frente a operadores de limpieza industrial tradicionales.",
        rows: [
            { factor: "Modelo Residuo Cero", description: "Las tres tecnologías (láser, criogenia, ultrasonidos) generan cero residuos secundarios. Eliminación del coste de gestión de residuos peligrosos y cumplimiento ESG nativo.", impact: "alto", mitigation: "Certificar ISO 14001 en los primeros 12 meses para capitalizar esta ventaja como argumento comercial diferencial." },
            { factor: "Kit Digital (Fondo Perdido)", description: "3.000€–6.000€ de subvención 100% a fondo perdido para digitalización (web, CRM, ERP). No consume capacidad de endeudamiento ni requiere devolución.", impact: "medio", mitigation: "Solicitar inmediatamente tras la constitución. Plazo de resolución: 3–6 semanas." },
            { factor: "Carencia ENISA 5 Años", description: "Préstamo participativo sin pagos durante 5 años. Permite reinvertir todo el cash-flow generado en crecimiento durante la fase crítica. Sin garantías personales.", impact: "alto", mitigation: "Preparar plan de empresa sólido. ENISA exige fondos propios ≥ importe solicitado." },
            { factor: "Barrera de Entrada Tecnológica", description: "El coste del equipamiento (láser fibra + criogénico + ultrasónico) y la formación necesaria crean una barrera natural contra nuevos entrantes en el mercado local.", impact: "alto", mitigation: "Proteger know-how mediante NDAs y contratos de exclusividad con proveedores de formación." },
            { factor: "Triple Tecnología Integrada", description: "Único operador en la Comunidad Valenciana que ofrece las tres tecnologías. Capacidad de ofrecer contratos de mantenimiento integral sin subcontratar.", impact: "alto", mitigation: "Registrar marca y posicionar como 'Solución 360°' en comunicación comercial." },
            { factor: "Mercado en Expansión", description: "Sector de limpieza industrial no destructiva con CAGR del 8.2%. Regulaciones medioambientales cada vez más restrictivas favorecen tecnologías limpias.", impact: "medio", mitigation: "Monitorizar convocatorias IVACE y CDTI para co-financiar I+D de nuevas aplicaciones." },
        ],
    },
    {
        id: "contras", icon: "⚠️", label: "Debilidades", color: "#f59e0b",
        summary: "Vulnerabilidades internas que deben gestionarse activamente para asegurar la viabilidad a largo plazo del proyecto.",
        rows: [
            { factor: "Carga de Deuda a Largo Plazo", description: "ENISA (hasta 80k€) + ICO/Leasing (hasta 40k€) generan una obligación de pago a partir del año 6. Si la empresa no ha alcanzado velocidad de crucero, la presión sobre cash-flow será significativa.", impact: "alto", mitigation: "Crear fondo de reserva del 10% del beneficio mensual desde el mes 1. Objetivo: colchón ≥15k€ antes del año 5." },
            { factor: "Dependencia Formación Operativa", description: "El socio operativo requiere formación certificada en las tres tecnologías. Curva de aprendizaje de 3–6 meses. Durante ese período, la capacidad operativa es limitada.", impact: "medio", mitigation: "Iniciar formación antes o durante la constitución. Obtener certificaciones del fabricante de equipo láser." },
            { factor: "Costes de Mantenimiento", description: "Equipos de alta gama (láser fibra, compresor criogénico) requieren mantenimiento preventivo periódico. Coste estimado: 3.000€–5.000€/año por equipo.", impact: "medio", mitigation: "Negociar contratos de mantenimiento con los proveedores al momento de la compra. Incluir en el leasing si es posible." },
            { factor: "Estructura 50/50", description: "La paridad absoluta entre socios puede generar bloqueo en decisiones estratégicas si hay desacuerdo. Sin mecanismo de desempate natural.", impact: "alto", mitigation: "Establecer cláusulas de resolución en pacto de socios: mediación obligatoria, arbitraje, y derecho de arrastre (drag-along)." },
            { factor: "Concentración de Riesgo Operativo", description: "Un solo operador técnico para las tres tecnologías. Una baja laboral prolongada paraliza la facturación de forma inmediata.", impact: "alto", mitigation: "Contratar seguro de hombre clave. Plan de formación para un segundo operador a partir del mes 12." },
        ],
    },
    {
        id: "handicaps", icon: "🚧", label: "Handicaps", color: "#f97316",
        summary: "Limitaciones estructurales del modelo de negocio que condicionan la escalabilidad y la operativa diaria.",
        rows: [
            { factor: "Volatilidad Precio Hielo Seco", description: "El coste del CO₂ en pellets fluctúa con el mercado energético (gas natural). Subidas del 20–40% registradas en 2022–2023. Impacta directamente en el margen del servicio criogénico.", impact: "medio", mitigation: "Negociar contratos de suministro a precio fijo anual. Diversificar proveedores (mínimo 2). Considerar tanque de uso propio si el volumen lo justifica." },
            { factor: "Limitación Vehículo Pequeño", description: "Una furgoneta pequeña limita el radio de acción y la capacidad de transportar el equipo completo (los tres sistemas) simultáneamente. Limita contratos industriales de gran volumen.", impact: "medio", mitigation: "Planificar rutas por tecnología (no mixtas). Evaluar upgrade a furgón grande o vehículo con remolque a partir del mes 12." },
            { factor: "Tramitación de Ayudas Autonómicas", description: "Las ayudas IVACE y fondos europeos tienen convocatorias esporádicas, plazos largos de resolución (3–12 meses) y requisitos de justificación técnica complejos.", impact: "bajo", mitigation: "Contratar gestor especializado en subvenciones o consultoría que trabaje a éxito. No depender de estas ayudas en el plan base." },
            { factor: "Estacionalidad Náutica", description: "El sector náutico concentra demanda en los meses previos a la temporada (marzo–mayo). De noviembre a febrero, la demanda cae significativamente.", impact: "medio", mitigation: "Compensar con contratos industriales y de patrimonio (demanda más estable). Ofrecer descuentos en temporada baja." },
            { factor: "Regulación Nuclear", description: "El acceso al sector nuclear requiere certificaciones CSN específicas, seguros de responsabilidad civil nuclear y auditorías periódicas. Barrera de entrada alta pero también de salida.", impact: "alto", mitigation: "Evaluar entrada al sector nuclear solo a partir del año 2, una vez consolidada la operativa en náutica e industria." },
        ],
    },
    {
        id: "dependencias", icon: "🔗", label: "Dependencias", color: "#ef4444",
        summary: "Factores externos e internos de los que depende críticamente el proyecto y que, si fallan, comprometen la viabilidad.",
        rows: [
            { factor: "Socio Inversor → ENISA", description: "La aportación del socio inversor es OBLIGATORIA para solicitar ENISA. ENISA exige que los fondos propios de la empresa sean ≥ al importe solicitado. Sin la inyección de capital, no hay acceso a ENISA.", impact: "crítico", mitigation: "Formalizar compromiso de inversión mediante carta de intenciones vinculante antes de iniciar trámites de constitución." },
            { factor: "Socio Operativo (Salud/Disponibilidad)", description: "El 100% de la capacidad productiva depende de una sola persona. Baja médica, accidente laboral o burn-out paralizan la empresa de forma inmediata.", impact: "alto", mitigation: "Seguro de hombre clave. Formación cruzada a partir del mes 12. Protocolo de operador sustituto con acuerdo de colaboración con otro operador láser." },
            { factor: "Exclusividad del Operativo", description: "Si el socio operativo no tiene cláusula de exclusividad, puede derivar clientes a actividades propias o a terceros, generando conflicto de intereses.", impact: "alto", mitigation: "Cláusula de no competencia y dedicación exclusiva en el pacto de socios. Mínimo 3 años post-constitución." },
            { factor: "Clúster Cerámico de Castellón", description: "El 40–50% de los clientes potenciales industriales pertenecen al sector cerámico. Una recesión sectorial impactaría directamente en la cartera de pedidos.", impact: "alto", mitigation: "Diversificar: objetivo máx. 35% facturación en cerámico. Desarrollar proactivamente sectores alternativos (agroalimentario, petroquímico, automotive)." },
            { factor: "Gigafactoría Sagunto (PowerCo/VW)", description: "La construcción de la gigafactoría de baterías en Sagunto representa una oportunidad de contrato recurrente de gran volumen. Pero su calendario depende de decisiones corporativas de VW.", impact: "medio", mitigation: "No incluir en el plan base. Tratar como upside. Iniciar networking con subcontratistas de la obra desde ahora." },
        ],
    },
    {
        id: "gobernanza", icon: "⚖️", label: "Gobernanza", color: "#8b5cf6",
        summary: "Análisis de riesgos de la estructura societaria 50/50 entre el socio inversor y el socio operativo (hermanos), con propuestas de mecanismos de resolución.",
        rows: [
            { factor: "Bloqueo Decisional (Deadlock)", description: "En una estructura 50/50, cualquier decisión estratégica requiere unanimidad. Si los socios discrepan, la empresa puede quedar paralizada sin mecanismo de desempate.", impact: "alto", mitigation: "Pacto de socios con cláusula de mediación obligatoria (30 días) → arbitraje vinculante (Cámara de Comercio de Valencia). Costes de arbitraje compartidos." },
            { factor: "Cláusula de Lock-Up", description: "Sin lock-up, cualquier socio puede vender su participación libremente desde el día 1, potencialmente a un tercero hostil o competidor.", impact: "medio", mitigation: "Lock-up de 4 años mínimo. Derecho de adquisición preferente (ROFR) permanente. Valoración por auditor independiente en caso de venta." },
            { factor: "Mayorías Reforzadas", description: "Decisiones críticas (aumento de capital, endeudamiento >20k€, contratación de personal, cambio de objeto social) deben requerir mayoría reforzada o unanimidad.", impact: "medio", mitigation: "Definir catálogo de 'materias reservadas' en el pacto de socios. Ejemplo: toda operación >10k€ requiere firma de ambos socios." },
            { factor: "Derecho de Arrastre (Drag-Along)", description: "Si un socio recibe una oferta de compra por el 100%, debe poder obligar al otro a vender en las mismas condiciones. Sin esto, se impide la venta de la empresa.", impact: "medio", mitigation: "Incluir cláusula drag-along y tag-along recíprocas. Umbral de activación: oferta ≥ 3x valoración de la última ronda." },
            { factor: "Remuneración Asimétrica", description: "El socio operativo trabaja a tiempo completo y el inversor no. Si la remuneración no está pactada, genera resentimiento y conflicto de intereses.", impact: "alto", mitigation: "Pactar salario mensual del operativo (mercado: 2.000€–2.800€ brutos) desde el mes 1. Inversor cobra solo vía dividendos tras breakeven. Revisión salarial anual vinculada a facturación." },
            { factor: "Vínculo Familiar", description: "Siendo hermanos, los conflictos societarios se mezclan con dinámicas familiares. El componente emocional dificulta la toma de decisiones objetivas y la aplicación de cláusulas contractuales.", impact: "alto", mitigation: "Asesor externo independiente (mentor/advisor) con voto de calidad en materias reservadas. Reuniones formales trimestrales de socios con acta." },
        ],
    },
];

/* ═══════ Component ═══════ */

export default function RiskAnalysis() {
    const [activeTab, setActiveTab] = useState<TabId>("pros");
    const tab = TABS.find(t => t.id === activeTab)!;

    return (
        <div style={s.wrap}>
            {/* Tabs */}
            <div style={s.tabBar}>
                {TABS.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                        ...s.tab,
                        borderColor: activeTab === t.id ? t.color : "transparent",
                        background: activeTab === t.id ? `${t.color}10` : "transparent",
                        color: activeTab === t.id ? t.color : "#64748b",
                    }}>
                        <span style={{ fontSize: 16 }}>{t.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{t.label}</span>
                        <span style={{
                            fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                            background: `${t.color}15`, color: t.color,
                        }}>{t.rows.length}</span>
                    </button>
                ))}
            </div>

            {/* Summary */}
            <div style={{ ...s.summary, borderLeftColor: tab.color }}>
                <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{tab.summary}</p>
            </div>

            {/* Table */}
            <div style={s.tableWrap}>
                {/* Header row */}
                <div style={s.tableHeader}>
                    <span style={{ flex: 1.2 }}>Factor</span>
                    <span style={{ flex: 2.5 }}>Descripción</span>
                    <span style={{ flex: 0.6, textAlign: "center" }}>Impacto</span>
                    <span style={{ flex: 2 }}>Mitigación / Acción</span>
                </div>

                {/* Data rows */}
                {tab.rows.map((row, i) => {
                    const imp = IMPACT_STYLE[row.impact];
                    return (
                        <div key={i} style={{
                            ...s.tableRow,
                            background: i % 2 === 0 ? "rgba(0,0,0,.15)" : "rgba(0,0,0,.08)",
                        }}>
                            <div style={{ flex: 1.2 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.4 }}>{row.factor}</div>
                            </div>
                            <div style={{ flex: 2.5 }}>
                                <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{row.description}</div>
                            </div>
                            <div style={{ flex: 0.6, display: "flex", justifyContent: "center" }}>
                                <span style={{
                                    fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4,
                                    background: imp.bg, color: imp.text, letterSpacing: "0.05em",
                                }}>{imp.label}</span>
                            </div>
                            <div style={{ flex: 2 }}>
                                <div style={{ fontSize: 11, color: "#10b981", lineHeight: 1.5, fontStyle: "italic" }}>→ {row.mitigation}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Score legend */}
            <div style={s.legendRow}>
                <span style={{ fontSize: 10, color: "#475569", fontWeight: 600 }}>Escala de Impacto:</span>
                {Object.entries(IMPACT_STYLE).map(([key, val]) => (
                    <span key={key} style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                        background: val.bg, color: val.text,
                    }}>{val.label}</span>
                ))}
            </div>
        </div>
    );
}

/* ═══════ Styles ═══════ */

const s: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 14 },
    tabBar: { display: "flex", gap: 6, flexWrap: "wrap" as const },
    tab: {
        display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
        borderRadius: 10, border: "2px solid", cursor: "pointer",
        transition: "all 0.2s", background: "transparent",
    },
    summary: {
        padding: "12px 16px", borderLeft: "3px solid", borderRadius: "0 8px 8px 0",
        background: "rgba(0,0,0,.12)",
    },
    tableWrap: {
        borderRadius: 12, overflow: "hidden",
        border: "1px solid rgba(255,255,255,.06)",
    },
    tableHeader: {
        display: "flex", gap: 12, padding: "10px 16px",
        background: "rgba(0,0,0,.25)", fontSize: 10, fontWeight: 700,
        color: "#64748b", textTransform: "uppercase" as const,
        letterSpacing: "0.06em",
    },
    tableRow: {
        display: "flex", gap: 12, padding: "14px 16px",
        alignItems: "flex-start", borderTop: "1px solid rgba(255,255,255,.03)",
    },
    legendRow: {
        display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end",
        paddingTop: 4,
    },
};

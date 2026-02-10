/**
 * MaterialComparison — Ventajas y desventajas por método de limpieza
 * según el material del casco seleccionado.
 */

"use client";

import React from "react";
import type { SubstrateType } from "../../lib/types";

// ── Types ────────────────────────────────────────────────

interface MethodInfo {
    method: string;
    icon: string;
    recommended: boolean;
    riskLevel: "bajo" | "medio" | "alto" | "crítico";
    pros: string[];
    cons: string[];
    summary: string;
}

interface MaterialData {
    title: string;
    description: string;
    methods: MethodInfo[];
}

// ── Data ─────────────────────────────────────────────────

const MATERIAL_DATA: Record<SubstrateType, MaterialData> = {
    aluminum: {
        title: "Aluminio 5083",
        description:
            "Aleación marina ligera y resistente a la corrosión. Requiere cuidado especial para preservar la capa de óxido protectora natural (Al₂O₃).",
        methods: [
            {
                method: "Láser",
                icon: "⚡",
                recommended: true,
                riskLevel: "bajo",
                pros: [
                    "No daña la capa de óxido protectora natural (Al₂O₃)",
                    "Precisión micrométrica — no altera tolerancias de láminas finas",
                    "Sin residuos abrasivos que contaminen la superficie",
                    "Ideal para zonas de soldadura TIG/MIG sin debilitar la unión",
                    "Proceso en seco: sin riesgo de corrosión galvánica posterior",
                ],
                cons: [
                    "Mayor inversión inicial en equipo especializado",
                    "Velocidad algo menor en capas de oxidación muy gruesas (>2mm)",
                ],
                summary:
                    "Método óptimo para aluminio marino. Preserva integridad estructural y acabado.",
            },
            {
                method: "Arenado",
                icon: "🔨",
                recommended: false,
                riskLevel: "alto",
                pros: [
                    "Rápido en superficies grandes y planas",
                    "Coste de equipo relativamente bajo",
                ],
                cons: [
                    "Puede deformar láminas finas de aluminio (<4mm)",
                    "Incrusta partículas abrasivas en la superficie porosa",
                    "Riesgo de contaminación férrica (óxido de hierro del abrasivo)",
                    "Genera polvo tóxico de aluminio — requiere protección respiratoria ATEX",
                    "Elimina la capa protectora Al₂O₃, acelerando corrosión futura",
                ],
                summary:
                    "Alto riesgo de daño superficial y contaminación. No recomendado para cascos de aluminio de alto valor.",
            },
            {
                method: "Químico",
                icon: "🧪",
                recommended: false,
                riskLevel: "medio",
                pros: [
                    "Sin impacto mecánico — no deforma la superficie",
                    "Puede acceder a geometrías complejas y rincones",
                ],
                cons: [
                    "Reacciones adversas con ciertas aleaciones Al-Mg (picaduras)",
                    "Residuos líquidos clasificados como peligrosos (pH extremo)",
                    "Tiempo de actuación largo e impredecible (2-8 horas)",
                    "Puede causar corrosión intergranular si no se neutraliza a tiempo",
                    "Regulaciones REACH/IMO cada vez más restrictivas",
                ],
                summary:
                    "Viable pero con riesgos químicos significativos y problemas regulatorios crecientes.",
            },
        ],
    },
    steel: {
        title: "Acero Naval",
        description:
            "Acero estructural marino (AH36/DH36). Resistente pero propenso a oxidación severa en ambiente salino. Requiere preparación Sa 2.5 para recubrimientos.",
        methods: [
            {
                method: "Láser",
                icon: "⚡",
                recommended: true,
                riskLevel: "bajo",
                pros: [
                    "Elimina óxido sin reducir espesor del metal — crítico en cascos envejecidos",
                    "Prepara superficie a estándar Sa 2.5 / Sa 3 sin abrasivos",
                    "Sin necesidad de decapado ni pasivado posterior",
                    "Acceso a zonas confinadas (sentinas, tanques de lastre)",
                    "No genera chispas — apto para zonas ATEX cerca de combustible",
                ],
                cons: [
                    "Velocidad menor en capas de óxido >5mm de espesor",
                    "Coste por hora más elevado que arenado convencional",
                ],
                summary:
                    "Excelente para acero marino. Ideal cuando se necesita preservar espesor en cascos con corrosión avanzada.",
            },
            {
                method: "Arenado",
                icon: "🔨",
                recommended: true,
                riskLevel: "medio",
                pros: [
                    "Muy efectivo en óxido pesado y escamas de laminación",
                    "Económico en grandes superficies planas (cubiertas, costados)",
                    "Amplia disponibilidad de equipos y operadores certificados",
                ],
                cons: [
                    "Reduce espesor del metal con cada aplicación (~0.05mm por ciclo)",
                    "Requiere contención de residuos costosa en puerto (lonas, aspiración)",
                    "No apto en zonas próximas a equipos electrónicos o maquinaria",
                    "Perfil de anclaje irregular puede atrapar humedad",
                    "Genera >500 kg de residuos abrasivos por sesión típica",
                ],
                summary:
                    "Método tradicional efectivo pero con impacto en espesor y alto volumen de residuos.",
            },
            {
                method: "Químico",
                icon: "🧪",
                recommended: false,
                riskLevel: "alto",
                pros: [
                    "Buena penetración en cavidades y geometrías complejas",
                    "Efectivo contra óxido en capas internas difíciles de alcanzar",
                ],
                cons: [
                    "Genera hidrógeno que fragiliza el acero (hydrogen embrittlement)",
                    "Alto coste de neutralización y gestión de residuos ácidos",
                    "Tiempos de exposición difíciles de controlar en vertical",
                    "Riesgo de corrosión acelerada si queda residuo sin neutralizar",
                    "Prohibido en muchos puertos por normativa medioambiental",
                ],
                summary:
                    "Riesgo de fragilización por hidrógeno. Solo recomendable en situaciones muy específicas bajo supervisión experta.",
            },
        ],
    },
    carbon_fiber: {
        title: "Fibra de Carbono / Gelcoat",
        description:
            "Composite de alta tecnología usado en yates de competición y superyates. Extremadamente sensible a daños mecánicos y térmicos. El gelcoat protege el laminado estructural.",
        methods: [
            {
                method: "Láser",
                icon: "⚡",
                recommended: true,
                riskLevel: "bajo",
                pros: [
                    "No daña las fibras de carbono ni la resina epoxi subyacente",
                    "Control preciso de profundidad de ablación (micras)",
                    "Perfecto para limpiar gelcoat sin penetrar al laminado",
                    "Sin estrés mecánico — zero riesgo de delaminación",
                    "Único método aprobado por fabricantes como Baltic, Pershing y Wally",
                ],
                cons: [
                    "Requiere calibración cuidadosa: cada gelcoat tiene distinto umbral",
                    "Operador debe tener formación específica en composites",
                    "Velocidad reducida por la necesidad de baja potencia controlada",
                ],
                summary:
                    "Único método verdaderamente seguro para composites de alto valor. Estándar de la industria para superyates.",
            },
            {
                method: "Arenado",
                icon: "🔨",
                recommended: false,
                riskLevel: "crítico",
                pros: [],
                cons: [
                    "⛔ RIESGO CRÍTICO: Destruye las fibras de carbono irreversiblemente",
                    "Delamina y fractura el gelcoat en segundos",
                    "No recomendado bajo ninguna circunstancia por ningún fabricante",
                    "Daño estructural irreversible — puede comprometer integridad del casco",
                    "Coste de reparación puede superar el valor del yate",
                ],
                summary:
                    "PROHIBIDO. Daño catastrófico e irreversible garantizado. Nunca usar en composites.",
            },
            {
                method: "Químico",
                icon: "🧪",
                recommended: false,
                riskLevel: "alto",
                pros: [
                    "Puede funcionar con solventes específicos de baja agresividad",
                    "No genera estrés mecánico directo",
                ],
                cons: [
                    "Alto riesgo de degradación de la resina epoxi/viniléster",
                    "Difícil controlar la penetración — puede llegar al laminado",
                    "Residuos tóxicos complejos (solventes orgánicos halogenados)",
                    "Puede causar decoloración permanente del gelcoat",
                    "Incompatible con muchos sistemas de pintura posteriores",
                ],
                summary:
                    "Posible solo con productos muy específicos. Alto riesgo de daño colateral en gelcoat y resina.",
            },
        ],
    },
};

// ── Risk colors ──────────────────────────────────────────

const RISK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    bajo: { bg: "rgba(16, 185, 129, 0.12)", text: "#10b981", border: "rgba(16, 185, 129, 0.3)" },
    medio: { bg: "rgba(245, 158, 11, 0.12)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" },
    alto: { bg: "rgba(239, 68, 68, 0.12)", text: "#ef4444", border: "rgba(239, 68, 68, 0.3)" },
    crítico: { bg: "rgba(220, 38, 38, 0.18)", text: "#dc2626", border: "rgba(220, 38, 38, 0.4)" },
};

// ── Component ────────────────────────────────────────────

interface MaterialComparisonProps {
    substrate: SubstrateType;
}

export default function MaterialComparison({ substrate }: MaterialComparisonProps) {
    const data = MATERIAL_DATA[substrate];
    if (!data) return null;

    return (
        <div style={styles.wrapper}>
            {/* Header */}
            <div style={styles.header}>
                <h3 style={styles.title}>
                    🔬 Comparativa de Métodos — {data.title}
                </h3>
                <p style={styles.description}>{data.description}</p>
            </div>

            {/* Method Cards */}
            <div style={styles.grid}>
                {data.methods.map((m) => {
                    const risk = RISK_COLORS[m.riskLevel];
                    return (
                        <div
                            key={m.method}
                            style={{
                                ...styles.card,
                                ...(m.recommended ? styles.cardRecommended : {}),
                            }}
                        >
                            {/* Card Header */}
                            <div style={styles.cardHeader}>
                                <div style={styles.methodName}>
                                    <span style={{ fontSize: 22 }}>{m.icon}</span>
                                    <span style={styles.methodLabel}>{m.method}</span>
                                </div>
                                <div style={styles.badges}>
                                    {m.recommended && (
                                        <span style={styles.recommendedBadge}>
                                            ✓ Recomendado
                                        </span>
                                    )}
                                    <span
                                        style={{
                                            ...styles.riskBadge,
                                            background: risk.bg,
                                            color: risk.text,
                                            borderColor: risk.border,
                                        }}
                                    >
                                        Riesgo {m.riskLevel}
                                    </span>
                                </div>
                            </div>

                            {/* Summary */}
                            <p style={styles.summary}>{m.summary}</p>

                            {/* Pros */}
                            {m.pros.length > 0 && (
                                <div style={styles.listSection}>
                                    <div style={styles.listTitle}>
                                        <span style={{ color: "#10b981" }}>✅</span> Ventajas
                                    </div>
                                    <ul style={styles.list}>
                                        {m.pros.map((p, i) => (
                                            <li key={i} style={styles.proItem}>
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Cons */}
                            {m.cons.length > 0 && (
                                <div style={styles.listSection}>
                                    <div style={styles.listTitle}>
                                        <span style={{ color: "#ef4444" }}>❌</span> Desventajas
                                    </div>
                                    <ul style={styles.list}>
                                        {m.cons.map((c, i) => (
                                            <li key={i} style={styles.conItem}>
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Styles ───────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    header: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    title: {
        margin: 0,
        fontSize: 20,
        fontWeight: 700,
        color: "#f1f5f9",
        letterSpacing: "-0.02em",
    },
    description: {
        margin: 0,
        fontSize: 14,
        color: "#94a3b8",
        lineHeight: 1.6,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 16,
    },
    card: {
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "border-color 0.3s, box-shadow 0.3s",
    },
    cardRecommended: {
        borderColor: "rgba(6, 182, 212, 0.3)",
        boxShadow: "0 0 24px rgba(6, 182, 212, 0.08)",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap" as const,
        gap: 8,
    },
    methodName: {
        display: "flex",
        alignItems: "center",
        gap: 8,
    },
    methodLabel: {
        fontSize: 18,
        fontWeight: 700,
        color: "#f1f5f9",
    },
    badges: {
        display: "flex",
        gap: 6,
        flexWrap: "wrap" as const,
    },
    recommendedBadge: {
        fontSize: 11,
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: 6,
        background: "rgba(6, 182, 212, 0.15)",
        color: "#06b6d4",
        border: "1px solid rgba(6, 182, 212, 0.3)",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
    },
    riskBadge: {
        fontSize: 11,
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: 6,
        border: "1px solid",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
    },
    summary: {
        margin: 0,
        fontSize: 13,
        color: "#94a3b8",
        lineHeight: 1.5,
        fontStyle: "italic",
        borderLeft: "3px solid rgba(255,255,255,0.1)",
        paddingLeft: 12,
    },
    listSection: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    listTitle: {
        fontSize: 13,
        fontWeight: 600,
        color: "#e2e8f0",
        display: "flex",
        alignItems: "center",
        gap: 6,
    },
    list: {
        margin: 0,
        paddingLeft: 20,
        display: "flex",
        flexDirection: "column",
        gap: 5,
    },
    proItem: {
        fontSize: 13,
        color: "#a7f3d0",
        lineHeight: 1.5,
    },
    conItem: {
        fontSize: 13,
        color: "#fca5a5",
        lineHeight: 1.5,
    },
};

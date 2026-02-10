/**
 * SectorSynergy — Three sector cards showing technology synergy.
 * Elite Maritime, Heritage & Fine Arts, Advanced Industry.
 */
"use client";
import React, { useState } from "react";

interface TechDetail {
    tech: string;
    icon: string;
    color: string;
    role: string;
}

interface Sector {
    id: string;
    icon: string;
    color: string;
    title: string;
    benefit: string;
    synergy: string;
    techs: TechDetail[];
    keywords: string[];
}

const SECTORS: Sector[] = [
    {
        id: "maritime",
        icon: "🛥️",
        color: "#06b6d4",
        title: "Náutica de Élite & Superyates",
        benefit: "Recuperación Integral del Tren Propulsor y Sistemas Auxiliares",
        synergy: `La sinergia de nuestras tres tecnologías ofrece una solución de mantenimiento sin precedentes para activos navales de alto valor. La ablación selectiva por fibra láser ejecuta la de-calcificación precisa de ejes y hélices, eliminando incrustaciones calcáreas capa a capa sin alterar la geometría del sustrato ni comprometer su integridad metalúrgica. Simultáneamente, el blasting criogénico proporciona un desengrase libre de residuos en salas de máquinas y sentinas — crítico en entornos donde el riesgo de infiltración de agua haría inadmisible cualquier método húmedo. La sublimación por choque térmico del CO₂ garantiza cero residuos secundarios en espacios confinados. Para completar el ciclo de mantenimiento, la cavitación acústica ultrasónica restaura inyectores de combustible y herrajes náuticos intrincados a estándares OEM, alcanzando geometrías internas y canales ciegos inaccesibles por medios mecánicos. El resultado: una reducción del 60% en downtime de dique seco y un ROI documentado superior al 300% frente a métodos tradicionales de arenado y decapado químico.`,
        techs: [
            { tech: "Láser", icon: "⚡", color: "#06b6d4", role: "De-calcificación selectiva de ejes y hélices con preservación de sustrato" },
            { tech: "Criogénico", icon: "❄️", color: "#38bdf8", role: "Desengrase de sala de máquinas y sentinas sin riesgo de agua — cero residuos" },
            { tech: "Ultrasonido", icon: "🔊", color: "#a78bfa", role: "Restauración de inyectores y herrajes marinos a estándar OEM" },
        ],
        keywords: ["Ablación selectiva", "Cero residuos secundarios", "Integridad del sustrato"],
    },
    {
        id: "heritage",
        icon: "🏛️",
        color: "#f59e0b",
        title: "Patrimonio Arquitectónico & Bellas Artes",
        benefit: "Conservación No Invasiva de Patrimonio con Trazabilidad Científica",
        synergy: `En la conservación del patrimonio arquitectónico y artístico, la precisión es una obligación ética tanto como técnica. Nuestra solución integrada comienza con la ablación láser selectiva para la eliminación micométrica de hollín, costras negras sulfatadas y depósitos atmosféricos sobre piedra — un proceso que permite discriminar entre la pátina noble deseable y la contaminación dañina, preservando la integridad del sustrato original. El blasting criogénico complementa este enfoque con la eliminación no abrasiva de crecimiento orgánico — musgos, líquenes y colonias fúngicas — mediante sublimación por choque térmico, sin generar presión mecánica ni humedad residual que pueda penetrar en la porosidad de la piedra histórica. Finalmente, la cavitación acústica ultrasónica permite la descontaminación profunda de ornamentos metálicos históricos, herrajes y apliques, eliminando oxidación, verdín y depósitos salinos de geometrías intrincadas sin contacto abrasivo. Las tres tecnologías operan como un mantenimiento no conductivo integral: cero daño, cero residuo, documentación completa conforme a las directrices del ICOMOS.`,
        techs: [
            { tech: "Láser", icon: "⚡", color: "#06b6d4", role: "Eliminación selectiva de hollín y costras sobre piedra — discriminación pátina/contaminante" },
            { tech: "Criogénico", icon: "❄️", color: "#38bdf8", role: "Remoción no abrasiva de musgo, líquenes y colonias fúngicas sin humedad" },
            { tech: "Ultrasonido", icon: "🔊", color: "#a78bfa", role: "Descontaminación profunda de ornamentos metálicos históricos" },
        ],
        keywords: ["Ablación selectiva", "Mantenimiento no conductivo", "Integridad del sustrato"],
    },
    {
        id: "industry",
        icon: "🏭",
        color: "#10b981",
        title: "Industria Avanzada & Generación de Energía",
        benefit: "Mantenimiento Predictivo de Línea con Cero Parada No Planificada",
        synergy: `La industria avanzada y la generación de energía exigen protocolos de mantenimiento que eliminen el downtime no planificado sin comprometer la seguridad operativa. Nuestro sistema integrado despliega la ablación por fibra láser para el de-rusting estructural y la remoción de recubrimientos degradados — alcanzando grados de limpieza SA 2.5 / SA 3 sin medios abrasivos, sin polvo y sin residuo que gestionar. Para equipos que no pueden detenerse, el blasting criogénico ejecuta la "limpieza en caliente" de moldes, prensas y matrices industriales: la sublimación por choque térmico del CO₂ elimina contaminantes directamente sobre equipos en operación a temperatura, eliminando los ciclos de enfriamiento/calentamiento que representan hasta el 40% del downtime en plantas cerámicas y de inyección. En el tercer nivel de profundidad, la cavitación acústica ultrasónica se aplica a la descontaminación interna de válvulas críticas, circuitos hidráulicos y componentes de turbina — alcanzando cada micrón de canales internos donde la acumulación de partículas metálicas, carbonilla o biofilm compromete la eficiencia del sistema. La integración 360° reduce el MTTR en un 55% y genera cero residuos secundarios, cumpliendo con ISO 14001 y los criterios ESG más exigentes.`,
        techs: [
            { tech: "Láser", icon: "⚡", color: "#06b6d4", role: "De-rusting estructural y remoción de recubrimientos — SA 2.5 / SA 3 sin abrasivos" },
            { tech: "Criogénico", icon: "❄️", color: "#38bdf8", role: "Hot-cleaning de moldes y prensas en operación — cero downtime" },
            { tech: "Ultrasonido", icon: "🔊", color: "#a78bfa", role: "Descontaminación interna de válvulas críticas y circuitos hidráulicos" },
        ],
        keywords: ["Sublimación por choque térmico", "Cavitación acústica", "Cero residuos secundarios"],
    },
];

export default function SectorSynergy() {
    const [active, setActive] = useState<string>("maritime");
    const sector = SECTORS.find((s) => s.id === active)!;

    return (
        <div style={styles.wrap}>
            <h3 style={styles.sectionTitle}>Sinergia por Sector</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
                Cada sector exige una combinación diferente. Seleccione un vertical para explorar cómo las tres tecnologías
                se integran para maximizar el ROI.
            </p>

            {/* Sector selector tabs */}
            <div style={styles.tabs}>
                {SECTORS.map((sec) => (
                    <button
                        key={sec.id}
                        onClick={() => setActive(sec.id)}
                        style={{
                            ...styles.tab,
                            ...(active === sec.id ? { background: `${sec.color}15`, borderColor: `${sec.color}40`, color: sec.color } : {}),
                        }}
                    >
                        <span style={{ fontSize: 18 }}>{sec.icon}</span>
                        <span>{sec.title}</span>
                    </button>
                ))}
            </div>

            {/* Active sector detail */}
            <div style={{ ...styles.detail, borderColor: `${sector.color}20` }}>
                <div style={styles.detailHeader}>
                    <span style={{ fontSize: 32 }}>{sector.icon}</span>
                    <div>
                        <h4 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>{sector.title}</h4>
                        <div style={{ fontSize: 13, color: sector.color, fontWeight: 600, marginTop: 2 }}>{sector.benefit}</div>
                    </div>
                </div>

                <p style={{ fontSize: 13, lineHeight: 1.8, color: "#94a3b8", margin: "16px 0" }}>
                    {sector.synergy}
                </p>

                {/* Tech roles */}
                <div style={styles.techGrid}>
                    {sector.techs.map((t) => (
                        <div key={t.tech} style={{ ...styles.techCard, borderColor: `${t.color}20` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <span style={{ fontSize: 18 }}>{t.icon}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.tech}</span>
                            </div>
                            <div style={{ fontSize: 11, lineHeight: 1.5, color: "#cbd5e1" }}>{t.role}</div>
                        </div>
                    ))}
                </div>

                {/* Keywords */}
                <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" as const }}>
                    {sector.keywords.map((kw) => (
                        <span key={kw} style={styles.keyword}>{kw}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    wrap: {},
    sectionTitle: { margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#f1f5f9" },
    tabs: { display: "flex", gap: 10, marginBottom: 20 },
    tab: {
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600,
        background: "rgba(0,0,0,.2)", border: "1px solid rgba(255,255,255,.06)",
        color: "#94a3b8", cursor: "pointer", transition: "all 0.2s",
    },
    detail: {
        padding: 28, borderRadius: 16,
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        border: "1px solid",
    },
    detailHeader: { display: "flex", alignItems: "center", gap: 16 },
    techGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
    techCard: {
        padding: 14, borderRadius: 12,
        background: "rgba(0,0,0,.2)", border: "1px solid",
    },
    keyword: {
        fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 4,
        background: "rgba(255,255,255,.04)", color: "#64748b", border: "1px solid rgba(255,255,255,.08)",
        fontStyle: "italic",
        letterSpacing: "0.02em",
    },
};

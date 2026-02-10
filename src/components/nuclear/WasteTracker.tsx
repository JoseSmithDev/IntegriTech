/**
 * WasteTracker — Waste package lifecycle with half-life countdown.
 */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ISOTOPES, radioactiveDecay } from "../../lib/nuclear-formulas";

interface WastePackage {
    id: string;
    wasteClass: string;
    classColor: string;
    disposal: string;
    isotope: string;
    initialBq: number;
    createdAt: number; // Date.now() ms
    container: string;
    massKg: number;
    location: string;
    status: string;
}

const CLASS_COLORS: Record<string, string> = {
    "EW": "#10b981", "VSLW": "#10b981", "VLLW": "#06b6d4",
    "LLW": "#f59e0b", "ILW": "#f97316", "HLW": "#ef4444",
};
const STATUSES = ["Creado", "Caracterizando", "Acondicionado", "En Almacén", "En Tránsito", "Eliminado"];

const DEMO_PACKAGES: WastePackage[] = [
    { id: "ES-NUC-20260209-0001", wasteClass: "LLW", classColor: "#f59e0b", disposal: "Celda Ingenieril", isotope: "Cs-137", initialBq: 5e8, createdAt: Date.now() - 86400_000 * 30, container: "Bidón 200L", massKg: 180, location: "Bahía-3A", status: "En Almacén" },
    { id: "ES-NUC-20260209-0002", wasteClass: "ILW", classColor: "#f97316", disposal: "Almacén Intermedio", isotope: "Co-60", initialBq: 2e10, createdAt: Date.now() - 86400_000 * 90, container: "Contenedor HIC", massKg: 420, location: "SFA-Norte", status: "Acondicionado" },
    { id: "ES-NUC-20260209-0003", wasteClass: "HLW", classColor: "#ef4444", disposal: "Repositorio Geológico Profundo", isotope: "Pu-239", initialBq: 3e12, createdAt: Date.now() - 86400_000 * 365, container: "Cápsula Vitrificada", massKg: 1200, location: "AGP Nivel 5", status: "Caracterizando" },
];

export default function WasteTracker() {
    const [packages] = useState<WastePackage[]>(DEMO_PACKAGES);
    const [now, setNow] = useState(Date.now());
    const [selectedPkg, setSelectedPkg] = useState<string>(DEMO_PACKAGES[0].id);

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    const selected = packages.find((p) => p.id === selectedPkg)!;
    const iso = ISOTOPES[selected.isotope];
    const elapsed = (now - selected.createdAt) / 1000;
    const decay = radioactiveDecay(selected.initialBq, elapsed, iso.halfLifeSeconds);
    const clearanceTime = iso.halfLifeSeconds / Math.LN2 * Math.log(selected.initialBq / 1);
    const progress = Math.min(elapsed / clearanceTime, 1) * 100;

    return (
        <div style={s.wrap}>
            <h4 style={s.title}>📦 Seguimiento de Residuos Radiactivos</h4>

            {/* Package cards */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto" as const }}>
                {packages.map((pkg) => (
                    <div key={pkg.id} onClick={() => setSelectedPkg(pkg.id)} style={{
                        ...s.pkgCard, borderColor: selectedPkg === pkg.id ? pkg.classColor : "rgba(255,255,255,.05)",
                        background: selectedPkg === pkg.id ? `${pkg.classColor}11` : "rgba(0,0,0,.2)",
                    }}>
                        <span style={{ ...s.classBadge, background: `${pkg.classColor}22`, color: pkg.classColor }}>{pkg.wasteClass}</span>
                        <span style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 700 }}>{pkg.isotope}</span>
                        <span style={{ fontSize: 9, color: "#475569", fontFamily: "monospace" }}>{pkg.id.split("-").slice(-1)}</span>
                    </div>
                ))}
            </div>

            {/* Detail */}
            <div style={s.detail}>
                <div style={s.detailHeader}>
                    <div>
                        <span style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{selected.id}</span>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                            <span style={{ ...s.classBadge, background: `${selected.classColor}22`, color: selected.classColor }}>{selected.wasteClass}</span>
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>{selected.disposal}</span>
                        </div>
                    </div>
                </div>

                {/* Fields */}
                <div style={s.fields}>
                    <DataField label="Isótopo" value={`${selected.isotope} — ${iso.name}`} />
                    <DataField label="Vida Media" value={iso.halfLifeHuman} />
                    <DataField label="Contenedor" value={selected.container} />
                    <DataField label="Masa" value={`${selected.massKg} kg`} />
                    <DataField label="Ubicación" value={selected.location} />
                    <DataField label="Estado" value={selected.status} />
                </div>

                {/* Live Activity */}
                <div style={s.activityBox}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, color: "#64748b" }}>Actividad Actual</span>
                        <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, animation: "pulse 2s infinite" }}>● EN VIVO</span>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#f59e0b", letterSpacing: "-0.02em" }}>
                        {decay.remaining.toExponential(3)} Bq
                    </div>
                    <div style={{ fontSize: 11, color: "#475569" }}>
                        Inicial: {selected.initialBq.toExponential(2)} Bq — Restante: {(decay.fraction * 100).toFixed(6)}%
                    </div>

                    {/* Countdown bar */}
                    <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>Progreso hacia nivel de liberación (1 Bq)</div>
                        <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,.05)" }}>
                            <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, #10b981, ${selected.classColor})`, width: `${progress}%`, transition: "width 1s" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#475569", marginTop: 2 }}>
                            <span>{decay.halfLivesElapsed.toFixed(4)} vidas medias</span>
                            <span>{progress.toFixed(8)}%</span>
                        </div>
                    </div>
                </div>

                {/* Status timeline */}
                <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                    {STATUSES.map((st, i) => {
                        const idx = STATUSES.indexOf(selected.status);
                        const isActive = i <= idx;
                        return (
                            <div key={st} style={{
                                flex: 1, padding: "4px 2px", textAlign: "center" as const, fontSize: 8, fontWeight: 700,
                                borderRadius: 4, textTransform: "uppercase" as const,
                                background: isActive ? `${selected.classColor}22` : "rgba(255,255,255,.03)",
                                color: isActive ? selected.classColor : "#334155",
                            }}>{st}</div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function DataField({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#475569", textTransform: "uppercase" as const }}>{label}</span>
            <span style={{ fontSize: 13, color: "#e2e8f0" }}>{value}</span>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 14, background: "linear-gradient(135deg,#0f172a,#1e293b)", borderRadius: 16, padding: 20, border: "1px solid rgba(255,255,255,.08)" },
    title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
    pkgCard: { padding: "8px 14px", borderRadius: 10, border: "1px solid", display: "flex", flexDirection: "column", gap: 3, cursor: "pointer", transition: "all 0.2s", minWidth: 100 },
    classBadge: { fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" as const, alignSelf: "flex-start" as const },
    detail: { display: "flex", flexDirection: "column", gap: 10 },
    detailHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
    fields: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, padding: "10px 12px", background: "rgba(0,0,0,.2)", borderRadius: 10 },
    activityBox: { display: "flex", flexDirection: "column", gap: 4, padding: "12px 14px", background: "rgba(0,0,0,.3)", borderRadius: 12, border: "1px solid rgba(245,158,11,.15)" },
};

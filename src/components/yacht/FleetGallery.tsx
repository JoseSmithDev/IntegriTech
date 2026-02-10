/**
 * FleetGallery — Gallery of yacht fleet with detailed specs.
 */
"use client";
import React, { useState } from "react";
import type { SubstrateType } from "../../lib/types";

interface YachtMock {
    id: string;
    name: string;
    type: string;
    loa: number;
    beam: number;
    draft: number;
    hull: SubstrateType;
    icon: string;
    homePort: string;
    flag: string;
    lastCleaned: string;
}

const FLEET: YachtMock[] = [
    { id: "Y-001", name: "Aurora Borealis", type: "Superyate", loa: 68.5, beam: 11.2, draft: 3.4, hull: "aluminum", icon: "🛥️", homePort: "Mónaco", flag: "KY", lastCleaned: "2026-01-15" },
    { id: "Y-002", name: "Wind Spirit", type: "Velero Regata", loa: 24.0, beam: 5.8, draft: 4.2, hull: "carbon_fiber", icon: "⛵", homePort: "Palma", flag: "ES", lastCleaned: "2026-02-01" },
    { id: "Y-003", name: "Deep Blue", type: "Catamarán", loa: 18.5, beam: 9.4, draft: 1.1, hull: "aluminum", icon: "🛳️", homePort: "Ibiza", flag: "MT", lastCleaned: "2025-11-20" },
    { id: "Y-004", name: "Titan Worker", type: "Buque Soporte", loa: 45.0, beam: 10.0, draft: 2.8, hull: "steel", icon: "🚢", homePort: "Barcelona", flag: "PA", lastCleaned: "2025-12-10" },
];

export default function FleetGallery({ onSelect }: { onSelect?: (id: string) => void }) {
    const [selected, setSelected] = useState<string>(FLEET[0].id);

    const handleSelect = (id: string) => {
        setSelected(id);
        onSelect?.(id);
    };

    return (
        <div style={s.wrap}>
            <div style={s.header}>
                <h3 style={s.title}>💎 Flota Premium</h3>
                <span style={{ fontSize: 12, color: "#64748b" }}>{FLEET.length} embarcaciones gestionadas</span>
            </div>

            <div style={s.grid}>
                {FLEET.map((y) => (
                    <div key={y.id} onClick={() => handleSelect(y.id)} style={{
                        ...s.card,
                        borderColor: selected === y.id ? "#06b6d4" : "rgba(255,255,255,.05)",
                        background: selected === y.id ? "linear-gradient(135deg, rgba(6,182,212,.1), rgba(6,182,212,.02))" : "rgba(0,0,0,.2)",
                    }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>{y.icon}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{y.name}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>{y.type}</div>

                        <div style={s.specs}>
                            <Spec label="Eslora" value={`${y.loa}m`} />
                            <Spec label="Manga" value={`${y.beam}m`} />
                            <Spec label="Calado" value={`${y.draft}m`} />
                        </div>

                        <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,.05)", display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b" }}>
                            <span>⚓ {y.homePort}</span>
                            <span>🚩 {y.flag}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Spec({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase" as const }}>{label}</span>
            <span style={{ fontSize: 12, color: "#cbd5e1", fontWeight: 600 }}>{value}</span>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    wrap: { display: "flex", flexDirection: "column", gap: 16 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "baseline" },
    title: { margin: 0, fontSize: 18, fontWeight: 700, color: "#f1f5f9" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 },
    card: { padding: 16, borderRadius: 12, border: "1px solid", cursor: "pointer", transition: "all 0.2s" },
    specs: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginTop: 4 },
};

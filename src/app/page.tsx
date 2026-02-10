"use client";

import React, { useState, useCallback } from "react";
import ModelUploader from "@/components/upload/ModelUploader";
import YachtViewer from "@/components/3d/YachtViewer";
import QuoteConfigurator from "@/components/quote/QuoteConfigurator";
import ROIComparison from "@/components/quote/ROIComparison";
import MaterialComparison from "@/components/quote/MaterialComparison";
import StatsOverview from "@/components/dashboard/StatsOverview";
import FleetGallery from "@/components/yacht/FleetGallery";
import LaserParameterPanel from "@/components/yacht/LaserParameterPanel";
import CleaningTimeline from "@/components/yacht/CleaningTimeline";
import EnvironmentalImpact from "@/components/yacht/EnvironmentalImpact";
import ServiceSchedule from "@/components/yacht/ServiceSchedule";
import type { SubstrateType } from "@/lib/types";

export default function DashboardPage() {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    const [modelId, setModelId] = useState<string | null>(null);
    const [modelUrl, setModelUrl] = useState<string>("");
    const [hullArea, setHullArea] = useState<number>(0);
    const [quote, setQuote] = useState<any | null>(null);
    const [substrate, setSubstrate] = useState<SubstrateType>("aluminum");
    const [viewMode, setViewMode] = useState<"normal" | "heatmap" | "before_after">("normal");
    const [cleanProgress, setCleanProgress] = useState(0);

    const handleUploadComplete = useCallback(async (id: string) => {
        setModelId(id);
        setModelUrl(`${API_BASE}/models/${id}/download`);

        // Poll backend for processing result (hull area)
        const poll = async () => {
            for (let i = 0; i < 20; i++) {
                try {
                    const res = await fetch(`${API_BASE}/models/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.status === "completed" && data.hull_area_m2) {
                            setHullArea(data.hull_area_m2);
                            setCleanProgress(0.1);
                            setViewMode("heatmap");
                            return;
                        }
                        if (data.status === "failed") {
                            setHullArea(data.hull_area_m2 || 100);
                            return;
                        }
                    }
                } catch { /* retry */ }
                await new Promise(r => setTimeout(r, 1000));
            }
            // Fallback if polling times out
            setHullArea(100);
        };
        poll();
    }, [API_BASE]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Header / Brand refresh */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                <div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Gestión de Activos Navales</h2>
                    <p style={{ color: "#94a3b8", margin: "4px 0 0" }}>Plataforma integral de gemelos digitales y mantenimiento láser de precisión.</p>
                </div>
            </div>

            {/* KPI Stats */}
            <section className="animate-fade-in">
                <StatsOverview />
            </section>

            {/* Row 1: Fleet Gallery (Full width) */}
            <section className="animate-slide-up">
                <FleetGallery />
            </section>

            {/* Row 2: Main 3D & Quote Config */}
            <section className="grid-2 animate-slide-up">
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div className="card" style={{ padding: 0, minHeight: 600, position: "relative" }}>
                        {modelId && modelUrl ? (
                            <>
                                <YachtViewer
                                    modelUrl={modelUrl}
                                    cleanProgress={cleanProgress}
                                    mode={viewMode}
                                />
                                <div style={{
                                    position: "absolute", top: 20, left: 20, display: "flex", gap: 8
                                }}>
                                    <button className={`btn ${viewMode === "normal" ? "btn-primary" : "btn-secondary"}`} onClick={() => setViewMode("normal")}>Vista 3D</button>
                                    <button className={`btn ${viewMode === "heatmap" ? "btn-primary" : "btn-secondary"}`} onClick={() => setViewMode("heatmap")}>Mapa de Calor</button>
                                    <button className={`btn ${viewMode === "before_after" ? "btn-primary" : "btn-secondary"}`} onClick={() => setViewMode("before_after")}>Comparar</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: 40, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ width: "100%", maxWidth: 500 }}>
                                    <ModelUploader yachtId="demo" onUploadComplete={handleUploadComplete} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {hullArea > 0 ? (
                        <>
                            <QuoteConfigurator
                                hullAreaM2={hullArea}
                                onQuoteReady={(q) => setQuote(q)}
                                defaultSubstrate={substrate}
                                onSubstrateChange={setSubstrate}
                            />
                            {quote && (
                                <div className="animate-slide-up">
                                    <ROIComparison
                                        hullAreaM2={hullArea}
                                        laserQuoteTotal={quote.cost_total}
                                        laserTimeH={quote.cleaning_time_h}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="card" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", textAlign: "center" }}>
                            <div>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>⬅️</div>
                                <h3>Selecciona o Sube un Modelo</h3>
                                <p>para análisis de superficie y presupuesto</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Row 3: Laser Params & Environmental */}
            <section className="grid-2 animate-slide-up">
                <LaserParameterPanel />
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <EnvironmentalImpact />
                    <div style={{ flex: 1 }}>
                        <ServiceSchedule />
                    </div>
                </div>
            </section>

            {/* Row 4: Timeline & Materials */}
            <section className="animate-slide-up" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
                <CleaningTimeline />
                {hullArea > 0 ? <MaterialComparison substrate={substrate} /> : (
                    <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                        Selecciona un sustrato para ver comparativa
                    </div>
                )}
            </section>
        </div>
    );
}

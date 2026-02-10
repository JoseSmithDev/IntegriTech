/**
 * Solutions Page — 360° Technical Recovery Solution.
 */
"use client";

import React from "react";
import SolutionsHero from "@/components/solutions/SolutionsHero";
import SectorSynergy from "@/components/solutions/SectorSynergy";
import ROIMatrix from "@/components/solutions/ROIMatrix";

export default function SolutionsPage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Hero: 360° Integrated solution */}
            <section className="animate-fade-in">
                <SolutionsHero />
            </section>

            {/* Sector Synergy: Maritime / Heritage / Industry */}
            <section className="animate-slide-up">
                <SectorSynergy />
            </section>

            {/* ROI Matrix: Integrated vs Traditional */}
            <section className="animate-slide-up">
                <ROIMatrix />
            </section>
        </div>
    );
}

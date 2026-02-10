/**
 * Cryogenic Cleaning Dashboard — Dry Ice Blasting service showcase.
 */
"use client";

import React from "react";
import CryoHero from "@/components/cryogenic/CryoHero";
import TechAdvantages from "@/components/cryogenic/TechAdvantages";
import SublimationDiagram from "@/components/cryogenic/SublimationDiagram";
import ApplicationsSector from "@/components/cryogenic/ApplicationsSector";
import CryoComparison from "@/components/cryogenic/CryoComparison";

export default function CryogenicPage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Hero */}
            <section className="animate-fade-in">
                <CryoHero />
            </section>

            {/* Technical Advantages */}
            <section className="animate-slide-up">
                <TechAdvantages />
            </section>

            {/* Sublimation Process Diagram */}
            <section className="animate-slide-up">
                <SublimationDiagram />
            </section>

            {/* Applications by Sector */}
            <section className="animate-slide-up">
                <ApplicationsSector />
            </section>

            {/* Method Comparison Table */}
            <section className="animate-slide-up">
                <CryoComparison />
            </section>
        </div>
    );
}
